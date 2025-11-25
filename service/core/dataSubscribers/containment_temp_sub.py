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


class ContainmentTempSubscriber:
    def __init__(self, containment_id=1):
        self.topic = f"containments/{containment_id}/temperature"
        self.containment_id = containment_id
        self.db = get_db()
        self.subscriber(self.containment_id, self.topic)

    def subscriber(self, id, topic):
        client = mqtt.Client(client_id=f"containment{id}")
        client.connect("10.0.0.89", 1883)
        client.subscribe(topic=topic)
        client.on_message = self.saveContainmentTemp
        client.loop_forever()

    def saveContainmentTemp(self, client, userdata, message):
        temp = float(message.payload.decode("utf-8"))
        db_obj = models.ContainmentTemperature(
            containment_id=self.containment_id,
            temperature=temp,
            time=datetime.now(),
        )
        self.db.add(db_obj)
        self.db.commit()


if __name__ == "__main__":
    # threading 처리
    sub = ContainmentTempSubscriber(1)
    sub = ContainmentTempSubscriber(2)
