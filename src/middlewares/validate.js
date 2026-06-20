import { z } from 'zod';

export function validate(schema, source = 'body') {
    return (req, res, next) => {
        const resultado = schema.safeParse(req[source]);
        if (!resultado.success) {
            const errores = resultado.error.flatten().fieldErrors;
            return res.status(400).json({
                error: 'Error de validación',
                details: errores,
            });
        }
        req[source] = resultado.data;
        next();
    };
}
