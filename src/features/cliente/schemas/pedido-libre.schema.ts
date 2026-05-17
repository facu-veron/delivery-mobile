import { z } from 'zod';

export const pedidoLibreSchema = z.object({
  localNombre: z.string().min(2, 'Ingresá el nombre del local'),
  localDireccion: z.string().min(5, 'Ingresá la dirección del local'),
  clienteDireccion: z.string().min(5, 'Ingresá tu dirección de entrega'),
  productoDescripcion: z.string().min(3, 'Describí lo que necesitás'),
  precioEstimado: (z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().positive('El monto debe ser mayor a 0').optional()
  ) as z.ZodType<number | undefined>),
  instruccionSinStock: z.string().optional(),
});

export type PedidoLibreFormValues = z.infer<typeof pedidoLibreSchema>;
