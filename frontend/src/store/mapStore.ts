import { create } from 'zustand'
import { currentPeriode } from '@/lib/utils'

interface MapState {
  selectedPeriode: string
  selectedWilayahKode: string | null
  setSelectedPeriode: (periode: string) => void
  setSelectedWilayahKode: (kode: string | null) => void
}

export const useMapStore = create<MapState>((set) => ({
  selectedPeriode: '',
  selectedWilayahKode: null,
  setSelectedPeriode: (periode) => set({ selectedPeriode: periode }),
  setSelectedWilayahKode: (kode) => set({ selectedWilayahKode: kode }),
}))
