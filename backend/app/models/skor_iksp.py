from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class SkorIKSP(Base):
    __tablename__ = "skor_iksp"

    id = Column(Integer, primary_key=True, index=True)
    wilayah_id = Column(Integer, ForeignKey("wilayah.id"), nullable=False)
    periode = Column(String(7), nullable=False)
    dim1 = Column(Float, nullable=False)   # Dimensi Sosial
    dim2 = Column(Float, nullable=False)   # Dimensi Ekonomi
    dim3 = Column(Float, nullable=False)   # Dimensi Politik
    total = Column(Float, nullable=False)  # Skor IKSP Komposit
    kategori = Column(String, nullable=False)  # Sangat Rendah | Rendah | Sedang | Tinggi | Sangat Tinggi
    calculated_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("wilayah_id", "periode", name="uq_skor_wilayah_periode"),
    )

    wilayah = relationship("Wilayah", back_populates="skor_iksp")
