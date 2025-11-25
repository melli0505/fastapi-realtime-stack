import secrets
from typing import List
from typing_extensions import Annotated

from fastapi import APIRouter, HTTPException, status
from fastapi import Depends, Form
from sqlalchemy.orm import Session

from core.db.base import engine, SessionLocal
from core.db import models, schemas

from core.containment import containment_crud


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/api/containment", tags=["containment"])


# get entire pue
@router.get("/all-pue")
def get_all_containment_pue(db: Session = Depends(get_db)):
    pues = containment_crud.read_all_pue(db=db)
    return pues


# get pue by id
@router.get("/pue")
def get_containment_pue_by_id(containment_id: int, db: Session = Depends(get_db)):
    pues = containment_crud.read_pue_by_id(containment_id=containment_id, db=db)
    return pues


# get pue by period
@router.get("/pue-date")
def get_containment_pue_by_date(start: str, end: str, db: Session = Depends(get_db)):
    pues = containment_crud.read_pue_by_date(start=start, end=end, db=db)
    return pues


@router.get("/pue-recent")
def get_recent_containment_pue(db: Session = Depends(get_db)):
    pues = containment_crud.read_pue_total(start="a", end="b", db=db)
    return pues


@router.get("/pue-compare")
def get_yesterday_containment_pue(db: Session = Depends(get_db)):
    pues = containment_crud.read_pue_yesterday(db=db)
    return pues


# get entire temperature
@router.get("/all-temp")
def get_all_containment_temp(db: Session = Depends(get_db)):
    temps = containment_crud.read_all_temperature(db=db)
    return temps


# get temperature by id
@router.get("/temp")
def get_containment_temp(containment_id: int, db: Session = Depends(get_db)):
    temps = containment_crud.read_temperature(containment_id=containment_id, db=db)
    return temps


# get temperature by period
@router.get("/temp-date")
def get_containment_temp_by_date(start: str, end: str, db: Session = Depends(get_db)):
    temps = containment_crud.read_temperature_by_date(start=start, end=end, db=db)
    return temps


# get recent temperature
@router.get("/recent-temp")
def get_recent_containment_temp(start: str, db: Session = Depends(get_db)):
    temps = containment_crud.read_recent_temperature(start=start, db=db)
    return temps


# get entire water temperature
@router.get("/all-water-temp")
def get_all_containment_water_temp(db: Session = Depends(get_db)):
    water_temps = containment_crud.read_all_water_temperature(db=db)
    return water_temps


# get water temperature by containment id
@router.get("/water-temp")
def get_containment_water_temp(containment_id: int, db: Session = Depends(get_db)):
    water_temp = containment_crud.read_water_temperature(
        containment_id=containment_id, db=db
    )
    return water_temp


# get water temperature by period
@router.get("/water-temp-date")
def get_containment_water_temp_by_date(
    start: str, end: str, db: Session = Depends(get_db)
):
    water_temps = containment_crud.read_water_temperature_by_date(
        start=start, end=end, db=db
    )
    return water_temps
