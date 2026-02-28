from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SkorIKSPRead(BaseModel):
    id: int
    wilayah_id: int
    wilayah_nama: Optional[str] = None
    wilayah_kode: Optional[str] = None
    periode: str
    dim1: float
    dim2: float
    dim3: float
    total: float
    kategori: str
    calculated_at: datetime

    class Config:
        from_attributes = True


class PetaRisikoItem(BaseModel):
    kode: str
    nama: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    total: Optional[float] = None
    kategori: Optional[str] = None
    dim1: Optional[float] = None
    dim2: Optional[float] = None
    dim3: Optional[float] = None
    has_data: bool = False
