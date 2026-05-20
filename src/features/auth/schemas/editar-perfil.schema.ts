import { z } from 'zod';

export const editarPerfilSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  telefono: z
    .string()
    .min(8, 'Ingresá un teléfono válido')
    .max(20, 'Teléfono demasiado largo'),
  vehiculo: z
    .string()
    .min(2, 'El vehículo debe tener al menos 2 caracteres')
    .max(60, 'Vehículo demasiado largo')
    .optional(),
});

export type EditarPerfilInput = z.infer<typeof editarPerfilSchema>;
