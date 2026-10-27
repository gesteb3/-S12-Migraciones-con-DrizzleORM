# API de Gestión de Inventario de Hardware y Sensores IoT

API HTTP RESTful para administrar dispositivos de hardware y sensores IoT mediante el recurso `devices`.

## Datos del estudiante

- **Nombre:** Gustavo Adolfo Esteban Batres
- **Carné:** 2890 23 25557
- **Repositorio:** [github.com/gesteb3/-S12-Migraciones-con-DrizzleORM](https://github.com/gesteb3/-S12-Migraciones-con-DrizzleORM)

## Tecnologías

- Node.js, TypeScript y Express
- PostgreSQL y `postgres`
- Drizzle ORM y Drizzle Kit
- Zod
- dotenv
- Docker Compose (opcional)

## Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL 14 o superior, o Docker con Docker Compose

## Instalación

```bash
git clone https://github.com/gesteb3/-S12-Migraciones-con-DrizzleORM.git
cd ./-S12-Migraciones-con-DrizzleORM
npm install
```

Copiar el archivo de ejemplo y ajustar la conexión si fuera necesario:

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Variables disponibles:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/hardware_inventory
```

## Base de datos

### Opción A: Docker Compose

```bash
docker compose up -d
npm run migrate
```

El contenedor publica PostgreSQL en `localhost:5432` y conserva los datos en el volumen `hardware_inventory_data`.

Para detenerlo sin borrar los datos:

```bash
docker compose down
```

No utilizar `docker compose down -v` si se desea conservar la información.

### Opción B: PostgreSQL local

Crear la base de datos y configurar `DATABASE_URL` en `.env`:

```sql
CREATE DATABASE hardware_inventory;
```

Luego ejecutar todas las migraciones versionadas:

```bash
npm run migrate
```

No es necesario modificar la base de datos manualmente.

## Ejecución

Desarrollo con recarga automática:

```bash
npm run dev
```

Producción:

```bash
npm run build
npm start
```

Comprobar el servicio:

```bash
curl http://localhost:3000/health
```

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia la API en modo desarrollo |
| `npm run build` | Compila TypeScript en `dist/` |
| `npm start` | Ejecuta la versión compilada |
| `npm run generate` | Genera una migración desde el esquema Drizzle |
| `npm run migrate` | Aplica las migraciones pendientes a PostgreSQL |

## Migraciones y evolución del esquema

Las migraciones y sus metadatos se conservan en `drizzle/`.

1. `0000_tearful_ares.sql`: crea `devices` con `id`, `name`, `device_type`, `ip_address`, `status` y `created_at`.
2. `0001_slimy_songbird.sql`: evoluciona la tabla agregando `location`, `mac_address` y `last_ping` como columnas opcionales, sin afectar los registros existentes.

Para generar futuras migraciones después de cambiar `src/db/schema.ts`:

```bash
npm run generate
npm run migrate
```

## API REST

URL base: `http://localhost:3000/api/devices`

| Método | Ruta | Resultado esperado |
|---|---|---|
| `GET` | `/api/devices` | Lista todos los dispositivos (`200`) |
| `GET` | `/api/devices/:id` | Devuelve uno (`200`) o `404` |
| `POST` | `/api/devices` | Crea un dispositivo (`201`) o devuelve `400` |
| `PUT` | `/api/devices/:id` | Actualiza un dispositivo (`200`, `400` o `404`) |
| `DELETE` | `/api/devices/:id` | Elimina un dispositivo (`200`) o devuelve `404` |

Estados permitidos: `online`, `offline` y `maintenance`.

### Crear

```bash
curl -X POST http://localhost:3000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sensor de temperatura 01",
    "deviceType": "temperature_sensor",
    "ipAddress": "192.168.1.50",
    "status": "online",
    "location": "Laboratorio de redes",
    "macAddress": "AA:BB:CC:DD:EE:01",
    "lastPing": "2026-10-27T15:00:00.000Z"
  }'
```

### Listar y consultar

```bash
curl http://localhost:3000/api/devices
curl http://localhost:3000/api/devices/UUID_DEL_DISPOSITIVO
```

### Actualizar

```bash
curl -X PUT http://localhost:3000/api/devices/UUID_DEL_DISPOSITIVO \
  -H "Content-Type: application/json" \
  -d '{"status":"maintenance","location":"Taller técnico"}'
```

### Eliminar

```bash
curl -X DELETE http://localhost:3000/api/devices/UUID_DEL_DISPOSITIVO
```

## Validaciones

Zod valida payloads e identificadores. Se exige un nombre, tipo, IP válida y estado permitido. La dirección MAC debe usar el formato `AA:BB:CC:DD:EE:FF`; `location`, `macAddress` y `lastPing` son opcionales y aceptan `null`. Los payloads con propiedades desconocidas se rechazan con `400 Bad Request`.

## Verificación de persistencia

1. Crear un dispositivo mediante `POST /api/devices`.
2. Detener la API con `Ctrl+C`.
3. Iniciarla nuevamente con `npm run dev` o `npm start`.
4. Ejecutar `GET /api/devices` y verificar que el registro continúa almacenado en PostgreSQL.

Reiniciar la aplicación no elimina el volumen de PostgreSQL ni los datos guardados.

## Estructura principal

```text
drizzle/                  Migraciones SQL y metadatos
src/
  controllers/            Lógica HTTP del recurso devices
  db/                     Conexión y esquema Drizzle
  routes/                 Rutas Express
  schemas/                Validaciones Zod
  app.ts                  Configuración de Express
  server.ts               Inicio del servidor
```

