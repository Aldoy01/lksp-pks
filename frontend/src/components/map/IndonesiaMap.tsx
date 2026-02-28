import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { PetaRisikoItem } from '@/types'
import { RISK_COLORS, RISK_BORDER_COLORS } from '@/lib/constants'
import { formatScore } from '@/lib/utils'

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface IndonesiaMapProps {
  riskData: PetaRisikoItem[]
  onSelectWilayah: (item: PetaRisikoItem | null) => void
}

export default function IndonesiaMap({ riskData, onSelectWilayah }: IndonesiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const geoLayerRef = useRef<L.GeoJSON | null>(null)

  const riskMap = new Map(riskData.map((d) => [d.kode, d]))

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [-2.5, 117.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 9,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      opacity: 0.4,
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update GeoJSON layer when risk data changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (geoLayerRef.current) {
      geoLayerRef.current.remove()
      geoLayerRef.current = null
    }

    fetch('/indonesia-provinces.geojson')
      .then((r) => r.json())
      .then((geojson) => {
        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const kode = feature?.properties?.kode || feature?.properties?.KODE_PROV || ''
            const risk = riskMap.get(String(kode))
            const kategori = risk?.kategori ?? null
            return {
              fillColor: RISK_COLORS[kategori ?? 'no-data'],
              fillOpacity: 0.75,
              weight: 1.5,
              color: RISK_BORDER_COLORS[kategori ?? 'no-data'],
              opacity: 1,
            }
          },
          onEachFeature: (feature, layer) => {
            const kode = feature?.properties?.kode || feature?.properties?.KODE_PROV || ''
            const risk = riskMap.get(String(kode))
            const nama = feature?.properties?.nama || feature?.properties?.Propinsi || kode

            const tooltipContent = risk?.has_data
              ? `<strong>${nama}</strong><br/>IKSP: ${formatScore(risk.total)}<br/>${risk.kategori}`
              : `<strong>${nama}</strong><br/><em>Belum ada data</em>`

            layer.bindTooltip(tooltipContent, { sticky: true })

            layer.on({
              mouseover(e) {
                const l = e.target
                l.setStyle({ weight: 2.5, fillOpacity: 0.9 })
                l.bringToFront()
              },
              mouseout(e) {
                geoLayerRef.current?.resetStyle(e.target)
              },
              click() {
                onSelectWilayah(risk || { kode: String(kode), nama, lat: null, lng: null, total: null, kategori: null, dim1: null, dim2: null, dim3: null, has_data: false })
              },
            })
          },
        })

        layer.addTo(map)
        geoLayerRef.current = layer
      })
      .catch(() => {
        // GeoJSON not found — show marker fallback
        riskData.forEach((item) => {
          if (!item.lat || !item.lng) return
          const color = RISK_COLORS[item.kategori ?? 'no-data']
          const circle = L.circleMarker([item.lat, item.lng], {
            radius: 12,
            fillColor: color,
            color: '#fff',
            weight: 2,
            fillOpacity: 0.85,
          })
          circle.bindTooltip(
            `<strong>${item.nama}</strong><br/>IKSP: ${formatScore(item.total)}<br/>${item.kategori ?? 'No data'}`,
            { sticky: true }
          )
          circle.on('click', () => onSelectWilayah(item))
          circle.addTo(map)
        })
      })
  }, [riskData])

  return <div ref={mapRef} className="w-full h-full rounded-xl" />
}
