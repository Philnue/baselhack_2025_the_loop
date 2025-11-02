import uuid

from datetime import datetime

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import (
    Discussion,
    DiscussionCreate,
    DiscussionPublic,
    DiscussionPublicWithMessages,
    DiscussionUpdate,
)


router = APIRouter(
    prefix="/discussions",
)


@router.get("/", response_model=list[DiscussionPublic])
def read_discussions(session: Session = Depends(get_session)) -> list[Discussion]:
    statement = select(Discussion)
    return list(session.exec(statement).all())


@router.post("/", response_model=DiscussionPublic)
def create_discussion(discussion: DiscussionCreate, session: Session = Depends(get_session)) -> Discussion:
    db_discussion = Discussion.model_validate(discussion)
    session.add(db_discussion)
    session.commit()
    session.refresh(db_discussion)
    return db_discussion


@router.get("/{discussion_id}", response_model=DiscussionPublicWithMessages)
def read_discussion(discussion_id: uuid.UUID, session: Session = Depends(get_session)) -> Discussion:
    db_discussion = session.get(Discussion, discussion_id)
    if not db_discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found",
        )

    return db_discussion


@router.delete("/{discussion_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_discussion(discussion_id: uuid.UUID, owner_id: uuid.UUID, session: Session = Depends(get_session)) -> None:
    db_discussion = session.get(Discussion, discussion_id)
    if not db_discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found",
        )

    if db_discussion.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to delete this discussion",
        )

    session.delete(db_discussion)
    session.commit()


@router.patch("/{discussion_id}", response_model=DiscussionPublic)
def update_discussion(
    discussion_id: uuid.UUID, discussion: DiscussionUpdate, session: Session = Depends(get_session)
) -> Discussion:
    db_discussion = session.get(Discussion, discussion_id)
    if not db_discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found",
        )

    if db_discussion.owner_id != discussion.owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to update this discussion",
        )

    discussion_data = discussion.model_dump(exclude={"owner_id"}, exclude_unset=True)
    db_discussion.sqlmodel_update(discussion_data, update={"updated_at": datetime.now()})
    session.add(db_discussion)
    session.commit()
    session.refresh(db_discussion)
    return db_discussion
