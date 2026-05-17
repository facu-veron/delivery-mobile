import { z } from 'zod';

const base = z.object({
  nombre: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  telefono: z.string().min(8, 'Teléfono inválido'),
});

export const registroClienteSchema = base;
export type RegistroClienteInput = z.infer<typeof registroClienteSchema>;

export const registroRepartidorSchema = base.extend({
  vehiculo: z.string().min(2, 'Ingresá el tipo de vehículo'),
  zona: z.string().min(2, 'Ingresá tu zona de trabajo'),
});
export type RegistroRepartidorInput = z.infer<typeof registroRepartidorSchema>;
