from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.input_data import InputData
from app.models.wilayah import Wilayah
from app.schemas.input_data import InputDataCreate, InputDataRead
from app.core.security import get_current_user, require_role

router = APIRouter(prefix="/api/input-data", tags=["Input Data"])


def _enrich(item: InputData) -> InputDataRead:
    data = InputDataRead.model_validate(item)
    if item.wilayah:
        data.wilayah_nama = item.wilayah.nama
    return data


@router.get("", response_model=List[InputDataRead])
def get_input_data(
    wilayah_id: Optional[int] = Query(None),
    periode: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(InputData)
    if wilayah_id:
        q = q.filter(InputData.wilayah_id == wilayah_id)
    if periode:
        q = q.filter(InputData.periode == periode)
    items = q.order_by(InputData.created_at.desc()).all()
    return [_enrich(i) for i in items]


@router.post("", response_model=InputDataRead, status_code=status.HTTP_201_CREATED)
def create_input_data(
    payload: InputDataCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Admin", "Analis"])),
):
    wilayah = db.query(Wilayah).filter(Wilayah.id == payload.wilayah_id).first()
    if not wilayah:
        raise HTTPException(status_code=404, detail="Wilayah tidak ditemukan")

    existing = db.query(InputData).filter(
        InputData.wilayah_id == payload.wilayah_id,
        InputData.periode == payload.periode,
    ).first()
    if existing:
        # Update existing record
        for field, value in payload.model_dump().items():
            setattr(existing, field, value)
        existing.user_id = current_user.id
        db.commit()
        db.refresh(existing)
        return _enrich(existing)

    item = InputData(**payload.model_dump(), user_id=current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return _enrich(item)


@router.get("/{item_id}", response_model=InputDataRead)
def get_input_data_by_id(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(InputData).filter(InputData.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return _enrich(item)
