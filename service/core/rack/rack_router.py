from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from core.db.base import SessionLocal

from core.rack import rack_crud


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/api/rack", tags=["rack"])


# get inner temperature by rack id
@router.get("/inner-temp")
def get_rack_temp_by_id(rack_id: int, db: Session = Depends(get_db)):
    temps = rack_crud.read_rack_inner_temp(rack_id=rack_id, db=db)
    return temps


# get outer temperature by rack id
@router.get("/outer-temp")
def get_rack_temp_by_id(rack_id: int, db: Session = Depends(get_db)):
    temps = rack_crud.read_rack_outer_temp(rack_id=rack_id, db=db)
    return temps


# get inner temperature by rack id and period
@router.get("/inner-temp-date")
def get_rack_temp_by_date(
    rack_id: int, start: str, end: str, db: Session = Depends(get_db)
):
    temps, ids = rack_crud.read_rack_inner_temp_by_date(
        rack_id=rack_id, start=start, end=end, db=db
    )
    return {"data": temps, "ids": ids}


# get outer temperature by rack id and period
@router.get("/outer-temp-date")
def get_rack_temp_by_date(
    rack_id: int, start: str, end: str, db: Session = Depends(get_db)
):
    temps, ids = rack_crud.read_rack_outer_temp_by_date(
        rack_id=rack_id, start=start, end=end, db=db
    )
    return {"data": temps, "ids": ids}


# get load by rack id
@router.get("/load")
def get_rack_load_by_id(rack_id: int, db: Session = Depends(get_db)):
    loads = rack_crud.read_rack_load(rack_id=rack_id, db=db)
    return loads


# get load by rack id and period
@router.get("/load-date")
def get_rack_load_by_date(
    rack_id: int, start: str, end: str, db: Session = Depends(get_db)
):
    loads, ids = rack_crud.read_rack_load_by_date(
        rack_id=rack_id, start=start, end=end, db=db
    )
    return {"data": loads, "ids": ids}
