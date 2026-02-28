from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.skor_iksp import SkorIKSP
from app.schemas.skor_iksp import SkorIKSPRead
from app.core.security import get_current_user

router = APIRouter(prefix="/api/skor", tags=["Skor IKSP"])


@router.get("", response_model=List[SkorIKSPRead])
def get_skor(
    wilayah_id: Optional[int] = Query(None),
    periode: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(SkorIKSP)
    if wilayah_id:
        q = q.filter(SkorIKSP.wilayah_id == wilayah_id)
    if periode:
        q = q.filter(SkorIKSP.periode == periode)
    items = q.order_by(SkorIKSP.periode.desc(), SkorIKSP.total.desc()).all()

    result = []
    for s in items:
        r = SkorIKSPRead.model_validate(s)
        if s.wilayah:
            r.wilayah_nama = s.wilayah.nama
            r.wilayah_kode = s.wilayah.kode
        result.append(r)
    return result
