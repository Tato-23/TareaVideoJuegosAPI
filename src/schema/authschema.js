import { z } from 'zod';

export const registerSchema = z.object({
  nombre_usuario: z
    .string()
    .min(3,  'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede superar 50 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El nombre de usuario solo puede contener letras y números'),
  correo: z
    .string()
    .email('El correo no tiene un formato válido'),
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
})

export const loginSchema = z.object({
  correo:     z.string().email('El correo no tiene un formato válido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'El refresh token es requerido'),
})
