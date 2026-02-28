from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import get_db
from app.models.input_data import InputData
from app.models.skor_iksp import SkorIKSP
from app.models.parameter_bobot import ParameterBobot
from app.schemas.skor_iksp import SkorIKSPRead
from app.core.security import require_role
from app.core.calculator import calculate_iksp, get_dimension_weights

router = APIRouter(prefix="/api/kalkulasi", tags=["Kalkulasi"])


@router.post("/{input_id}", response_model=SkorIKSPRead)
def kalkulasi_iksp(
    input_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Admin", "Analis"])),
):
    input_data = db.query(InputData).filter(InputData.id == input_id).first()
    if not input_data:
        raise HTTPException(status_code=404, detail="Input data tidak ditemukan")

    bobot_params = db.query(ParameterBobot).all()
    w_sosial, w_ekonomi, w_politik = get_dimension_weights(bobot_params)

    result = calculate_iksp(
        ind1=input_data.ind1, ind2=input_data.ind2, ind3=input_data.ind3,
        ind4=input_data.ind4, ind5=input_data.ind5, ind6=input_data.ind6,
        ind7=input_data.ind7, ind8=input_data.ind8, ind9=input_data.ind9,
        bobot_sosial=w_sosial, bobot_ekonomi=w_ekonomi, bobot_politik=w_politik,
    )

    # Upsert skor_iksp
    existing = db.query(SkorIKSP).filter(
        SkorIKSP.wilayah_id == input_data.wilayah_id,
        SkorIKSP.periode == input_data.periode,
    ).first()

    if existing:
        existing.dim1 = result.dim1
        existing.dim2 = result.dim2
        existing.dim3 = result.dim3
        existing.total = result.total
        existing.kategori = result.kategori
        existing.calculated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        skor = existing
    else:
        skor = SkorIKSP(
            wilayah_id=input_data.wilayah_id,
            periode=input_data.periode,
            dim1=result.dim1,
            dim2=result.dim2,
            dim3=result.dim3,
            total=result.total,
            kategori=result.kategori,
        )
        db.add(skor)
        db.commit()
        db.refresh(skor)

    response = SkorIKSPRead.model_validate(skor)
    if skor.wilayah:
        response.wilayah_nama = skor.wilayah.nama
        response.wilayah_kode = skor.wilayah.kode
    return response
