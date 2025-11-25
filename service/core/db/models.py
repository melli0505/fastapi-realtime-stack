from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from core.db.base import Base

# basic informations


class Containment(Base):
    __tablename__ = "containments"

    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    name = Column(String, index=True, unique=True)

    racks = relationship("Rack", back_populates="containment")
    pue = relationship("ContainmentPUE", back_populates="containment")
    temperature = relationship("ContainmentTemperature", back_populates="containment")
    water = relationship("ContainmentWaterTemp", back_populates="containment")


class Rack(Base):
    __tablename__ = "racks"

    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    name = Column(String, index=True)
    containment_id = Column(Integer, ForeignKey("containments.id"))

    containment = relationship("Containment", back_populates="racks")
    servers = relationship("Server", back_populates="rack")


class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    name = Column(String, unique=True)
    rack_id = Column(Integer, ForeignKey("racks.id"))

    rack = relationship("Rack", back_populates="servers")
    inner_temperature = relationship("ServerInnerTemperature", back_populates="server")
    outer_temperature = relationship("ServerOuterTemperature", back_populates="server")
    load = relationship("ServerLoad", back_populates="server")


# data


class ServerLoad(Base):
    __tablename__ = "server_load"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    load = Column(Float, index=True)

    time = Column(DateTime, index=True)
    server = relationship("Server", back_populates="load")


class ServerInnerTemperature(Base):
    __tablename__ = "server_inner_temp"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    temperature = Column(Float, index=True)

    time = Column(DateTime, index=True)
    server = relationship("Server", back_populates="inner_temperature")


class ServerOuterTemperature(Base):
    __tablename__ = "server_outer_temp"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    temperature = Column(Float, index=True)

    time = Column(DateTime, index=True)
    server = relationship("Server", back_populates="outer_temperature")


class ContainmentTemperature(Base):
    __tablename__ = "containment_temperature"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    containment_id = Column(Integer, ForeignKey("containments.id"))
    temperature = Column(Float)

    time = Column(DateTime, index=True)
    containment = relationship("Containment", back_populates="temperature")


class ContainmentPUE(Base):
    __tablename__ = "containment_pue"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    containment_id = Column(Integer, ForeignKey("containments.id"))

    voltage = Column(Float, index=True)
    power = Column(Float, index=True)
    energy = Column(Float, index=True)
    current = Column(Float, index=True)
    frequency = Column(Float, index=True)
    pf = Column(Float, index=True)

    time = Column(DateTime, index=True)
    containment = relationship("Containment", back_populates="pue")


class ContainmentWaterTemp(Base):
    __tablename__ = "containment_water_temp"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    containment_id = Column(Integer, ForeignKey("containments.id"))

    inner_temp = Column(Float, index=True)
    outer_temp = Column(Float, index=True)

    time = Column(DateTime, index=True)
    containment = relationship("Containment", back_populates="water")
