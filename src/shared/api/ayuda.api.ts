import { apiClient } from './client';

export type CategoriaFaq = 'PAGOS' | 'PEDIDOS' | 'CUENTA' | 'OTROS';

export interface Faq {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: CategoriaFaq;
}

export interface ContactoDto {
  asunto: string;
  mensaje: string;
  pedidoId?: string;
}

export const ayudaApi = {
  getFaqs: async (): Promise<Faq[]> => {
    const { data } = await apiClient.get<Faq[]>('/api/ayuda/faqs');
    return data;
  },

  enviarContacto: async (dto: ContactoDto): Promise<{ mensaje: string }> => {
    const { data } = await apiClient.post<{ mensaje: string }>('/api/ayuda/contacto', dto);
    return data;
  },
};
