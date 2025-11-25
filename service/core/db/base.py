import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    DB_USER = os.environ.get("db_user", "appuser")
    DB_PASSWORD = os.environ.get("db_password", "apppass")
    DB_HOST = os.environ.get("db_host", "localhost")
    DB_PORT = os.environ.get("db_port", "5432")
    DB_NAME = os.environ.get("db_name", "energy_monitor")

    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

print(DATABASE_URL)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
