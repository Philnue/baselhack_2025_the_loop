import logging
import uuid

from datetime import datetime
from typing import cast

import pandas as pd

from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from fastapi.exceptions import HTTPException
from langchain_core.runnables import RunnableConfig
from sqlalchemy.engine import Connection, Engine
from sqlmodel import Session

from app.consensus.category_selection import CategorySelectionGraphState, category_selection_graph
from app.consensus.dimension_extraction import DimensionExtractionGraphState, dimension_extraction_graph
from app.consensus.summary import SummaryGraphState, summary_graph
from app.consensus.summary_helpers import df_to_native_records
from app.database import get_session
from app.llm import llm
from app.models import Discussion, DiscussionUpdateWithReport
from app.settings import settings
from app.types import Category, Dimensions


logger = logging.getLogger("uvicorn")

router = APIRouter(
    prefix="/reports",
)


def generate_consensus_report(discussion_id: uuid.UUID, engine: Engine | Connection) -> None:
    with Session(engine) as session:
        db_discussion = cast(Discussion, session.get(Discussion, discussion_id))

        category_selection_graph_state = category_selection_graph.invoke(
            CategorySelectionGraphState(discussion=db_discussion),
            config=RunnableConfig(configurable={"llm": llm}),
        )

        logger.info(str(category_selection_graph_state))

        category: Category = Category(category_selection_graph_state["category"])

        discussion = DiscussionUpdateWithReport(report_progress=0.1)

        discussion_data = discussion.model_dump(exclude_unset=True)
        db_discussion.sqlmodel_update(discussion_data)
        session.add(db_discussion)
        session.commit()
        session.refresh(db_discussion)

        dimension_extraction_graph_state = dimension_extraction_graph.invoke(
            DimensionExtractionGraphState(discussion=db_discussion, category=category),
            config=RunnableConfig(configurable={"llm": llm}),
        )

        logger.info(str(dimension_extraction_graph_state))

        dimensions: list[Dimensions] = dimension_extraction_graph_state["dimensions"]

        discussion = DiscussionUpdateWithReport(report_progress=0.5)

        discussion_data = discussion.model_dump(exclude_unset=True)
        db_discussion.sqlmodel_update(discussion_data)
        session.add(db_discussion)
        session.commit()
        session.refresh(db_discussion)

        summary_graph_state = summary_graph.invoke(
            SummaryGraphState(
                discussion=db_discussion,
                category=category,
                dimensions=dimensions,
            )
        )

        logger.info(str(summary_graph_state))

        theme_board = cast(pd.DataFrame, summary_graph_state["theme_board"])
        sentiment_table = cast(pd.DataFrame, summary_graph_state["sentiment_table"])
        emotion_table = cast(pd.DataFrame, summary_graph_state["emotion_table"])
        payload = cast(dict, summary_graph_state["payload"])
        summary = cast(str, summary_graph_state["summary"])

        report = {
            "theme_board": df_to_native_records(theme_board),
            "sentiment_table": df_to_native_records(sentiment_table),
            "emotion_table": df_to_native_records(emotion_table),
            "payload": payload,
            "summary": summary,
        }

        discussion = DiscussionUpdateWithReport(report=report, report_progress=1)

        discussion_data = discussion.model_dump(exclude_unset=True)
        db_discussion.sqlmodel_update(discussion_data)
        session.add(db_discussion)
        session.commit()
        session.refresh(db_discussion)


@router.post("/{discussion_id}", status_code=status.HTTP_204_NO_CONTENT)
def start_consensus_report_generation(
    request: Request,
    discussion_id: uuid.UUID,
    owner_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
) -> None:
    if settings.read_only:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create consensus report when read-only mode is enabled",
        )

    db_discussion = session.get(Discussion, discussion_id)
    if not db_discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found",
        )

    if db_discussion.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to create consensus report",
        )

    # TODO: For testing purposes, we are ignoring, whether the report is already generating or not...
    # if db_discussion.report is not None or db_discussion.report_progress is not None:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Consensus report is already generating"
    #         if db_discussion.report is None
    #         else "Consensus report already generated",
    #     )

    discussion = DiscussionUpdateWithReport(report_progress=0)

    discussion_data = discussion.model_dump(exclude_unset=True)
    db_discussion.sqlmodel_update(discussion_data, update={"updated_at": datetime.now()})
    session.add(db_discussion)
    session.commit()
    session.refresh(db_discussion)

    background_tasks.add_task(generate_consensus_report, discussion_id, request.app.state.engine)
