from pydantic import BaseModel
from typing import List


class Top10Item(BaseModel):
    rank: int
    wilayah_id: int
    nama: str
    kode: str
    total: float
    kategori: str


class TrendPoint(BaseModel):
    periode: str
    avg_total: float
    count: int


class KategoriCount(BaseModel):
    kategori: str
    count: int
    color: str


class DashboardSummary(BaseModel):
    total_wilayah_dipantau: int
    avg_iksp_nasional: float
    wilayah_tertinggi_nama: str
    wilayah_tertinggi_skor: float
    jumlah_kritis: int
    jumlah_tinggi: int
    jumlah_waspada: int
    jumlah_rendah: int
    top10: List[Top10Item]
    trend: List[TrendPoint]
    distribusi_kategori: List[KategoriCount]
