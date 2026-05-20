import { apiClient } from '@/shared/api/client';
import type { MePerfil, MeResponse } from '@/shared/types/pedido.types';

export const meApi = {
  getMe: () => apiClient.get<MeResponse>('/api/me'),

  actualizar: (data: { nombre?: string; telefono?: string }) =>
    apiClient.patch<MePerfil>('/api/me', data),

  subirAvatar: (formData: FormData) =>
    apiClient.post<{ avatarUrl: string }>('/api/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
