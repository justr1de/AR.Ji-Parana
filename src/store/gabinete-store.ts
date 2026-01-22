import { create } from 'zustand'
import type { User, Gabinete } from '@/types/gabinete'

interface GabineteState {
  user: User | null
  gabinete: Gabinete | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setGabinete: (gabinete: Gabinete | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useGabineteStore = create<GabineteState>((set) => ({
  user: null,
  gabinete: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setGabinete: (gabinete) => set({ gabinete }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, gabinete: null, isLoading: false }),
}))
