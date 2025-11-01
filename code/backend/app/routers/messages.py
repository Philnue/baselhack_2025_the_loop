import uuid

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlmodel import Session

from app.database import get_session
from app.models.discussion import (
    Discussion,
    Message,
    MessageCreate,
    MessagePublic,
    MessageUpdate,
)


router = APIRouter(
    prefix="/messages",
)


@router.post("/", response_model=MessagePublic)
def create_message(message: MessageCreate, session: Session = Depends(get_session)) -> Message:
    db_discussion = session.get(Discussion, message.discussion_id)
    if not db_discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found",
        )

    db_message = Message.model_validate(message)
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_message(message_id: uuid.UUID, owner_id: uuid.UUID, session: Session = Depends(get_session)) -> None:
    db_message = session.get(Message, message_id)
    if not db_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    if db_message.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to delete this message",
        )

    session.delete(db_message)
    session.commit()


@router.patch("/{discussion_id}", response_model=MessagePublic)
def update_message(message_id: uuid.UUID, message: MessageUpdate, session: Session = Depends(get_session)) -> Message:
    db_message = session.get(Message, message_id)
    if not db_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    if db_message.owner_id != message.owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to update this message",
        )

    message_data = message.model_dump(exclude={"owner_id"}, exclude_unset=True)
    db_message.sqlmodel_update(message_data)
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message
