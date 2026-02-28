from sqlalchemy.orm import Session
from app.models.user import User
from app.models.wilayah import Wilayah
from app.models.parameter_bobot import ParameterBobot
from app.core.security import get_password_hash

PROVINCES = [
    # Sumatera
    {"kode": "11", "nama": "Aceh",                       "lat":  4.6951, "lng":  96.7494},
    {"kode": "12", "nama": "Sumatera Utara",              "lat":  2.1154, "lng":  99.5451},
    {"kode": "13", "nama": "Sumatera Barat",              "lat": -0.7399, "lng": 100.8000},
    {"kode": "14", "nama": "Riau",                        "lat":  0.2933, "lng": 101.7068},
    {"kode": "15", "nama": "Jambi",                       "lat": -1.6101, "lng": 103.6131},
    {"kode": "16", "nama": "Sumatera Selatan",            "lat": -3.3194, "lng": 104.9144},
    {"kode": "17", "nama": "Bengkulu",                    "lat": -3.5778, "lng": 102.3464},
    {"kode": "18", "nama": "Lampung",                     "lat": -4.5586, "lng": 105.4068},
    {"kode": "19", "nama": "Kepulauan Bangka Belitung",   "lat": -2.7411, "lng": 106.4406},
    {"kode": "21", "nama": "Kepulauan Riau",              "lat":  3.9456, "lng": 108.1429},
    # Jawa
    {"kode": "31", "nama": "DKI Jakarta",                 "lat": -6.2088, "lng": 106.8456},
    {"kode": "32", "nama": "Jawa Barat",                  "lat": -6.9147, "lng": 107.6098},
    {"kode": "33", "nama": "Jawa Tengah",                 "lat": -7.1510, "lng": 110.1403},
    {"kode": "34", "nama": "DI Yogyakarta",               "lat": -7.8754, "lng": 110.4262},
    {"kode": "35", "nama": "Jawa Timur",                  "lat": -7.5361, "lng": 112.2384},
    {"kode": "36", "nama": "Banten",                      "lat": -6.4058, "lng": 106.0640},
    # Bali & Nusa Tenggara
    {"kode": "51", "nama": "Bali",                        "lat": -8.3405, "lng": 115.0920},
    {"kode": "52", "nama": "Nusa Tenggara Barat",         "lat": -8.6529, "lng": 117.3616},
    {"kode": "53", "nama": "Nusa Tenggara Timur",         "lat": -8.6574, "lng": 121.0794},
    # Kalimantan
    {"kode": "61", "nama": "Kalimantan Barat",            "lat":  0.0000, "lng": 109.0000},
    {"kode": "62", "nama": "Kalimantan Tengah",           "lat": -1.6815, "lng": 113.3824},
    {"kode": "63", "nama": "Kalimantan Selatan",          "lat": -3.0926, "lng": 115.2838},
    {"kode": "64", "nama": "Kalimantan Timur",            "lat":  1.6407, "lng": 116.4194},
    {"kode": "65", "nama": "Kalimantan Utara",            "lat":  3.0731, "lng": 116.0413},
    # Sulawesi
    {"kode": "71", "nama": "Sulawesi Utara",              "lat":  0.6274, "lng": 123.9750},
    {"kode": "72", "nama": "Sulawesi Tengah",             "lat": -1.4300, "lng": 121.4456},
    {"kode": "73", "nama": "Sulawesi Selatan",            "lat": -3.6688, "lng": 119.9740},
    {"kode": "74", "nama": "Sulawesi Tenggara",           "lat": -4.1449, "lng": 122.1746},
    {"kode": "75", "nama": "Gorontalo",                   "lat":  0.5435, "lng": 123.0568},
    {"kode": "76", "nama": "Sulawesi Barat",              "lat": -2.8449, "lng": 119.2321},
    # Maluku & Papua
    {"kode": "81", "nama": "Maluku",                      "lat": -3.2385, "lng": 130.1453},
    {"kode": "82", "nama": "Maluku Utara",                "lat":  1.5709, "lng": 127.8088},
    {"kode": "91", "nama": "Papua Barat",                 "lat": -1.3361, "lng": 133.1747},
    {"kode": "94", "nama": "Papua",                       "lat": -4.2699, "lng": 138.0804},
]

# Sesuai Excel IKSP_EarlyWarning_Indonesia.xlsx sheet "Parameter"
PARAMETER_BOBOT = [
    # Dimensi Struktural — bobot dimensi 40%
    {"nama_dimensi": "Struktural", "nama_indikator": "Gini Ratio",                      "bobot": 0.40},
    {"nama_dimensi": "Struktural", "nama_indikator": "Pengangguran Usia 15-29",         "bobot": 0.40},
    {"nama_dimensi": "Struktural", "nama_indikator": "Kepercayaan Pemerintah (invert)", "bobot": 0.40},
    # Dimensi Mobilisasi — bobot dimensi 30%
    {"nama_dimensi": "Mobilisasi", "nama_indikator": "Mahasiswa per 100rb Penduduk",   "bobot": 0.30},
    {"nama_dimensi": "Mobilisasi", "nama_indikator": "Penetrasi Internet/Smartphone",  "bobot": 0.30},
    {"nama_dimensi": "Mobilisasi", "nama_indikator": "Insiden Konflik (5 Tahun)",      "bobot": 0.30},
    # Dimensi Sentimen Digital — bobot dimensi 30%
    {"nama_dimensi": "Sentimen Digital", "nama_indikator": "Volume Mention Isu Sensitif", "bobot": 0.30},
    {"nama_dimensi": "Sentimen Digital", "nama_indikator": "Tone Narasi Negatif/Marah",  "bobot": 0.30},
    {"nama_dimensi": "Sentimen Digital", "nama_indikator": "Pertumbuhan Tagar Kritis",   "bobot": 0.30},
]

DEFAULT_USERS = [
    {"username": "admin",   "email": "admin@iksp.go.id",   "password": "Admin@12345",  "role": "Admin"},
    {"username": "analis1", "email": "analis1@iksp.go.id", "password": "Analis@12345", "role": "Analis"},
    {"username": "viewer1", "email": "viewer1@iksp.go.id", "password": "Viewer@12345", "role": "Viewer"},
]

OLD_DIMENSION_NAMES = {"Sosial", "Ekonomi", "Politik"}


def seed_database(db: Session) -> None:
    _seed_wilayah(db)
    _seed_parameter_bobot(db)
    _seed_users(db)


def _seed_wilayah(db: Session) -> None:
    existing = db.query(Wilayah).count()
    if existing > 0:
        return
    for p in PROVINCES:
        db.add(Wilayah(kode=p["kode"], nama=p["nama"], level="provinsi", lat=p["lat"], lng=p["lng"]))
    db.commit()
    print(f"Seeded {len(PROVINCES)} provinces.")


def _seed_parameter_bobot(db: Session) -> None:
    # Migrasi: hapus entri lama dengan nama dimensi yang salah
    old_entries = db.query(ParameterBobot).filter(
        ParameterBobot.nama_dimensi.in_(OLD_DIMENSION_NAMES)
    ).all()
    if old_entries:
        for entry in old_entries:
            db.delete(entry)
        db.commit()
        print(f"Migrasi: dihapus {len(old_entries)} entri dimensi lama (Sosial/Ekonomi/Politik).")

    existing = db.query(ParameterBobot).count()
    if existing > 0:
        return
    for pb in PARAMETER_BOBOT:
        db.add(ParameterBobot(**pb))
    db.commit()
    print(f"Seeded {len(PARAMETER_BOBOT)} parameter bobot (Struktural/Mobilisasi/Sentimen Digital).")


def _seed_users(db: Session) -> None:
    for u in DEFAULT_USERS:
        existing = db.query(User).filter(User.username == u["username"]).first()
        if not existing:
            db.add(User(
                username=u["username"],
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
                is_active=True,
            ))
    db.commit()
    print("Seeded default users.")
