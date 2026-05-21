import { apiClient } from '@/shared/api/client';
import type { LoginInput } from '../schemas/login.schema';
import type { RegistroClienteInput, RegistroRepartidorInput } from '../schemas/registro.schema';

export const authApi = {
  login: (data: LoginInput) =>
    apiClient.post('/auth/signin', {
      formFields: [
        { id: 'email', value: data.email },
        { id: 'password', value: data.password },
      ],
    }),

  logout: () =>
    apiClient.post('/auth/signout'),

  registrarCliente: (data: RegistroClienteInput) =>
    apiClient.post('/api/registro/cliente', data),

  registrarRepartidor: (data: RegistroRepartidorInput) =>
    apiClient.post('/api/registro/repartidor', data),

  cambiarPassword: (dto: { passwordActual: string; passwordNueva: string }) =>
    apiClient.post('/api/cambiar-password', dto),
};
