from core.db import models
from core.db.base import SessionLocal
from fastapi import Depends
from sqlalchemy.orm import Session
from datetime import datetime
import paho.mqtt.client as mqtt
from threading import Thread
import json


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class EnergySubscriber:
    def __init__(self, containment_id=1):
        self.topic = f"containments/{containment_id}/pue"
        self.containment_id = containment_id
        self.subscriber(self.containment_id, self.topic)

    def subscriber(self, id, topic):
        client = mqtt.Client(client_id=f"energy{id}")
        client.connect("10.0.0.89", 1883)
        client.subscribe(topic=topic)
        client.on_message = self.saveEnergy
        client.loop_forever()

    def saveEnergy(self, client, userdata, message):
        energy = str(message.payload.decode("utf-8"))
        data = json.loads(energy)
        db_obj = models.ContainmentPUE(
            containment_id=self.containment_id,
            voltage=data["voltage"],
            power=data["power"],
            energy=data["energy"],
            current=data["current"],
            frequency=data["frequency"],
            pf=data["pf"],
            time=datetime.now(),
        )
        db = get_db()
        db.add(db_obj)
        db.commit()


if __name__ == "__main__":
    # threading 처리
    sub = EnergySubscriber(1)
    sub = EnergySubscriber(2)
