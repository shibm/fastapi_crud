from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from py.database.connection import get_db
from py.schemas.user import UserCreate, UserResponse
from py.services.user import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserResponse)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db)
):

    return UserService.create_user(
        db,
        data
    )