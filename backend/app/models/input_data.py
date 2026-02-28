from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class InputData(Base):
    __tablename__ = "input_data"

    id = Column(Integer, primary_key=True, index=True)
    wilayah_id = Column(Integer, ForeignKey("wilayah.id"), nullable=False)
    periode = Column(String(7), nullable=False)  # YYYY-MM
    # Dimensi Sosial
    ind1 = Column(Float, nullable=False)  # Tingkat Kemiskinan
    ind2 = Column(Float, nullable=False)  # Angka Buta Huruf
    ind3 = Column(Float, nullable=False)  # Akses Layanan Kesehatan
    # Dimensi Ekonomi
    ind4 = Column(Float, nullable=False)  # Tingkat Pengangguran
    ind5 = Column(Float, nullable=False)  # Ketimpangan Pendapatan
    ind6 = Column(Float, nullable=False)  # Tekanan Harga Bahan Pokok
    # Dimensi Politik
    ind7 = Column(Float, nullable=False)  # Frekuensi Konflik
    ind8 = Column(Float, nullable=False)  # Kepercayaan Pemerintah
    ind9 = Column(Float, nullable=False)  # Partisipasi Pemilu
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("wilayah_id", "periode", name="uq_input_wilayah_periode"),
    )

    wilayah = relationship("Wilayah", back_populates="input_data")
    user = relationship("User", back_populates="input_data")
