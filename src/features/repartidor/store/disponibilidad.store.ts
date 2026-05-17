import { create } from 'zustand';

interface DisponibilidadState {
  disponible: boolean;
  setDisponible: (value: boolean) => void;
}

export const useDisponibilidadStore = create<DisponibilidadState>()((set) => ({
  disponible: false,
  setDisponible: (value) => set({ disponible: value }),
}));
