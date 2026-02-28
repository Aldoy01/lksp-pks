from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class InputDataCreate(BaseModel):
    wilayah_id: int
    periode: str = Field(..., pattern=r"^\d{4}-(0[1-9]|1[0-2])$", description="Format: YYYY-MM")
    ind1: float = Field(..., ge=1.0, le=5.0)
    ind2: float = Field(..., ge=1.0, le=5.0)
    ind3: float = Field(..., ge=1.0, le=5.0)
    ind4: float = Field(..., ge=1.0, le=5.0)
    ind5: float = Field(..., ge=1.0, le=5.0)
    ind6: float = Field(..., ge=1.0, le=5.0)
    ind7: float = Field(..., ge=1.0, le=5.0)
    ind8: float = Field(..., ge=1.0, le=5.0)
    ind9: float = Field(..., ge=1.0, le=5.0)


class InputDataRead(BaseModel):
    id: int
    wilayah_id: int
    wilayah_nama: Optional[str] = None
    periode: str
    ind1: float
    ind2: float
    ind3: float
    ind4: float
    ind5: float
    ind6: float
    ind7: float
    ind8: float
    ind9: float
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
