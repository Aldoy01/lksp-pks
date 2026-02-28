from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.database import Base


class Wilayah(Base):
    __tablename__ = "wilayah"

    id = Column(Integer, primary_key=True, index=True)
    kode = Column(String, unique=True, index=True, nullable=False)  # BPS kode
    nama = Column(String, nullable=False)
    level = Column(String, default="provinsi")
    lat = Column(Float)
    lng = Column(Float)

    input_data = relationship("InputData", back_populates="wilayah")
    skor_iksp = relationship("SkorIKSP", back_populates="wilayah")
    log_kejadian = relationship("LogKejadian", back_populates="wilayah")
