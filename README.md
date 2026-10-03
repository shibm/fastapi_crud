

# FastAPI CRUD API

A learning project for building a RESTful CRUD API using:

- FastAPI
- SQLAlchemy
- MySQL
- PyMySQL
- Pydantic
- Uvicorn
- uv
- Layered architecture

The project demonstrates how to structure a FastAPI application using separate:

- Routers
- Services
- Repositories
- Models
- Schemas
- Database configuration

---

# 1. Project Goals

The goal of this project is to understand how to build a FastAPI application using a production-style layered architecture.

We will learn:

1. How FastAPI works
2. How to create API routes
3. How to connect FastAPI to MySQL
4. How SQLAlchemy works
5. How to create database models
6. How Pydantic schemas work
7. How dependency injection works
8. How to separate routes, business logic and database logic
9. How to implement CRUD operations
10. How to handle errors
11. How to handle duplicate records
12. How to use HTTP status codes
13. How to organize a scalable FastAPI project

---

# 2. Technology Stack

| Technology | Purpose |
|---|---|
| FastAPI | Web framework |
| Uvicorn | ASGI server |
| SQLAlchemy | ORM / database toolkit |
| PyMySQL | MySQL driver |
| MySQL | Relational database |
| Pydantic | Request/response validation |
| uv | Python package and environment management |
| Swagger UI | API testing/documentation |
| Git | Version control |
| GitHub | Remote repository |

---

# 3. Project Structure

The project follows a layered architecture.

```text
py/
│
├── .venv/
│
├── src/
│   └── py/
│       │
│       ├── __init__.py
│       ├── main.py
│       │
│       ├── config/
│       │   └── __init__.py
│       │
│       ├── database/
│       │   ├── __init__.py
│       │   └── connection.py
│       │
│       ├── models/
│       │   ├── __init__.py
│       │   └── user.py
│       │
│       ├── schemas/
│       │   ├── __init__.py
│       │   └── user.py
│       │
│       ├── repositories/
│       │   ├── __init__.py
│       │   └── user.py
│       │
│       ├── services/
│       │   ├── __init__.py
│       │   └── user.py
│       │
│       └── routers/
│           ├── __init__.py
│           └── user.py
│
├── .gitignore
├── .python-version
├── pyproject.toml
├── README.md
└── uv.lock
````

---

# 4. Why Use This Structure?

Instead of putting everything into `main.py`, responsibilities are separated.

For example, this is NOT what we want:

```text
main.py
│
├── routes
├── database queries
├── validation
├── business logic
├── error handling
└── models
```

As the application grows, `main.py` becomes difficult to maintain.

Instead:

```text
Router
   ↓
Service
   ↓
Repository
   ↓
Database
```

Each layer has a specific responsibility.

---

# 5. Request Flow

A request such as:

```http
POST /users/
```

travels through the application like this:

```text
Client
   │
   │ POST /users/
   ▼
┌───────────────┐
│    Router     │
│ routers/user  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    Service    │
│ services/user │
└───────┬───────┘
        │
        ▼
┌──────────────────┐
│    Repository    │
│ repositories/user│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    SQLAlchemy    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      MySQL       │
│     new_py       │
└──────────────────┘
```

The response travels back in the opposite direction:

```text
MySQL
   ↓
Repository
   ↓
Service
   ↓
Router
   ↓
Client
```

---

# 6. Step 1 - Create the Python Project

The project uses `uv` for Python environment and dependency management.

Initialize the project:

```bash
uv init
```

Create/synchronize the virtual environment:

```bash
uv sync
```

Activate the virtual environment if required:

```bash
source .venv/bin/activate
```

Check Python:

```bash
python --version
```

---

# 7. Step 2 - Install Dependencies

Install FastAPI:

```bash
uv add fastapi
```

Install Uvicorn:

```bash
uv add "uvicorn[standard]"
```

Install SQLAlchemy:

```bash
uv add sqlalchemy
```

Install the MySQL driver:

```bash
uv add pymysql
```

The `uv.lock` file keeps dependency versions reproducible.

---

# 8. Step 3 - Create MySQL Database

Open MySQL Workbench.

Create the database:

```sql
CREATE DATABASE new_py;
```

Verify:

```sql
SHOW DATABASES;
```

The database used by this project is:

```text
new_py
```

---

# 9. Step 4 - Configure SQLAlchemy

Create:

```text
src/py/database/connection.py
```

Example:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


DATABASE_URL = "mysql+pymysql://root:PASSWORD@127.0.0.1:3306/new_py"

engine = create_engine(
    DATABASE_URL,
    echo=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

## Important

Do not commit real database passwords to GitHub.

For a real application, the database URL should eventually come from environment variables.

---

# 10. Understanding the Database Connection

The URL:

```text
mysql+pymysql://root:PASSWORD@127.0.0.1:3306/new_py
```

means:

```text
mysql
   ↓
Database type

pymysql
   ↓
Python MySQL driver

root
   ↓
MySQL username

PASSWORD
   ↓
MySQL password

127.0.0.1
   ↓
Local machine

3306
   ↓
MySQL port

new_py
   ↓
Database name
```

---

# 11. Step 5 - Test Database Connection

SQLAlchemy can execute a simple query:

```python
from sqlalchemy import text
```

Then:

```python
with engine.connect() as connection:
    connection.execute(text("SELECT 1"))
```

If the query succeeds, the application can communicate with MySQL.

A successful log looks like:

```text
SELECT 1

✅ Database connected successfully!
```

The important concept is:

```text
FastAPI
   ↓
SQLAlchemy
   ↓
PyMySQL
   ↓
MySQL
```

---

# 12. Step 6 - Create the User Model

Create:

```text
src/py/models/user.py
```

Example:

```python
from sqlalchemy import Column, Integer, String

from py.database.connection import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False
    )
```

---

# 13. What Is a Model?

The SQLAlchemy model represents a database table.

This:

```python
class User(Base):
```

represents:

```text
users
```

And:

```python
id
name
email
```

represent database columns.

Conceptually:

```text
Python Model
     │
     ▼
SQLAlchemy
     │
     ▼
MySQL Table
```

The model defines the database structure.

---

# 14. Step 7 - Create Database Tables

In `main.py`, import the model and Base:

```python
from fastapi import FastAPI

from py.database.connection import Base, engine
from py.models.user import User


app = FastAPI()


Base.metadata.create_all(bind=engine)
```

`create_all()` checks the models registered with SQLAlchemy and creates missing tables.

After running the application, MySQL should contain:

```text
new_py
└── users
```

---

# 15. Why `Base.metadata.create_all()`?

`Base` is the parent class used by SQLAlchemy models.

When we create:

```python
class User(Base):
```

SQLAlchemy registers the `User` model with:

```python
Base.metadata
```

Therefore:

```python
Base.metadata.create_all(bind=engine)
```

means:

> Create all tables known to SQLAlchemy that don't already exist.

---

# 16. Step 8 - Verify the Table in MySQL

In MySQL Workbench:

```sql
USE new_py;

SHOW TABLES;
```

You should see:

```text
users
```

Then:

```sql
SELECT * FROM users;
```

---

# 17. Step 9 - Create Pydantic Schemas

SQLAlchemy models and API schemas have different responsibilities.

Create:

```text
src/py/schemas/user.py
```

Example:

```python
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
```

The schema validates incoming API data.

For example:

```json
{
    "name": "Manoj",
    "email": "manoj@123gmail.com"
}
```

FastAPI validates the request before sending it to the service layer.

---

# 18. Model vs Schema

This is an important FastAPI concept.

### SQLAlchemy Model

Used for:

```text
Database
```

Example:

```python
class User(Base):
```

### Pydantic Schema

Used for:

```text
API request/response
```

Example:

```python
class UserCreate(BaseModel):
```

So:

```text
API
 │
 ▼
Pydantic Schema
 │
 ▼
Service
 │
 ▼
SQLAlchemy Model
 │
 ▼
MySQL
```

---

# 19. Step 10 - Create Database Dependency

The database session should be created per request.

We use:

```python
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

FastAPI can inject this using:

```python
Depends(get_db)
```

Example:

```python
from fastapi import Depends
from sqlalchemy.orm import Session

from py.database.connection import get_db


def example(
    db: Session = Depends(get_db)
):
    ...
```

This avoids manually creating and closing database sessions in every route.

---

# 20. Step 11 - Create Repository Layer

Create:

```text
src/py/repositories/user.py
```

The repository is responsible for database operations.

Example:

```python
from sqlalchemy.orm import Session

from py.models.user import User


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
        user: User
    ):
        db.add(user)
        db.commit()
        db.refresh(user)

        return user
```

---

# 21. Why Do We Need a Repository?

The repository owns database operations.

For example:

```python
db.query(User)
```

belongs in the repository.

The service should not need to know exactly how the SQLAlchemy query works.

Instead:

```text
Service
   ↓
UserRepository.get_by_email()
```

The service asks:

> Does this user exist?

The repository handles:

> How do I query MySQL to find the user?

---

# 22. Step 12 - Create Service Layer

Create:

```text
src/py/services/user.py
```

The service contains business logic.

Example:

```python
from fastapi import HTTPException
from sqlalchemy.orm import Session

from py.models.user import User
from py.repositories.user import UserRepository


class UserService:

    @staticmethod
    def create_user(
        db: Session,
        name: str,
        email: str
    ):

        existing_user = UserRepository.get_by_email(
            db,
            email
        )

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="User with this email already exists"
            )

        user = User(
            name=name,
            email=email
        )

        return UserRepository.create(
            db,
            user
        )
```

---

# 23. Why Do We Need a Service Layer?

Business rules belong here.

For example:

```text
Is this email already registered?
```

That is a business rule.

Therefore:

```text
Router
   ↓
Service
   ↓
Repository
```

The router should not contain business logic.

The repository should not contain business decisions.

---

# 24. Step 13 - Create Router

Create:

```text
src/py/routers/user.py
```

Example:

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from py.database.connection import get_db
from py.schemas.user import UserCreate
from py.services.user import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    return UserService.create_user(
        db,
        user.name,
        user.email
    )
```

---

# 25. Why Do We Need Routers?

The router is responsible for HTTP concerns.

For example:

```text
POST /users/
GET /users/
GET /users/{id}
PUT /users/{id}
DELETE /users/{id}
```

The router determines:

* HTTP method
* URL
* request schema
* response
* dependencies

It should not contain complicated database logic.

---

# 26. Step 14 - Register the Router

In:

```text
src/py/main.py
```

add:

```python
from fastapi import FastAPI

from py.database.connection import Base, engine
from py.routers.user import router as user_router


app = FastAPI()


Base.metadata.create_all(bind=engine)


app.include_router(user_router)
```

Now FastAPI knows about:

```text
/users/
```

---

# 27. Final Request Architecture

The complete application now looks like:

```text
                    HTTP Request
                         │
                         ▼
                ┌─────────────────┐
                │     Router      │
                │  routers/user   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │     Schema      │
                │  Pydantic       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │     Service     │
                │ Business Logic  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   Repository    │
                │ Database Logic  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │    SQLAlchemy   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │      MySQL      │
                └─────────────────┘
```

---

# 28. Step 15 - Run the Application

From the project root:

```bash
uv run fastapi dev src/py/main.py
```

The development server will normally be available at:

```text
http://127.0.0.1:8000
```

---

# 29. Step 16 - Swagger UI

FastAPI automatically provides interactive API documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

Swagger allows you to:

* See API endpoints
* Enter request data
* Execute requests
* Inspect responses
* Test CRUD operations

---

# 30. Create User

Request:

```http
POST /users/
```

Body:

```json
{
    "name": "Manoj",
    "email": "manoj@123gmail.com"
}
```

The request travels:

```text
POST /users/
      ↓
User Router
      ↓
User Schema
      ↓
User Service
      ↓
User Repository
      ↓
SQLAlchemy
      ↓
MySQL
```

---

# 31. Duplicate User Handling

The email column has:

```python
unique=True
```

Therefore MySQL will not allow duplicate emails.

We also check the user before inserting:

```python
existing_user = UserRepository.get_by_email(
    db,
    email
)

if existing_user:
    raise HTTPException(
        status_code=409,
        detail="User with this email already exists"
    )
```

Therefore:

```text
First request
     ↓
Email doesn't exist
     ↓
Create user
     ↓
201/200 response


Second request
     ↓
Email already exists
     ↓
409 Conflict
```

Expected response:

```json
{
    "detail": "User with this email already exists"
}
```

---

# 32. Why Use HTTP 409?

HTTP `409 Conflict` is appropriate when the request conflicts with the current state of the resource.

In this case:

```text
Client wants to create:

manoj@123gmail.com

But:

manoj@123gmail.com

already exists.
```

Therefore:

```http
409 Conflict
```

---

# 33. Why Not Return 500?

`500 Internal Server Error` means the server encountered an unexpected failure.

A duplicate email is not an unexpected server failure.

It is an expected application condition.

Therefore:

```text
Duplicate email
      ↓
409 Conflict
```

rather than:

```text
Duplicate email
      ↓
500 Internal Server Error
```

---

# 34. Database-Level Protection

Even though the service checks for duplicates, the database constraint is still important:

```python
email = Column(
    String(150),
    unique=True,
    nullable=False
)
```

Why?

Imagine two requests arrive almost simultaneously:

```text
Request A ────────┐
                  ├── Check email
Request B ────────┘
```

Both might check before either inserts.

The database's `UNIQUE` constraint provides the final protection.

Therefore:

```text
Application validation
        +
Database constraint
        =
Safer data integrity
```

---

# 35. SQLAlchemy Debug Logging

The project uses:

```python
engine = create_engine(
    DATABASE_URL,
    echo=True
)
```

`echo=True` prints SQL queries to the terminal.

For example:

```text
SELECT users.id,
       users.name,
       users.email
FROM users
WHERE users.email = %(email_1)s
LIMIT %(param_1)s
```

This is very useful while learning SQLAlchemy.

It allows us to understand:

```text
Python code
     ↓
SQLAlchemy
     ↓
SQL query
     ↓
MySQL
```

For production, SQL logging should normally be configured appropriately rather than blindly leaving verbose SQL output enabled.

---

# 36. Common Errors Encountered

## Python 3.9 and `str | None`

Python 3.10 introduced the `X | Y` union syntax.

If using Python 3.9:

```python
q: str | None
```

can cause:

```text
TypeError:
unsupported operand type(s) for |: 'type' and 'NoneType'
```

For Python 3.9, use:

```python
from typing import Optional

q: Optional[str] = None
```

Alternatively, use a newer Python version.

---

# 37. Missing Import Errors

Example:

```text
NameError: name 'Optional' is not defined
```

Fix:

```python
from typing import Optional
```

Similarly:

```text
NameError: name 'HTTPException' is not defined
```

Fix:

```python
from fastapi import HTTPException
```

And:

```text
NameError: name 'text' is not defined
```

Fix:

```python
from sqlalchemy import text
```

General rule:

If Python says:

```text
NameError: name 'X' is not defined
```

check whether `X` has been imported or defined.

---

# 38. Database Connection Test

A simple database health check can use:

```python
from sqlalchemy import text

with engine.connect() as connection:
    connection.execute(text("SELECT 1"))
```

Successful output:

```text
SELECT 1

✅ Database connected successfully!
```

This confirms that:

```text
FastAPI
   ↓
SQLAlchemy
   ↓
PyMySQL
   ↓
MySQL
```

is working.

---

# 39. Error Handling Architecture

A simple implementation can use:

```python
from fastapi import HTTPException
```

and:

```python
raise HTTPException(
    status_code=409,
    detail="User with this email already exists"
)
```

For a larger application, a better architecture is to create custom application exceptions.

For example:

```text
exceptions/
├── __init__.py
├── user.py
└── handlers.py
```

Then:

```text
Service
   ↓
UserAlreadyExistsException
   ↓
Global Exception Handler
   ↓
HTTP 409
```

This keeps business exceptions separate from HTTP concerns.

---

# 40. CRUD Roadmap

The current project starts with:

```text
CREATE
```

The complete CRUD implementation will contain:

```text
CREATE
POST /users/

READ
GET /users/
GET /users/{id}

UPDATE
PUT /users/{id}

DELETE
DELETE /users/{id}
```

---

# 41. CRUD Architecture

Every operation follows the same architecture:

```text
Router
   ↓
Service
   ↓
Repository
   ↓
SQLAlchemy
   ↓
MySQL
```

For example:

```text
POST /users/
        ↓
create_user()
        ↓
UserService.create_user()
        ↓
UserRepository.create()
        ↓
db.add()
        ↓
db.commit()
```

---

# 42. CREATE

### Endpoint

```http
POST /users/
```

### Purpose

Create a new user.

### Flow

```text
Request
   ↓
Validate input
   ↓
Check duplicate email
   ↓
Create SQLAlchemy User
   ↓
Insert into MySQL
   ↓
Commit transaction
   ↓
Return user
```

---

# 43. READ ALL

### Endpoint

```http
GET /users/
```

Purpose:

Return all users.

Flow:

```text
GET /users/
      ↓
Router
      ↓
Service
      ↓
Repository
      ↓
SELECT users
      ↓
Return users
```

---

# 44. READ ONE

### Endpoint

```http
GET /users/{id}
```

Example:

```http
GET /users/1
```

Purpose:

Find one user by ID.

If the user doesn't exist:

```http
404 Not Found
```

Example response:

```json
{
    "detail": "User not found"
}
```

---

# 45. UPDATE

### Endpoint

```http
PUT /users/{id}
```

Example:

```http
PUT /users/1
```

Body:

```json
{
    "name": "Manoj Kumar",
    "email": "manoj@example.com"
}
```

Flow:

```text
Request
   ↓
Validate data
   ↓
Find user
   ↓
Check business rules
   ↓
Update model
   ↓
Commit transaction
   ↓
Return updated user
```

---

# 46. DELETE

### Endpoint

```http
DELETE /users/{id}
```

Example:

```http
DELETE /users/1
```

Flow:

```text
Request
   ↓
Find user
   ↓
Delete user
   ↓
Commit
   ↓
Return response
```

If the user doesn't exist:

```http
404 Not Found
```

---

# 47. HTTP Status Codes

The API should use meaningful status codes.

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 200    | Successful request                       |
| 201    | Resource created                         |
| 204    | Successful request with no response body |
| 400    | Bad request                              |
| 404    | Resource not found                       |
| 409    | Resource conflict                        |
| 422    | Validation error                         |
| 500    | Unexpected server error                  |

Example:

```text
Create user successfully
        ↓
201 Created

User doesn't exist
        ↓
404 Not Found

Email already exists
        ↓
409 Conflict

Invalid request data
        ↓
422 Unprocessable Entity

Unexpected server failure
        ↓
500 Internal Server Error
```

---

# 48. Important Separation of Responsibilities

## Router

Responsible for:

```text
HTTP
Routes
Request
Response
Dependencies
```

Should NOT contain:

```text
Complex business logic
Direct database queries
```

---

## Service

Responsible for:

```text
Business logic
Business rules
Application decisions
```

Example:

```text
Does this email already exist?
```

---

## Repository

Responsible for:

```text
Database queries
Insert
Select
Update
Delete
```

---

## Model

Responsible for:

```text
Database table definition
```

---

## Schema

Responsible for:

```text
API validation
Request structure
Response structure
```

---

## Database

Responsible for:

```text
Persistent data
Constraints
Transactions
Indexes
```

---

# 49. Complete Architecture

```text
                         CLIENT
                           │
                           ▼
                    ┌──────────────┐
                    │    FastAPI   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Router    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Schema    │
                    │   Pydantic   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Service    │
                    │ Business     │
                    │ Logic        │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Repository   │
                    │ DB Queries   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  SQLAlchemy  │
                    │     ORM      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   PyMySQL    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    MySQL     │
                    │   new_py     │
                    └──────────────┘
```

---

# 50. Development Commands

Start development server:

```bash
uv run fastapi dev src/py/main.py
```

Synchronize dependencies:

```bash
uv sync
```

Add dependency:

```bash
uv add <package>
```

Remove dependency:

```bash
uv remove <package>
```

Check Git status:

```bash
git status
```

Create commit:

```bash
git add .
git commit -m "message"
```

Push:

```bash
git push
```

---

# 51. Git Workflow

The project uses Git for version control.

Typical workflow:

```text
Make changes
    ↓
git status
    ↓
git add .
    ↓
git commit -m "message"
    ↓
git push
```

For feature development:

```bash
git checkout -b feature/user-crud
```

Then:

```bash
git add .
git commit -m "implement user CRUD"
git push -u origin feature/user-crud
```

A Pull Request can then be opened on GitHub.

---

# 52. Development Roadmap

The project is being developed incrementally.

## Phase 1 - FastAPI Basics

* [x] Create FastAPI application
* [x] Create routes
* [x] Run Uvicorn
* [x] Swagger documentation
* [x] Path parameters
* [x] Query parameters

## Phase 2 - Database

* [x] Install SQLAlchemy
* [x] Install PyMySQL
* [x] Create MySQL database
* [x] Configure SQLAlchemy
* [x] Create database session
* [x] Test database connection

## Phase 3 - Architecture

* [x] Create models
* [x] Create schemas
* [x] Create repositories
* [x] Create services
* [x] Create routers
* [x] Separate responsibilities

## Phase 4 - User CRUD

* [x] Create user
* [ ] Get all users
* [ ] Get user by ID
* [ ] Update user
* [ ] Delete user

## Phase 5 - Error Handling

* [x] Duplicate email detection
* [x] HTTP 409 response
* [ ] Custom exceptions
* [ ] Global exception handlers
* [ ] Standardized error response

## Phase 6 - Production Improvements

* [ ] Environment variables
* [ ] Alembic migrations
* [ ] Authentication
* [ ] Authorization
* [ ] Pagination
* [ ] Logging
* [ ] Testing
* [ ] Docker
* [ ] CI/CD
* [ ] Production deployment

---

# 53. What We Are Learning

This project is not only about making CRUD endpoints.

The main purpose is understanding how a production backend is structured.

The important concepts are:

```text
HTTP
 ↓
FastAPI
 ↓
Dependency Injection
 ↓
Pydantic
 ↓
Service Layer
 ↓
Repository Pattern
 ↓
SQLAlchemy
 ↓
Transactions
 ↓
MySQL
```

Once this foundation is understood, it becomes easier to work with larger systems such as:

```text
Authentication
Microservices
Redis
Kafka
RabbitMQ
PostgreSQL
Docker
AWS
CI/CD
```

---

# 54. Next Steps

The next implementation steps are:

```text
1. GET /users/
2. GET /users/{id}
3. PUT /users/{id}
4. DELETE /users/{id}
5. Proper response schemas
6. Custom exceptions
7. Global exception handlers
8. Environment variables
9. Alembic migrations
10. Automated tests
```

The final target architecture will be:

```text
FastAPI
    │
    ├── Routers
    │
    ├── Schemas
    │
    ├── Services
    │
    ├── Repositories
    │
    ├── Models
    │
    ├── Exceptions
    │
    └── Database
            │
            ▼
          MySQL
```

This structure provides a clean foundation for building larger FastAPI applications.

````

### One correction I'd make to your current project

Your current structure is already moving in the right direction:

```text
routers/
services/
repositories/
models/
schemas/
database/
````

So **don't put CRUD logic back into `main.py`**. Keep `main.py` very small. Its job should eventually be mostly application setup:

```python
from fastapi import FastAPI

from py.database.connection import Base, engine
from py.routers.user import router as user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
```

Then the actual flow remains:

**Router → Schema → Service → Repository → SQLAlchemy → MySQL**

That's the architecture I recommend you continue learning with.
