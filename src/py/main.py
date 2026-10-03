from typing import Optional

from fastapi import FastAPI
from py.database.connection import test_connection, Base, engine
from py.models.user import User

app = FastAPI()
test_connection()
Base.metadata.create_all(bind=engine) # this line helps to create db



@app.get("/")
async def home():
    return {"message": "Hello World"}



