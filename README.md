# Product Store API

Backend REST API para la gestion de productos de una tienda online. Construido con **Fastify**, **TypeScript** y **MongoDB**, con documentacion OpenAPI interactiva generada automaticamente.

## Caracteristicas Principales

- **Alto rendimiento**: Basado en Fastify, uno de los frameworks Node.js mas rapidos.
- **Tipado estatico**: Codigo 100% TypeScript con validacion de esquemas en tiempo de ejecucion.
- **Documentacion automatica**: Swagger/OpenAPI generado desde los esquemas Zod, disponible en `/docs`.
- **Arquitectura modular**: Rutas, servicios y modelos organizados por modulos (`src/modules/`).
- **Validacion de entorno**: Variables de entorno validadas con Zod al iniciar la aplicacion.
- **Calidad de codigo**: Formateo y linting con Biome (punto y coma obligatorio, comillas simples, tabs).
- **Manejo centralizado de errores**: Clases de error personalizadas propagadas a un handler unico de Fastify, sin `try/catch` en las rutas.
- **Logging estructurado**: Logger global con Pino (compatible con Fastify) para reemplazar `console.log`, con pretty-printing en desarrollo.

## Stack Tecnologico

| Categoria | Tecnologia | Version | Proposito |
|-----------|-----------|---------|-----------|
| **Runtime** | Node.js | 20+ | Entorno de ejecucion |
| **Framework** | Fastify | ^5.8.5 | Servidor HTTP de alto rendimiento |
| **Lenguaje** | TypeScript | ^6.0.3 | Tipado estatico y features modernas |
| **Validacion** | Zod | ^4.3.6 | Validacion de esquemas y tipos |
| **Base de datos** | MongoDB | — | Base de datos NoSQL documental |
| **ODM** | Mongoose | ^9.5.0 | Modelado de datos para MongoDB |
| **Documentacion** | Scalar / Swagger | ^1.52.5 / ^9.7.0 | UI interactiva OpenAPI |
| **Dev Tools** | tsx | ^4.21.0 | Ejecucion de TS sin compilacion previa |
| **Linting** | Biome | ^2.4.12 | Formateo y linting ultrarrapido |
| **Package Manager** | pnpm | 10.8.1 | Gestor de dependencias |

## Requisitos Previos

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 10
- [MongoDB](https://www.mongodb.com/) (local o Atlas)

## Instalacion

```bash
# Clonar el repositorio
git clone <repo-url>
cd backend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

## Variables de Entorno

Crea un archivo `.env` en la raiz del proyecto con las siguientes variables:

| Variable | Descripcion | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `5555` |
| `HOST` | Host del servidor | `localhost` |
| `DB_URL` | URI de conexion a MongoDB | *(requerido)* |

Ejemplo:

```env
PORT=5555
HOST=0.0.0.0
DB_URL=mongodb+srv://usuario:password@cluster.mongodb.net/product-store
```

## Scripts Disponibles

| Script | Comando | Descripcion |
|--------|---------|-------------|
| `dev` | `pnpm dev` | Inicia el servidor en modo desarrollo con recarga automatica (`tsx watch`) |
| `build` | `pnpm build` | Compila TypeScript a JavaScript en la carpeta `dist/` |
| `start` | `pnpm start` | Ejecuta la aplicacion compilada con Node.js (requiere `.env`) |
| `start:prod` | `pnpm start:prod` | Ejecuta en modo produccion con Node.js |
| `lint` | `pnpm lint` | Ejecuta el linter de Biome |
| `format` | `pnpm format` | Formatea el codigo con Biome |
| `check` | `pnpm check` | Ejecuta lint + format + check de Biome |
| `typecheck` | `pnpm typecheck` | Verifica tipos de TypeScript sin emitir archivos |

```bash
# Modo desarrollo con hot-reload
pnpm dev

# Compilar para produccion
pnpm build

# Ejecutar en produccion (con .env)
pnpm start

# Ejecutar en produccion (con NODE_ENV=production)
pnpm start:prod
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── app.ts                 # Configuracion principal de Fastify (plugins, swagger, rutas)
│   ├── server.ts              # Punto de entrada: conecta DB e inicia el servidor
│   ├── config/
│   │   ├── env.ts             # Validacion de variables de entorno con Zod
│   │   └── db.ts              # Logica de conexion a MongoDB con Mongoose
│   ├── models/
│   │   ├── index.ts           # Re-exporta los modelos
│   │   └── product.model.ts   # Esquema y modelo de Mongoose para Product
│   ├── modules/
│   │   └── products/
│   │       ├── products.route.ts    # Rutas del dominio Productos
│   │       ├── products.schema.ts   # Esquemas Zod con documentacion OpenAPI
│   │       └── products.service.ts  # Logica de negocio (CRUD parcial)
│   ├── routes/
│   │   └── index.ts           # Registro central de rutas por modulo
│   └── utils/
│       ├── errors.ts          # Clases de error personalizadas (NotFoundError, ValidationError, DatabaseError)
│       ├── errorHandler.ts    # Handler centralizado de errores de Fastify
│       ├── httpResponses.ts   # Helpers estandarizados para respuestas HTTP
│       └── logger.ts          # Logger global con Pino (pretty-print en desarrollo)
├── package.json
├── tsconfig.json              # Configuracion TypeScript (ES2024, NodeNext)
├── biome.json                 # Configuracion de Biome (semicolons: always, tabs, single quotes)
├── .env                       # Variables de entorno (no versionar)
├── .env.example               # Ejemplo de variables de entorno
├── Dockerfile                 # Build multi-stage con Node.js 24
├── .dockerignore              # Exclusiones para Docker build
└── pnpm-lock.yaml
```

## Endpoints

### Base URL

```
http://localhost:5555/api
```

### Rutas Disponibles

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/` | Health check - Confirma que la API esta funcionando |
| GET | `/api/products` | Obtiene todos los productos. Soporta paginacion y filtros opcionales (ver Query Params abajo) |
| POST | `/api/products` | Crea un nuevo producto |
| PUT | `/api/products/:id` | Actualiza un producto existente (campos parciales) |
| DELETE | `/api/products/:id` | Elimina un producto por ID |

### Query Params - GET /api/products

Todos los parametros son **opcionales**. Si no se envian, retorna todos los registros.

| Parametro | Tipo | Descripcion | Ejemplo |
|-----------|------|-------------|---------|
| `page` | `number` | Numero de pagina (requiere `limit`) | `1` |
| `limit` | `number` | Cantidad de items por pagina (requiere `page`) | `10` |
| `search` | `string` | Busqueda por nombre (case-insensitive) | `headphone` |
| `minPrice` | `number` | Precio minimo | `50` |
| `maxPrice` | `number` | Precio maximo | `200` |

#### Ejemplos

```bash
# Todos los productos
GET /api/products

# Paginacion
GET /api/products?page=1&limit=10

# Busqueda por nombre
GET /api/products?search=headphone

# Filtro por rango de precio
GET /api/products?minPrice=50&maxPrice=200

# Combinados
GET /api/products?page=1&limit=5&search=headphone&minPrice=50
```

### Documentacion Interactiva

Una vez iniciado el servidor, accede a la documentacion OpenAPI interactiva:

```
http://localhost:5555/docs
```

Generada automaticamente con **Scalar** a partir de los esquemas Zod definidos en las rutas, incluyendo ejemplos y descripciones para cada campo.

## Flujo de Validacion

1. **Entorno**: `env.ts` valida `PORT`, `HOST` y `DB_URL` usando Zod antes de que arranque el servidor.
2. **Requests**: `fastify-type-provider-zod` compila los esquemas Zod de cada ruta en validadores JSON Schema nativos de Fastify.
3. **Documentacion**: `@fastify/swagger` genera la especificacion OpenAPI a partir de esos esquemas.

## Modelo de Datos

### Product

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `name` | `string` | Si | Nombre del producto |
| `price` | `number` | Si | Precio en USD |
| `image` | `string` | Si | URL de la imagen del producto |
| `createdAt` | `Date` | Auto | Fecha de creacion (timestamps) |
| `updatedAt` | `Date` | Auto | Fecha de ultima actualizacion (timestamps) |

## Configuracion de Biome

El proyecto utiliza **Biome** como formatter y linter con las siguientes reglas de estilo:

- **Indentacion**: Tabs
- **Comillas**: Simples (`'...'`)
- **Punto y coma**: Siempre obligatorio (`;`)
- **Trailing commas**: Siempre (`all`)
- **Linter**: Reglas recomendadas habilitadas
- **Asistencia**: Organizacion automatica de imports

```bash
# Formatear todo el proyecto
npx biome format --write

# Linting
npx biome lint
```

## Manejo de Errores

El proyecto implementa un **manejo centralizado de errores** mediante `app.setErrorHandler()` de Fastify. Las rutas no utilizan `try/catch`; en su lugar, los errores se propagan al handler central que responde con un formato estandarizado.

### Clases de Error Disponibles

| Clase | Status Code | Uso |
|-------|-------------|-----|
| `AppError` | configurable | Error base para todos los errores de la aplicacion |
| `NotFoundError` | 404 | Recurso no encontrado (por ejemplo, producto inexistente) |
| `ValidationError` | 400 | Datos de entrada invalidos |
| `DatabaseError` | 500 | Errores de base de datos |

### Flujo de Errores

1. El servicio detecta una condicion de error (por ejemplo, producto no encontrado) y lanza una excepcion.
2. La ruta **no captura el error** — se propaga automaticamente al `errorHandler`.
3. El `errorHandler` clasifica el error por tipo y responde con el `statusCode` y formato adecuados.
4. Los errores de validacion de Zod/Fastify tambien se capturan y devuelven como `400`.

### Respuesta de Error Estandar

```json
{
  "message": "Product not found",
  "data": null,
  "timestamp": "2026-04-23T14:30:00.000Z",
  "errorCode": 404
}
```

## Logging

El proyecto utiliza **Pino** como logger global para reemplazar completamente `console.log`.

### Caracteristicas

- **En desarrollo**: Salida formateada y coloreada con `pino-pretty` (horario legible, sin `pid`/`hostname`).
- **En produccion**: Salida JSON estructurada estandar (configurable via `NODE_ENV`).
- **Nivel de log**: Configurable via la variable de entorno `LOG_LEVEL` (por defecto `info`).

### Uso

```typescript
import { logger } from './utils/logger.js';

logger.info('Server started');
logger.error(error, 'Database connection failed');
logger.warn('Rate limit approaching');
logger.debug({ query }, 'Executing database query');
```

### Archivos que utilizan el logger

- `src/utils/logger.ts` — Instancia global de Pino
- `src/app.ts` — Inyectado como `loggerInstance` en Fastify
- `src/server.ts` — Log de inicio del servidor
- `src/config/db.ts` — Log de conexion a MongoDB
- `src/config/env.ts` — Log de errores de validacion de entorno
- `src/utils/errorHandler.ts` — Log de errores no manejados
- `src/modules/products/products.service.ts` — Log de errores de base de datos

## Docker

El proyecto incluye un `Dockerfile` multi-stage para construir una imagen optimizada de produccion.

### Construir la imagen

```bash
docker build -t product-store-api .
```

### Ejecutar el contenedor

```bash
# Con variables de entorno desde el archivo .env
docker run -p 5555:5555 --env-file .env product-store-api

# O pasando variables manualmente
docker run -p 5555:5555 \
  -e PORT=5555 \
  -e HOST=0.0.0.0 \
  -e DB_URL=mongodb+srv://usuario:password@cluster.mongodb.net/product-store \
  -e LOG_LEVEL=info \
  product-store-api
```

### Archivos de Docker

- `Dockerfile` — Build multi-stage (builder + produccion)
- `.dockerignore` — Excluye archivos innecesarios del contexto de build

### Dockerfile (resumen)

1. **Stage builder**: Instala dependencias y compila TypeScript a `dist/` usando `tsc`
2. **Stage production**: Instala solo dependencias de produccion y copia los archivos compilados
3. **Healthcheck**: Verifica que la API responde en `GET /`
4. **CMD**: Ejecuta `node dist/server.js`

### Compilacion (Build)

```bash
# Compilar para produccion
pnpm build

# El build genera archivos .js en dist/
```

## Proximos Pasos

- [x] ~~Exponer `createProduct` en una ruta POST `/api/products`~~
- [x] ~~Implementar rutas PUT y DELETE para productos~~
- [x] ~~Agregar paginacion y filtros en listados~~
- [x] ~~Implementar manejo centralizado de errores~~
- [x] ~~Agregar build, start y Dockerfile~~
- [ ] Agregar tests unitarios e integracion

## Licencia

ISC
