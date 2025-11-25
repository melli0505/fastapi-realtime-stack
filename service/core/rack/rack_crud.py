from core.db import models
from sqlalchemy.orm import Session
from sqlalchemy import or_

from datetime import datetime


def read_rack_inner_temp(rack_id: int, db: Session):
    server_ids = [
        s.id for s in db.query(models.Server).filter(models.Server.rack_id == rack_id)
    ]
    try:
        rack_temps = (
            db.query(models.ServerInnerTemperature)
            .filter(
                or_(
                    models.ServerInnerTemperature.server_id == server_ids[0],
                    models.ServerInnerTemperature.server_id == server_ids[1],
                    models.ServerInnerTemperature.server_id == server_ids[2],
                    models.ServerInnerTemperature.server_id == server_ids[3],
                )
            )
            .all()
        )
        return rack_temps
    except:
        return []


def read_rack_outer_temp(rack_id: int, db: Session):
    server_ids = [
        s.id for s in db.query(models.Server).filter(models.Server.rack_id == rack_id)
    ]
    try:
        rack_temps = (
            db.query(models.ServerOuterTemperature)
            .filter(
                or_(
                    models.ServerOuterTemperature.server_id == server_ids[0],
                    models.ServerOuterTemperature.server_id == server_ids[1],
                    models.ServerOuterTemperature.server_id == server_ids[2],
                    models.ServerOuterTemperature.server_id == server_ids[3],
                )
            )
            .all()
        )
        return rack_temps
    except:
        return []


def read_rack_inner_temp_by_date(rack_id: int, start: str, end: str, db: Session):

    start_day = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S")
    end_day = datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
    server_ids = [
        s.id for s in db.query(models.Server).filter(models.Server.rack_id == rack_id)
    ]
    try:

        rack_temps = (
            db.query(models.ServerInnerTemperature)
            .filter(
                or_(
                    models.ServerInnerTemperature.server_id == server_ids[0],
                    models.ServerInnerTemperature.server_id == server_ids[1],
                    models.ServerInnerTemperature.server_id == server_ids[2],
                    models.ServerInnerTemperature.server_id == server_ids[3],
                )
            )
            .filter(models.ServerInnerTemperature.time >= start_day)
            .filter(models.ServerInnerTemperature.time <= end_day)
            .all()
        )
        return rack_temps, sorted(server_ids)
    except:
        return [], []


def read_rack_outer_temp_by_date(rack_id: int, start: str, end: str, db: Session):

    start_day = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S")
    end_day = datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
    server_ids = [
        s.id for s in db.query(models.Server).filter(models.Server.rack_id == rack_id)
    ]
    try:
        rack_temps = (
            db.query(models.ServerOuterTemperature)
            .filter(
                or_(
                    models.ServerOuterTemperature.server_id == server_ids[0],
                    models.ServerOuterTemperature.server_id == server_ids[1],
                    models.ServerOuterTemperature.server_id == server_ids[2],
                    models.ServerOuterTemperature.server_id == server_ids[3],
                )
            )
            .filter(models.ServerOuterTemperature.time >= start_day)
            .filter(models.ServerOuterTemperature.time <= end_day)
            .all()
        )
        return rack_temps, sorted(server_ids)
    except:
        return [], []


def read_rack_load(rack_id: int, db: Session):
    server_ids = [
        s.id for s in db.query(models.Server).filter(models.Server.rack_id == rack_id)
    ]
    try:
        rack_loads = (
            db.query(models.ServerLoad)
            .filter(
                or_(
                    models.ServerLoad.server_id == server_ids[0],
                    models.ServerLoad.server_id == server_ids[1],
                    models.ServerLoad.server_id == server_ids[2],
                    models.ServerLoad.server_id == server_ids[3],
                )
            )
            .all()
        )

        return rack_loads
    except:
        return []


def read_rack_load_by_date(rack_id: int, start: str, end: str, db: Session):
    start_day = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S")
    end_day = datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
    server_ids = [
        s.id for s in db.query(models.Server).filter(models.Server.rack_id == rack_id)
    ]
    try:
        rack_loads = (
            db.query(models.ServerLoad)
            .filter(
                or_(
                    models.ServerLoad.server_id == server_ids[0],
                    models.ServerLoad.server_id == server_ids[1],
                    models.ServerLoad.server_id == server_ids[2],
                    models.ServerLoad.server_id == server_ids[3],
                )
            )
            .filter(models.ServerLoad.time >= start_day)
            .filter(models.ServerLoad.time <= end_day)
            .all()
        )
        return rack_loads, sorted(server_ids)
    except:
        return [], []
