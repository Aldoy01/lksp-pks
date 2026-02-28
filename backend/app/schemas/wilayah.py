from pydantic import BaseModel
from typing import Optional


class WilayahRead(BaseModel):
    id: int
    kode: str
    nama: str
    level: str
    lat: Optional[float] = None
    lng: Optional[float] = None

    class Config:
        from_attributes = True
