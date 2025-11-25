from fastapi import APIRouter
from fastapi import Depends, Form
from sqlalchemy.orm import Session

from core.db.base import SessionLocal

from core.data import data_crud
import paho.mqtt.client as mqtt


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/api/data", tags=["data"])


@router.get("/load-rack1")
def load_rack1(s1: str, s2: str, s3: str, s4: str, db: Session = Depends(get_db)):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "load-rack1")
    client.connect("10.0.0.89", 1883)
    data = {
        "server1": float(s1),
        "server2": float(s2),
        "server3": float(s3),
        "server4": float(s4),
    }
    print(data)
    client.publish("racks/1/load", str(data))
    data_crud.write_rack_load(rack_id=1, db=db, data=data)


@router.get("/load-rack2")
def load_rack1(s1: str, s2: str, s3: str, s4: str, db: Session = Depends(get_db)):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "load-rack2")
    client.connect("10.0.0.89", 1883)
    data = {
        "server1": float(s1),
        "server2": float(s2),
        "server3": float(s3),
        "server4": float(s4),
    }
    print(data)
    client.publish("racks/2/load", str(data))
    data_crud.write_rack_load(rack_id=2, db=db, data=data)


@router.get("/fan-rack1")
def load_rack1(s1: str, s2: str, s3: str, s4: str):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "fan-rack1")
    client.connect("10.0.0.89", 1883)
    data = {
        "server1": float(s1),
        "server2": float(s2),
        "server3": float(s3),
        "server4": float(s4),
    }
    print(data)
    client.publish("containments/2/racks/1/fan", str(data))


@router.get("/fan-rack2")
def load_rack1(s1: str, s2: str, s3: str, s4: str):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "fan-rack2")
    client.connect("10.0.0.89", 1883)
    data = {
        "server1": float(s1),
        "server2": float(s2),
        "server3": float(s3),
        "server4": float(s4),
    }
    print(data)
    client.publish("containments/2/racks/2/fan", str(data))


@router.get("/water-pump")
def water_pump(speed: str):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "water-pump")
    client.connect("10.0.0.89", 1883)
    data = {
        "speed": float(speed),
    }
    print(data)
    client.publish("containments/2/water_speed", str(data))


@router.get("/water-compressor")
def water_pump(speed: str):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "water-compressor")
    client.connect("10.0.0.89", 1883)
    data = {
        "speed": float(speed),
    }
    print(data)
    client.publish("containments/2/bldc", str(data))
