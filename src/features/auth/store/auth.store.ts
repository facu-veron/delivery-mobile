import { create } from 'zustand';

import { RolUsuario } from '@/shared/types/pedido.types';

interface SessionCore {
  usuarioId: string;
  rol: RolUsuario;
  perfilId: string;
  nombre: string;
}

interface SessionProfile {
  telefono: string;
  avatarUrl: string | null;
}

interface AuthState extends SessionCore, SessionProfile {
  isAuthenticated: boolean;
  setSession: (data: SessionCore) => void;
  setPerfil: (data: Partial<SessionProfile> & { nombre?: string }) => void;
  clearSession: () => void;
}

const initialState = {
  isAuthenticated: false,
  usuarioId: '',
  rol: null as unknown as RolUsuario,
  perfilId: '',
  nombre: '',
  telefono: '',
  avatarUrl: null as string | null,
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  setSession: (data) => set({ ...data, isAuthenticated: true }),
  setPerfil: (data) => set((s) => ({ ...s, ...data })),
  clearSession: () => set({ ...initialState }),
}));
