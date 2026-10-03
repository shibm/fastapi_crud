from sqlalchemy.orm import Session

from py.models.user import User
from py.schemas.user import UserCreate


class UserRepository:

    @staticmethod
    def get_by_email(
        db: Session,
        email: str
    ):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        data: UserCreate
    ):
        user = User(
            name=data.name,
            email=data.email
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user