from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.db.database import get_db
from app.models.skor_iksp import SkorIKSP
from app.models.wilayah import Wilayah
from app.schemas.dashboard import DashboardSummary, Top10Item, TrendPoint, KategoriCount
from app.core.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

# 4 kategori sesuai Excel IKSP_EarlyWarning_Indonesia.xlsx
KATEGORI_COLORS = {
    "Rendah":  "#22c55e",
    "Waspada": "#eab308",
    "Tinggi":  "#f97316",
    "Kritis":  "#dc2626",
}

KATEGORI_ORDER = ["Rendah", "Waspada", "Tinggi", "Kritis"]


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    periode: Optional[str] = Query(None, description="Filter by YYYY-MM period"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if periode:
        skor_list = db.query(SkorIKSP).filter(SkorIKSP.periode == periode).all()
    else:
        latest_subq = (
            db.query(SkorIKSP.wilayah_id, func.max(SkorIKSP.periode).label("max_periode"))
            .group_by(SkorIKSP.wilayah_id)
            .subquery()
        )
        skor_list = (
            db.query(SkorIKSP)
            .join(latest_subq, (SkorIKSP.wilayah_id == latest_subq.c.wilayah_id) &
                  (SkorIKSP.periode == latest_subq.c.max_periode))
            .all()
        )

    if not skor_list:
        return DashboardSummary(
            total_wilayah_dipantau=0,
            avg_iksp_nasional=0.0,
            wilayah_tertinggi_nama="-",
            wilayah_tertinggi_skor=0.0,
            jumlah_kritis=0,
            jumlah_tinggi=0,
            jumlah_waspada=0,
            jumlah_rendah=0,
            top10=[],
            trend=[],
            distribusi_kategori=[],
        )

    sorted_skor = sorted(skor_list, key=lambda s: s.total, reverse=True)
    avg_total = sum(s.total for s in skor_list) / len(skor_list)
    tertinggi = sorted_skor[0]
    tertinggi_nama = tertinggi.wilayah.nama if tertinggi.wilayah else "-"

    def count_kat(k): return sum(1 for s in skor_list if s.kategori == k)

    top10 = [
        Top10Item(
            rank=rank,
            wilayah_id=s.wilayah_id,
            nama=s.wilayah.nama if s.wilayah else "-",
            kode=s.wilayah.kode if s.wilayah else "-",
            total=s.total,
            kategori=s.kategori,
        )
        for rank, s in enumerate(sorted_skor[:10], start=1)
    ]

    trend_rows = (
        db.query(SkorIKSP.periode, func.avg(SkorIKSP.total).label("avg_total"), func.count(SkorIKSP.id).label("cnt"))
        .group_by(SkorIKSP.periode)
        .order_by(SkorIKSP.periode.desc())
        .limit(12)
        .all()
    )
    trend = [TrendPoint(periode=r.periode, avg_total=round(r.avg_total, 4), count=r.cnt) for r in reversed(trend_rows)]

    distribusi = [
        KategoriCount(kategori=k, count=count_kat(k), color=KATEGORI_COLORS.get(k, "#888"))
        for k in KATEGORI_ORDER
        if count_kat(k) > 0
    ]

    return DashboardSummary(
        total_wilayah_dipantau=len(skor_list),
        avg_iksp_nasional=round(avg_total, 4),
        wilayah_tertinggi_nama=tertinggi_nama,
        wilayah_tertinggi_skor=tertinggi.total,
        jumlah_kritis=count_kat("Kritis"),
        jumlah_tinggi=count_kat("Tinggi"),
        jumlah_waspada=count_kat("Waspada"),
        jumlah_rendah=count_kat("Rendah"),
        top10=top10,
        trend=trend,
        distribusi_kategori=distribusi,
    )
