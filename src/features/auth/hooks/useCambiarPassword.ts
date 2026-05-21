import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api/auth.api';

export function useCambiarPassword() {
  return useMutation({
    mutationFn: (dto: { passwordActual: string; passwordNueva: string }) =>
      authApi.cambiarPassword(dto),
  });
}
