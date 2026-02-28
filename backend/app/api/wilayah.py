from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.wilayah import Wilayah
from app.schemas.wilayah import WilayahRead

router = APIRouter(prefix="/api/wilayah", tags=["Wilayah"])


@router.get("", response_model=List[WilayahRead])
def get_wilayah(db: Session = Depends(get_db)):
    return db.query(Wilayah).order_by(Wilayah.kode).all()
