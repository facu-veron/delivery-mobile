import { create } from 'zustand';

import { RolUsuario } from '@/shared/types/pedido.types';

interface SessionData {
  usuarioId: string;
  rol: RolUsuario;
  perfilId: string;
  nombre: string;
}

interface AuthState extends SessionData {
  isAuthenticated: boolean;
  setSession: (data: SessionData) => void;
  clearSession: () => void;
}

const initialState = {
  isAuthenticated: false,
  usuarioId: '',
  rol: null as unknown as RolUsuario,
  perfilId: '',
  nombre: '',
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  setSession: (data) => set({ ...data, isAuthenticated: true }),
  clearSession: () => set({ ...initialState }),
}));
