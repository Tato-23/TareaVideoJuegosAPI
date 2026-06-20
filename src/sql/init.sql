-- Ejecutar este script en PostgreSQL para crear la base de datos y las tablas necesarias.

CREATE DATABASE videojuegos_db;

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL       PRIMARY KEY,
    nombre_usuario  VARCHAR(50)  NOT NULL UNIQUE,
    correo          VARCHAR(255) NOT NULL UNIQUE,
    contrasena_hash TEXT         NOT NULL,
    fecha_creacion  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS studios (
    id             SERIAL       PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    pais           VARCHAR(100),
    descripcion    TEXT,
    fecha_creacion TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
    id             SERIAL       PRIMARY KEY,
    titulo         VARCHAR(150) NOT NULL UNIQUE,
    genero         VARCHAR(80),
    descripcion    TEXT,
    studio_id      INTEGER      NOT NULL REFERENCES studios(id) ON DELETE RESTRICT,
    fecha_creacion TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id               SERIAL      PRIMARY KEY,
    token            TEXT        NOT NULL UNIQUE,
    usuario_id       INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fecha_expiracion TIMESTAMPTZ NOT NULL,
    fecha_revocacion TIMESTAMPTZ,
    fecha_creacion   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
