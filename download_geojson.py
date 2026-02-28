"""
Script untuk mengunduh GeoJSON provinsi Indonesia.
Jalankan: python download_geojson.py
"""
import urllib.request
import json
import os

URLS = [
    "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia.geojson",
    "https://raw.githubusercontent.com/ans-4175/peta-indonesia-geojson/master/indonesia-prov.geojson",
]

OUTPUT = os.path.join(os.path.dirname(__file__), "frontend", "public", "indonesia-provinces.geojson")


def download():
    for url in URLS:
        try:
            print(f"Mencoba: {url}")
            with urllib.request.urlopen(url, timeout=15) as r:
                data = json.load(r)
            with open(OUTPUT, "w", encoding="utf-8") as f:
                json.dump(data, f)
            print(f"Berhasil disimpan ke: {OUTPUT}")
            return
        except Exception as e:
            print(f"  Gagal: {e}")

    print("\nSemua URL gagal. Coba manual:")
    print("  1. Buka https://github.com/superpikar/indonesia-geojson")
    print("  2. Download indonesia.geojson")
    print(f"  3. Simpan ke: {OUTPUT}")


if __name__ == "__main__":
    download()
