from typing import List
from datetime import datetime
from pydantic import BaseModel


class ContainmentBase(BaseModel):
    name: str


class ContainmentCreate(ContainmentBase):
    pass


class Containment(ContainmentCreate):
    id: int
    racks: List["Rack"] = []

    class Config:
        from_attributes = True


class RackBase(BaseModel):
    name: str


class RackCreate(RackBase):
    containment_id: int


class Rack(RackCreate):
    id: int
    servers: List["Server"] = []

    class Config:
        from_attributes = True


class ServerBase(BaseModel):
    name: str


class ServerCreate(ServerBase):
    rack_id: int


class Server(ServerCreate):
    id: int

    class Config:
        from_attributes = True


class ContainmentPUEBase(BaseModel):
    time: datetime


class ContainmentPUECreate(ContainmentPUEBase):
    voltage: float
    power: float
    energy: float
    current: float
    frequency: float
    pf: float

    containment_id: int


class ContainmentPUE(ContainmentPUECreate):
    id: int

    class Config:
        from_attributes = True


class ContainmentTemperatureBase(BaseModel):
    time: datetime


class ContainmentTemperatureCreate(ContainmentTemperatureBase):
    containment_id: int
    temperature: float


class ContainmentTemperature(ContainmentTemperatureCreate):
    id: int

    class Config:
        from_attributes = True


class ContainmentWaterTempBase(BaseModel):
    time: datetime


class ContainmentWaterTempCreate(ContainmentWaterTempBase):
    containment_id: int
    inner_temp: float
    outer_temp: float


class ContainmentWaterTemp(ContainmentWaterTempCreate):
    id: int

    class Config:
        from_attributes = True


class ServerInnerTemperatureBase(BaseModel):
    time: datetime


class ServerInnerTemperatureCreate(ServerInnerTemperatureBase):
    server_id: int
    temperature: float


class ServerInnerTemperature(ServerInnerTemperatureCreate):
    id: int

    class Config:
        from_attributes = True


class ServerOuterTemperatureBase(BaseModel):
    time: datetime


class ServerOuterTemperatureCreate(ServerOuterTemperatureBase):
    server_id: int
    temperature: float


class ServerOuterTemperature(ServerOuterTemperatureCreate):
    id: int

    class Config:
        from_attributes = True


class ServerLoadBase(BaseModel):
    time: datetime


class ServerLoadCreate(ServerLoadBase):
    server_id: int
    load: float


class ServerLoad(ServerLoadCreate):
    id: int

    class Config:
        from_attributes = True
