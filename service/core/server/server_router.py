from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from core.db.base import SessionLocal

from core.server import server_crud


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/api/server", tags=["server"])


# get all server temperature
@router.get("/all-temp")
def get_servers_temp(db: Session = Depends(get_db)):
    temps = server_crud.read_all_server_temp(db=db)
    return temps


# get server temperature by server id
@router.get("/temp")
def get_servers_temp_by_id(server_id: int, db: Session = Depends(get_db)):
    temps = server_crud.read_server_temp(server_id=server_id, db=db)
    return temps


# get server temperature by server id and period
@router.get("/temp-date")
def get_servers_temp_by_date(
    server_id: int, start: str, end: str, db: Session = Depends(get_db)
):
    temps = server_crud.read_server_temp_by_date(
        server_id=server_id, start=start, end=end, db=db
    )
    return temps


# get all server load
@router.get("/all-load")
def get_server_load(server_id: int, db: Session = Depends(get_db)):
    loads = server_crud.read_all_server_load(server_id=server_id, db=db)
    # print(loads)
    return loads


# get server load by server id
@router.get("/load")
def get_server_load(server_id: int, db: Session = Depends(get_db)):
    loads = server_crud.read_server_load(server_id=server_id, db=db)
    # print(loads)
    return loads


# get server load by server id and date
@router.get("/load-date")
def get_server_load_by_date(
    server_id: int, start: str, end: str, db: Session = Depends(get_db)
):
    loads, server_ids = server_crud.read_server_load_by_date(
        server_id=server_id, start=start, end=end, db=db
    )
    return {"load": loads, "server_ids": sorted(server_ids)}
