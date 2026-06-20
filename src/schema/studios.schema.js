import { z } from 'zod';

export const studioSchema = z.object({
  nombre: z
    .string()
    .min(1,   'El nombre del estudio es requerido')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  pais: z
    .string()
    .max(100, 'El país no puede superar 100 caracteres')
    .optional(),
  descripcion: z
    .string()
    .optional(),
});
