from typing import Optional
from sqlalchemy.exc import IntegrityError

from fastapi import FastAPI
from py.database.connection import test_connection, Base, engine
from py.models.user import User
from py.routers.user import router as user_router
from py.exceptions.handlers import integrity_error_handler


app = FastAPI()
test_connection()
Base.metadata.create_all(bind=engine) # this line helps to create db

app.add_exception_handler(
    IntegrityError,
    integrity_error_handler
)
app.include_router(user_router)


@app.get("/")
async def home():
    return {"message": "Hello World"}



