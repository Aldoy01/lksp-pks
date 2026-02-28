from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.wilayah import Wilayah
from app.models.skor_iksp import SkorIKSP
from app.schemas.skor_iksp import PetaRisikoItem

router = APIRouter(prefix="/api/peta-risiko", tags=["Peta Risiko"])


@router.get("", response_model=List[PetaRisikoItem])
def get_peta_risiko(
    periode: Optional[str] = Query(None, description="Format YYYY-MM. Jika kosong, ambil skor terbaru tiap wilayah"),
    db: Session = Depends(get_db),
):
    wilayah_list = db.query(Wilayah).order_by(Wilayah.kode).all()

    if periode:
        skor_map = {
            s.wilayah_id: s
            for s in db.query(SkorIKSP).filter(SkorIKSP.periode == periode).all()
        }
    else:
        # Get latest score per wilayah using subquery
        from sqlalchemy import func
        latest_subq = (
            db.query(SkorIKSP.wilayah_id, func.max(SkorIKSP.periode).label("max_periode"))
            .group_by(SkorIKSP.wilayah_id)
            .subquery()
        )
        latest_scores = (
            db.query(SkorIKSP)
            .join(latest_subq, (SkorIKSP.wilayah_id == latest_subq.c.wilayah_id) &
                  (SkorIKSP.periode == latest_subq.c.max_periode))
            .all()
        )
        skor_map = {s.wilayah_id: s for s in latest_scores}

    result = []
    for w in wilayah_list:
        skor = skor_map.get(w.id)
        result.append(PetaRisikoItem(
            kode=w.kode,
            nama=w.nama,
            lat=w.lat,
            lng=w.lng,
            total=skor.total if skor else None,
            kategori=skor.kategori if skor else None,
            dim1=skor.dim1 if skor else None,
            dim2=skor.dim2 if skor else None,
            dim3=skor.dim3 if skor else None,
            has_data=skor is not None,
        ))
    return result
