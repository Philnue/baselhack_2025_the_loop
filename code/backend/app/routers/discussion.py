import uuid

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlmodel import Session, select

from app.database.models.discussion import Discussion, DiscussionCreate, DiscussionPublic
from app.database.session import get_session


router = APIRouter(
    prefix="/discussion",
)


@router.post("/", response_model=DiscussionPublic)
def create_discussion(discussion: DiscussionCreate, session: Session = Depends(get_session)) -> Discussion:
    db_discussion = Discussion.model_validate(discussion)
    session.add(db_discussion)
    session.commit()
    session.refresh(db_discussion)
    return db_discussion


@router.get("/{discussion_id}")
def read_discussion(discussion_id: uuid.UUID, session: Session = Depends(get_session)) -> Discussion:
    discussion = session.get(Discussion, discussion_id)
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found",
        )

    return discussion


@router.delete("/{discussion_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_discussion(discussion_id: uuid.UUID, session: Session = Depends(get_session)) -> None:
    discussion = session.get(Discussion, discussion_id)
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found",
        )

    session.delete(discussion)
    session.commit()
