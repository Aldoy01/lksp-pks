from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserRead(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "Viewer"


class ParameterBobotRead(BaseModel):
    id: int
    nama_dimensi: str
    nama_indikator: str
    bobot: float
    updated_at: datetime

    class Config:
        from_attributes = True


class ParameterBobotUpdate(BaseModel):
    id: int
    bobot: float
