# API Video Juegos

## Instalación y puesta en marcha

Antes de ejecutar la aplicación es necesario instalar las dependencias del proyecto. Para ello, una vez clonado el repositorio, debe abrirse una terminal en la carpeta raíz del proyecto y ejecutar el comando `npm install`. Este comando lee el archivo `package.json`, donde se encuentran listadas todas las librerías que utiliza el proyecto (Express, pg, jsonwebtoken, bcrypt, zod, entre otras), y las descarga automáticamente generando la carpeta `node_modules`. 

Es importante aclarar que esta carpeta no se incluye dentro del repositorio debido a su gran tamaño y a que su contenido puede regenerarse en cualquier momento a partir del `package.json`; por esta razón se encuentra excluida mediante el archivo `.gitignore`. En consecuencia, cada persona que descargue o clone el proyecto deberá ejecutar este paso antes de poder correr la aplicación, ya que sin las dependencias instaladas el servidor no podrá iniciarse correctamente.

Una vez instaladas las dependencias, el siguiente paso es configurar las variables de entorno. El proyecto incluye un archivo `.env.example` con todas las variables necesarias y sus descripciones. Se debe crear un archivo `.env` en la carpeta raíz del proyecto copiando ese archivo de ejemplo y completando cada valor según el entorno local: los datos de conexión a la base de datos PostgreSQL (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), el secreto para firmar los JWT (`JWT_SECRET`), los tiempos de expiración de los tokens (`JWT_EXPIRATION`, `REFRESH_TTL_DAYS`) y el puerto en el que correrá el servidor (`PORT`). Sin este archivo la aplicación no podrá iniciarse correctamente.

Con las dependencias instaladas y el archivo `.env` configurado, la aplicación se inicia ejecutando el comando `npm start` en la terminal. El servidor quedará disponible en el puerto `3000` (o el que se haya definido en la variable `PORT` del `.env`), y podrá recibir peticiones en `http://localhost:3000`.

## Estructura del proyecto

La organización del proyecto amplía la estructura base para lograr una separación de responsabilidades más clara y ordenada. A continuación se describe el propósito de cada una de las carpetas que conforman el proyecto:

1. **controllers**: contiene la lógica encargada de recibir las peticiones HTTP, llamar a los servicios correspondientes y enviar las respuestas al cliente.

2. **services**: concentra las reglas de negocio de la aplicación, manteniendo a los controladores más limpios y enfocados únicamente en el manejo de la petición y la respuesta.

3. **repositories**: se encarga de todo lo relacionado con el acceso a la base de datos, incluyendo las consultas SQL parametrizadas hacia PostgreSQL.

4. **routes**: define las rutas de la API y las asocia con sus respectivos middlewares y controladores.

5. **middlewares**: contiene la autenticación mediante JWT, la validación de datos de entrada con Zod y el manejo centralizado de errores.

6. **schema**: define los esquemas de validación utilizados por Zod para los distintos recursos de la aplicación.

7. **error**: contiene las clases personalizadas de errores (`AppError` y sus derivadas) utilizadas a lo largo de la aplicación.

8. **db**: configura la conexión hacia la base de datos PostgreSQL mediante el driver `pg`.

Adicionalmente, el proyecto cuenta con los archivos `app.js`, donde se configura la aplicación de Express junto con sus middlewares y rutas, y `server.js`, que es el punto de entrada encargado de iniciar el servidor. También se incluye una carpeta `sql` con el script `init.sql` para la creación de las tablas, y una carpeta `test` destinada a las pruebas del proyecto.

## Explicación de Endpoints

## Endpoints de Autenticación

1. **POST `/api/auth/register`** — público. Recibe `username`, `email` y `password` validados con Zod, hashea la contraseña con `bcrypt` y responde `201 Created` con los datos del usuario (sin `password_hash`).

2. **POST `/api/auth/login`** — público. Verifica credenciales y devuelve un **access token** (JWT de corta duración) y un **refresh token** (persistido en base de datos). Responde `401` si las credenciales son inválidas.

3. **POST `/api/auth/refresh`** — público. Recibe el refresh token y, si es válido y no ha sido revocado, devuelve un nuevo access token. Responde `401` en caso contrario.

4. **POST `/api/auth/logout`** — público. Recibe el refresh token e invalida la sesión marcándolo como revocado en la base de datos.

## Endpoints de Estudios

1. **GET `/api/studios`** — público. Devuelve el listado completo de estudios registrados.

2. **GET `/api/studios/:id`** — público. Devuelve un estudio por su `id`. Responde `404` si no existe.

3. **POST `/api/studios`** — protegido (JWT). Registra un nuevo estudio. Los datos se validan con Zod; responde `400` si la validación falla.

4. **PUT `/api/studios/:id`** — protegido (JWT). Actualiza un estudio existente con validación Zod. Responde `404` si no existe.

5. **DELETE `/api/studios/:id`** — protegido (JWT). Elimina un estudio. Si tiene videojuegos asociados, rechaza la operación con `409 Conflict` para preservar la integridad referencial.

6. **GET `/api/studios/:id/games`** — público. Devuelve un estudio junto con sus videojuegos mediante un `JOIN` entre `studios` y `games`.

## Endpoints de Videojuegos

1. **GET `/api/games`** — público. Devuelve todos los videojuegos con el nombre del estudio incluido vía `JOIN`.

2. **GET `/api/games/:id`** — público. Devuelve un videojuego por su `id` incluyendo el estudio. Responde `404` si no existe.

3. **POST `/api/games`** — protegido (JWT). Registra un nuevo videojuego. Requiere `studio_id` válido y valida los datos con Zod.

4. **PUT `/api/games/:id`** — protegido (JWT). Actualiza un videojuego existente con validación Zod. Responde `404` si no existe.

5. **DELETE `/api/games/:id`** — protegido (JWT). Elimina un videojuego del catálogo. Responde `404` si no existe.

## Decisiones técnicas

A lo largo del desarrollo se tomaron una serie de decisiones que vale la pena destacar:

- **Arquitectura en capas**: se separó el código en controladores, servicios y repositorios para mantener cada capa con una única responsabilidad. Esto facilita la legibilidad, el mantenimiento y la posibilidad de reemplazar piezas (por ejemplo, cambiar el motor de base de datos) sin afectar el resto de la aplicación.

- **Validación con Zod**: se eligió Zod para validar los datos de entrada porque permite definir esquemas expresivos directamente en TypeScript/JavaScript, con mensajes de error claros. La validación se aplica como middleware antes de llegar al controlador, por lo que los servicios y repositorios reciben datos ya verificados.

- **Autenticación con Access y Refresh Tokens**: se implementó un esquema de doble token. El access token tiene vida corta para minimizar el riesgo si es comprometido, mientras que el refresh token se persiste en base de datos, lo que permite revocarlo explícitamente al hacer logout o detectar un uso sospechoso.

- **Manejo centralizado de errores**: se crearon clases de error personalizadas (`AppError` y derivadas) que son capturadas por un middleware global. Esto evita duplicar lógica de respuesta de errores en cada controlador y garantiza respuestas HTTP consistentes en toda la API.

- **Integridad referencial controlada en aplicación**: antes de eliminar un estudio se verifica en la capa de servicio si tiene videojuegos asociados, respondiendo con `409 Conflict`. Esta decisión complementa las restricciones a nivel de base de datos y ofrece un mensaje de error más descriptivo al cliente.

- **Script de inicialización SQL**: se incluyó el archivo `sql/init.sql` con la creación de las tablas para facilitar la puesta en marcha del proyecto sin necesidad de ejecutar migraciones adicionales.
