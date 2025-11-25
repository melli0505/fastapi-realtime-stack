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


class InnerTempSubscriber:
    def __init__(self, containment_id=1, rack_id=1):
        self.topic = f"containments/{containment_id}/racks/{rack_id}/inner_temp"
        self.containment_id = containment_id
        self.rack_id = rack_id
        self.db = get_db()
        self.server_ids = [
            s.id
            for s in self.db.query(models.Server)
            .filter(models.Server.rack_id == self.rack_id)
            .all()
        ]
        self.subscriber(self.containment_id, self.rack_id, self.topic)

    def subscriber(self, id1, id2, topic):
        client = mqtt.Client(client_id=f"innertemp{id1}/{id2}")
        client.connect("10.0.0.89", 1883)
        client.subscribe(topic=topic)
        client.on_message = self.saveInnerTemp
        client.loop_forever()

    def saveInnerTemp(self, client, userdata, message):
        inner = str(message.payload.decode("utf-8"))
        data = json.loads(inner)
        for i in range(len(self.server_ids)):
            db_obj = models.ServerInnerTemperature(
                server_id=self.server_ids[i],
                temperature=data[f"server{i+1}"],
                time=datetime.now(),
            )
            self.db.add(db_obj)
        self.db.commit()


if __name__ == "__main__":
    # threading 처리
    sub = InnerTempSubscriber(1)
    sub = InnerTempSubscriber(2)
