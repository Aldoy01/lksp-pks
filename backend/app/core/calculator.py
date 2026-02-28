from dataclasses import dataclass


@dataclass
class IKSPResult:
    dim1: float   # Struktural
    dim2: float   # Mobilisasi
    dim3: float   # Sentimen Digital
    total: float
    kategori: str


# 4 kategori sesuai Excel IKSP_EarlyWarning_Indonesia
KATEGORI_THRESHOLDS = [
    (2.0, "Rendah"),
    (3.0, "Waspada"),
    (4.0, "Tinggi"),
    (float("inf"), "Kritis"),
]


def classify_score(total: float) -> str:
    for threshold, label in KATEGORI_THRESHOLDS:
        if total <= threshold:
            return label
    return "Kritis"


def calculate_iksp(
    ind1: float, ind2: float, ind3: float,
    ind4: float, ind5: float, ind6: float,
    ind7: float, ind8: float, ind9: float,
    bobot_struktural: float = 0.40,
    bobot_mobilisasi: float = 0.30,
    bobot_sentimen: float = 0.30,
) -> IKSPResult:
    """
    Pure IKSP calculation — sesuai Excel IKSP_EarlyWarning_Indonesia.xlsx

    Dimensi Struktural (bobot 40%):
      ind1: Gini Ratio
      ind2: Pengangguran Usia 15-29
      ind3: Kepercayaan Pemerintah (invert)

    Dimensi Mobilisasi (bobot 30%):
      ind4: Mahasiswa per 100rb Penduduk
      ind5: Penetrasi Internet/Smartphone
      ind6: Insiden Konflik (5 Tahun)

    Dimensi Sentimen Digital (bobot 30%):
      ind7: Volume Mention Isu Sensitif
      ind8: Tone Narasi Negatif/Marah
      ind9: Pertumbuhan Tagar Kritis

    Formula:
      dim = mean(ind_a, ind_b, ind_c)   [rata-rata sederhana]
      total = 0.4*dim1 + 0.3*dim2 + 0.3*dim3

    Kategori:
      1.0 – 2.0 → Rendah
      2.1 – 3.0 → Waspada
      3.1 – 4.0 → Tinggi
      4.1 – 5.0 → Kritis
    """
    dim1 = round((ind1 + ind2 + ind3) / 3, 4)
    dim2 = round((ind4 + ind5 + ind6) / 3, 4)
    dim3 = round((ind7 + ind8 + ind9) / 3, 4)

    total = round(bobot_struktural * dim1 + bobot_mobilisasi * dim2 + bobot_sentimen * dim3, 4)
    kategori = classify_score(total)

    return IKSPResult(dim1=dim1, dim2=dim2, dim3=dim3, total=total, kategori=kategori)


def get_dimension_weights(bobot_params) -> tuple[float, float, float]:
    """Extract dimension weights from ParameterBobot list."""
    weights = {"Struktural": 0.40, "Mobilisasi": 0.30, "Sentimen Digital": 0.30}
    seen = {}
    for pb in bobot_params:
        if pb.nama_dimensi not in seen:
            seen[pb.nama_dimensi] = pb.bobot
    for dim, val in seen.items():
        if dim in weights:
            weights[dim] = val
    return weights["Struktural"], weights["Mobilisasi"], weights["Sentimen Digital"]
