from sqlalchemy.orm import Session
from fastapi import HTTPException

from py.repositories.user import UserRepository
from py.schemas.user import UserCreate


class UserService:

    @staticmethod
    def create_user(
        db: Session,
        data: UserCreate
    ):
        existing_user = UserRepository.get_by_email(
            db,
            data.email
        )

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="User with this email already exists"
            )

        return UserRepository.create(
            db,
            data
        )