import uuid

from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from fastapi.exceptions import HTTPException
from sqlalchemy.engine import Connection, Engine
from sqlmodel import Session

from app.database import get_session
from app.models.discussion import Discussion, DiscussionUpdateWithReport
from app.settings import settings


router = APIRouter(
    prefix="/reports",
)


def generate_consensus_report(discussion_id: uuid.UUID, engine: Engine | Connection) -> None:
    with Session(engine) as session:
        pass


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

    if db_discussion.report is not None or db_discussion.report_progress is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consensus report is already generating"
            if db_discussion.report is None
            else "Consensus report already generated",
        )

    discussion = DiscussionUpdateWithReport(report_progress=0)

    discussion_data = discussion.model_dump(exclude_unset=True)
    db_discussion.sqlmodel_update(discussion_data, update={"updated_at": datetime.now()})
    session.add(db_discussion)
    session.commit()
    session.refresh(db_discussion)

    background_tasks.add_task(generate_consensus_report, discussion_id, request.app.state.engine)
