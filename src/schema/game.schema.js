import { z } from 'zod';

export const gameSchema = z.object({
  titulo: z
    .string()
    .min(1,   'El título del videojuego es requerido')
    .max(150, 'El título no puede superar 150 caracteres'),
  genero: z
    .string()
    .max(80, 'El género no puede superar 80 caracteres')
    .optional(),
  descripcion: z
    .string()
    .optional(),
  studio_id: z
    .number()
    .int()
    .positive('El studio_id debe ser un número entero positivo'),
});
