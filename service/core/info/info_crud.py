from core.db import models, schemas
from sqlalchemy.orm import Session


# read
def read_containment(db: Session, containment_id: int):
    return (
        db.query(models.Containment)
        .filter(models.Containment.id == containment_id)
        .first()
    )


def read_containments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Containment).offset(skip).limit(limit).all()


def read_rack(db: Session, rack_id: int):
    return db.query(models.Rack).filter(models.Rack.id == rack_id).first()


def read_rack_by_containment(db: Session, containment_id: int):
    return db.query(models.Rack).filter(models.Rack.id == containment_id).all()


def read_racks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Rack).offset(skip).limit(limit).all()


def read_server(db: Session, server_id: int):
    return db.query(models.Server).filter(models.Server.id == server_id).first()


def read_server_by_rack(db: Session, rack_id: int):
    return db.query(models.Server).filter(models.Server.rack_id == rack_id).all()


def read_server_by_containment(db: Session, containment_id: int):
    # TODO: implement join query
    pass


def read_servers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Server).offset(skip).limit(limit).all()


# create
def create_containment(db: Session, c_info: schemas.ContainmentCreate):
    containment = models.Containment(name=c_info.name)
    print(containment)
    db.add(containment)
    db.commit()
    db.refresh(containment)

    return containment


def create_rack(db: Session, r_info: schemas.RackCreate):
    rack = models.Rack(containment_id=r_info.containment_id, name=r_info.name)
    db.add(rack)
    db.commit()
    db.refresh(rack)

    return rack


def create_server(db: Session, s_info: schemas.ServerCreate):
    server = models.Server(rack_id=s_info.rack_id, name=s_info.name)
    db.add(server)
    db.commit()
    db.refresh(server)

    return server
