from core.db import models
from sqlalchemy.orm import Session


def read_all_server_temp(db: Session):
    server_temp = db.query(models.ServerTemperature).all()
    return server_temp


def read_server_temp(server_id: int, db: Session):
    server_temp = db.query(models.ServerTemperature).filter(
        models.ServerTemperature.server_id == server_id
    )
    return server_temp


def read_server_temp_by_date(server_id: int, start: str, end: str, db: Session):
    pass


def read_all_server_load(db: Session):
    server_load = db.query(models.ServerLoad).all()
    return server_load


def read_server_load(server_id: int, db: Session):
    server_load = db.query(models.ServerLoad).filter(
        models.ServerLoad.server_id == server_id
    )
    # return server_load


def read_server_load_by_date(server_id: int, start: str, end: str, db: Session):
    loads = (
        db.query(models.ServerLoad)
        .filter(models.ServerLoad.server_id == server_id)
        .filter(models.ServerLoad.time >= start)
        .filter(models.ServerLoad.time <= end)
    ).all()
    return loads
