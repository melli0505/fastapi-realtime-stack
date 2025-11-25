from core.db import models, schemas
from sqlalchemy.orm import Session
from sqlalchemy import select, join, or_, and_, func, case, text
from sqlalchemy.dialects.postgresql import INTERVAL, DATE
from sqlalchemy.sql.functions import concat

from datetime import datetime

# ----------------------- PUE -------------------------


def read_all_pue(db: Session):
    containments_pues = db.query(models.ContainmentPUE).all()
    return containments_pues


def read_pue_by_id(containment_id: int, db: Session):
    containment_pue = (
        db.query(models.ContainmentPUE)
        .filter(models.ContainmentPUE.containment_id == containment_id)
        .all()
    )
    return containment_pue


def read_pue_by_date(start: str, end: str, db: Session):
    start_day = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S")
    end_day = datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
    containment_pue = (
        db.query(models.ContainmentPUE)
        .filter(
            models.ContainmentPUE.time >= start_day,
            models.ContainmentPUE.time <= end_day,
        )
        .all()
    )
    return containment_pue


def read_pue_total(start: str, end: str, db: Session):

    query = text(
        """WITH daily_data AS (
                SELECT 
                    DATE(time) AS date,
                    energy,
                    time,
                    ROW_NUMBER() OVER (PARTITION BY DATE(time) ORDER BY time ASC) AS rn_first,
                    ROW_NUMBER() OVER (PARTITION BY DATE(time) ORDER BY time DESC) AS rn_last
                FROM 
                    containment_pue
                WHERE 
                    time >= CURRENT_DATE - INTERVAL '10 days'
            )
            SELECT
                date,
                MAX(CASE WHEN rn_first = 1 THEN time END) AS first_time,
                MAX(CASE WHEN rn_first = 1 THEN energy END) AS first_energy,
                MAX(CASE WHEN rn_last = 1 THEN time END) AS last_time,
                MAX(CASE WHEN rn_last = 1 THEN energy END) AS last_energy
            FROM
                daily_data
            GROUP BY
                date
            ORDER BY
                date;"""
    )
    result_proxy = db.execute(query)
    result = result_proxy.fetchall()

    pue = []
    for row in result:
        row_dict = row._mapping
        pue.append(row_dict)
    return pue


def read_pue_yesterday(db: Session):

    query = text(
        """WITH daily_data AS (
            SELECT 
                DATE(time) AS date,
                containment_id AS con_id,
                energy,
                time,
                ROW_NUMBER() OVER (PARTITION BY DATE(time) ORDER BY time ASC) AS rn_first,
                ROW_NUMBER() OVER (PARTITION BY DATE(time) ORDER BY time DESC) AS rn_last
            FROM 
                containment_pue
            WHERE 
                time >= CURRENT_DATE - INTERVAL '1 days'
        )
        SELECT
            date,
            con_id,
            MAX(CASE WHEN rn_first = 1 THEN time END) AS first_time,
            MAX(CASE WHEN rn_first = 1 THEN energy END) AS first_energy,
            MAX(CASE WHEN rn_last = 1 THEN time END) AS last_time,
            MAX(CASE WHEN rn_last = 1 THEN energy END) AS last_energy
        FROM
            daily_data
        GROUP BY
            date, con_id
        ORDER BY
            date, con_id;"""
    )
    result_proxy = db.execute(query)
    result = result_proxy.fetchall()
    pues = []

    for row in result:
        row_dict = row._mapping
        pues.append(row_dict)

    return pues


# ----------------------- Temperature -------------------------


def read_all_temperature(db: Session):
    containments_temps = db.query(models.ContainmentTemperature).all()
    return containments_temps


def read_temperature(containment_id: int, db: Session):
    containment_temps = db.query(models.ContainmentTemperature).filter(
        models.ContainmentTemperature.containment_id == containment_id
    )
    return containment_temps


def read_temperature_by_date(start: str, end: str, db: Session):
    start_day = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S")
    end_day = datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
    containment_temps = (
        db.query(models.ContainmentTemperature)
        .filter(models.ContainmentTemperature.time >= start_day)
        .filter(models.ContainmentTemperature.time <= end_day)
        .all()
    )
    return containment_temps


def read_recent_temperature(start: str, db: Session):
    start = start.split("T")[0]
    day = datetime.strptime(start, "%Y-%m-%d")

    query = text(
        f"""WITH recent_temp AS (
                SELECT 
                    containment_id,
                    DATE(time) AS date,
                    temperature,
                    time,
                    ROW_NUMBER() OVER (PARTITION BY containment_id ORDER BY time DESC) as rn_last
                FROM
                    containment_temperature
                WHERE
                    time >= '{day}'
            )
            SELECT
                containment_id,
                temperature
            FROM
                recent_temp
            WHERE
                rn_last = 1;"""
    )
    result_proxy = db.execute(query)
    result = result_proxy.fetchall()

    temps = []

    for row in result:
        row_dict = row._mapping
        temps.append(row_dict)

    return temps


# ----------------------- Cooling Water Temperature -------------------------


def read_all_water_temperature(db: Session):
    water_temps = db.query(models.ContainmentWaterTemp).all()
    return water_temps


def read_water_temperature(containment_id: int, db: Session):
    water_temps = db.query(models.ContainmentWaterTemp).filter(
        models.ContainmentWaterTemp.containment_id == containment_id
    )
    return water_temps


def read_water_temperature_by_date(start: str, end: str, db: Session):
    start_day = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S")
    end_day = datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
    water_temps = (
        db.query(models.ContainmentWaterTemp)
        .filter(models.ContainmentWaterTemp.time >= start_day)
        .filter(models.ContainmentWaterTemp.time <= end_day)
        .all()
    )
    return water_temps
