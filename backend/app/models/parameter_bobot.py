from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.db.database import Base


class ParameterBobot(Base):
    __tablename__ = "parameter_bobot"

    id = Column(Integer, primary_key=True, index=True)
    nama_dimensi = Column(String, nullable=False)    # Sosial | Ekonomi | Politik
    nama_indikator = Column(String, nullable=False)
    bobot = Column(Float, nullable=False)            # Dimension weight (0.35/0.35/0.30)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
