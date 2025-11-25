import secrets
from typing import List
from typing_extensions import Annotated

from fastapi import APIRouter, HTTPException, status
from fastapi import Depends, Form
from sqlalchemy.orm import Session

from core.db.base import engine, SessionLocal
from core.db import models, schemas

from core.info import info_crud


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/api/info", tags=["infos"])


@router.get("/amount")
def get_resource_amount(db: Session = Depends(get_db)):
    containments = info_crud.read_containments(db=db)
    racks = info_crud.read_racks(db=db)
    servers = {}
    for rack in racks:
        server = info_crud.read_server_by_rack(db=db, rack_id=rack.id)
        servers[rack.id] = len(server)
    return {"containment": len(containments), "rack": len(racks), "server": servers}


@router.get("/containments")
def get_containments(db: Session = Depends(get_db)):
    containments = info_crud.read_containments(db=db)
    return containments


@router.get("/racks")
def get_racks(db: Session = Depends(get_db)):
    racks = info_crud.read_racks(db=db)
    return racks


@router.get("/servers")
def get_servers(db: Session = Depends(get_db)):
    servers = info_crud.read_servers(db=db)
    return servers


@router.post("/reg-containment")
def register_containment(name: str, db: Session = Depends(get_db)):
    con = db.query(models.Containment).filter(models.Containment.name == name).first()
    if con != None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 존재하는 컨테이너 이름입니다.",
        )

    else:
        # create new containment
        try:
            containment = info_crud.create_containment(
                db, schemas.ContainmentCreate(name=name)
            )
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="이미 존재하는 이름입니다.",
            )
        return containment


@router.post("/reg-rack")
def register_rack(containment_id: int, name: str, db: Session = Depends(get_db)):
    cont = (
        db.query(models.Containment)
        .filter(models.Containment.id == containment_id)
        .first()
    )
    if cont == None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="컨테이너가 존재하지 않습니다.",
        )
    else:
        # create new rack
        rack = db.query(models.Rack).filter(models.Rack.name == name).first()
        if rack:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 이름입니다.",
            )
        else:
            try:
                rack = info_crud.create_rack(
                    db, schemas.RackCreate(containment_id=containment_id, name=name)
                )
                return rack
            except Exception as e:
                print(e)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="랙 정보 생성에 실패했습니다.",
                )


@router.post("/reg-server")
def register_server(rack_id: int, name: str, db: Session = Depends(get_db)):
    rack = db.query(models.Rack).filter(models.Rack.id == rack_id).first()
    if rack == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="랙 정보가 존재하지 않습니다.",
        )
    else:
        server = db.query(models.Server).filter(models.Server.name == name).first()
        if server:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 서버 이름입니다.",
            )
        else:
            # create new server
            try:
                server = info_crud.create_server(
                    db, schemas.ServerCreate(db=db, rack_id=rack_id, name=name)
                )
                return server
            except:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="서버 정보 생성에 실패했습니다.",
                )
