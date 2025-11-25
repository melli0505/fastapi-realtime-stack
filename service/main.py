from fastapi import FastAPI, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session

import datetime

from core.db.base import engine, SessionLocal
from core.db import models

from core.info import info_router, info_crud
from core.containment import containment_router, containment_crud
from core.rack import rack_router
from core.server import server_router
from core.data import data_router


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


models.Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(info_router.router)
app.include_router(containment_router.router)
app.include_router(rack_router.router)
app.include_router(server_router.router)
app.include_router(data_router.router)


templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
# this gonna be a main page
def mainPage(request: Request, db: Session = Depends(get_db)):
    raw = containment_crud.read_pue_yesterday(db=db)
    # today, yesterday
    data = {"containment1": [0, 0], "containment2": [0, 0]}
    t = datetime.datetime.now()
    today = datetime.datetime.date(t)
    yesterday = today - datetime.timedelta(days=1)
    for r in raw:
        print(r["date"], r["first_energy"], r["last_energy"])
        if r.con_id == 1:
            if r["date"] == today:
                data["containment1"][0] = (
                    round((r["last_energy"] - r["first_energy"]) * 100) / 100
                )
            if r["date"] == yesterday:
                data["containment1"][1] = (
                    round((r["last_energy"] - r["first_energy"]) * 100) / 100
                )
        else:
            if r["date"] == today:
                data["containment2"][0] = (
                    round((r["last_energy"] - r["first_energy"]) * 100) / 100
                )
            if r["date"] == yesterday:
                data["containment2"][1] = (
                    round((r["last_energy"] - r["first_energy"]) * 100) / 100
                )

    # print(data)
    return templates.TemplateResponse(
        "mainPage.html", {"request": request, "data": data}
    )


@app.get("/server")
# this gonna be a pue page
def mainPage(request: Request):
    return templates.TemplateResponse(
        "serverTemperaturePage.html", {"request": request}
    )


@app.get("/containment")
# this gonna be a pue page
def mainPage(request: Request):
    return templates.TemplateResponse(
        "containmentTemperaturePage.html", {"request": request}
    )


@app.get("/energy")
# this gonna be a pue page
def mainPage(request: Request):
    return templates.TemplateResponse("containmentPuePage.html", {"request": request})


@app.get("/cooler")
# this gonna be a pue page
def mainPage(request: Request):
    return templates.TemplateResponse(
        "containmentCoolerPage.html", {"request": request}
    )


@app.get("/hardware")
# this gonna be a hardware info page
def managePage(request: Request, db: Session = Depends(get_db)):
    containments = info_crud.read_containments(db=db)
    racks = info_crud.read_racks(db=db)
    servers = info_crud.read_servers(db=db)
    return templates.TemplateResponse(
        "hardwareInfoPage.html",
        {
            "request": request,
            "containments": containments,
            "racks": racks,
            "servers": servers,
        },
    )


@app.get("/controller")
# this gonna be a pue page
def mainPage(request: Request):
    return templates.TemplateResponse("controller.html", {"request": request})


# html resources
# @app.get("/html/resources/sidebar")
# def sidebar(request: Request):
#     return templates.TemplateResponse("sidebar.html", {"request": request})
