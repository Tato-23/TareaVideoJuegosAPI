export function errorHandler(err, req, res, next) {
    console.error("[ERROR]", err.stack);

    // Error de violación de clave foránea en PostgreSQL (código 23503)
    if (err.code === '23503') {
        return res.status(400).json({ error: 'Referencia inválida: el registro relacionado no existe.' });
    }

    // Error de duplicado (código 23505)
    if (err.code === '23505') {
        return res.status(409).json({ error: 'El recurso ya existe (valor duplicado).' });
    }

    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor"
    });
}