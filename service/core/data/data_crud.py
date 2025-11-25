from sqlalchemy.orm import Session
from datetime import datetime

# ------------------- Containment --------------------------


# ------------------- Racks --------------------------
def write_rack_load(rack_id: int, db: Session, data):
    rack_id = rack_id
    servers = db.query(models.Server).filter(models.Server.rack_id == rack_id).all()
    server_ids = sorted([s.id for s in servers])
    print(server_ids)

    for i in range(len(server_ids)):
        server_load = models.ServerLoad(
            time=datetime.now(), server_id=server_ids[i], load=data[f"server{i+1}"]
        )
        db.add(server_load)
    db.commit()


# ------------------- Server --------------------------
