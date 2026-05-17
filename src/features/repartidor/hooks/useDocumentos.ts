import { useQuery } from '@tanstack/react-query';

import { repartidorApi } from '../api/repartidor.api';

export function useDocumentos() {
  return useQuery({
    queryKey: ['repartidor', 'documentos'],
    queryFn: () => repartidorApi.getDocumentos().then((r) => r.data),
  });
}
