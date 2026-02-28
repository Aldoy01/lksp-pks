from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class LogKejadian(Base):
    __tablename__ = "log_kejadian"

    id = Column(Integer, primary_key=True, index=True)
    wilayah_id = Column(Integer, ForeignKey("wilayah.id"), nullable=False)
    tanggal = Column(Date, nullable=False)
    judul = Column(String, nullable=False)
    deskripsi = Column(String)
    kategori = Column(String)  # sosial | ekonomi | politik
    created_at = Column(DateTime, default=datetime.utcnow)

    wilayah = relationship("Wilayah", back_populates="log_kejadian")
