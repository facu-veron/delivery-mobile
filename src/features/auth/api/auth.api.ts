import { apiClient } from '@/shared/api/client';
import type { LoginInput } from '../schemas/login.schema';
import type { RegistroClienteInput, RegistroRepartidorInput } from '../schemas/registro.schema';

export const authApi = {
  login: (data: LoginInput) =>
    apiClient.post('/auth/signin', data),

  logout: () =>
    apiClient.get('/auth/signout'),

  registrarCliente: (data: RegistroClienteInput) =>
    apiClient.post('/api/registro/cliente', data),

  registrarRepartidor: (data: RegistroRepartidorInput) =>
    apiClient.post('/api/registro/repartidor', data),
};
