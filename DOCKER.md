# Ejecutar el proyecto con Docker (local)

Esta guía explica cómo levantar la aplicación en tu máquina usando Docker Compose.

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo**
- Credenciales de Supabase del proyecto (URL y claves)

---

## Paso 1 — Verificar que Docker Desktop está activo

Abre Docker Desktop y espera a que el ícono de la ballena en la barra de tareas quede **estático** (sin animación). Eso indica que el motor está listo.

Puedes confirmarlo en la terminal:

```bash
docker --version
```

Debe devolver algo como `Docker version 27.x.x`.

---

## Paso 2 — Configurar las variables de entorno

La aplicación necesita conectarse a Supabase. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# .env.local

# Variables públicas (frontend + backend)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Variables del servidor (backend)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

> **¿Dónde encuentro estos valores?**
> Entra a [supabase.com](https://supabase.com) → tu proyecto → **Project Settings** → **API**.
> Encontrarás la URL del proyecto y las claves `anon` y `service_role`.

---

## Paso 3 — Activar las variables en docker-compose.yml

Abre el archivo `docker-compose.yml` y descomenta las líneas de `env_file`:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:         # ← descomenta esta línea
      - .env.local    # ← y esta
```

---

## Paso 4 — Construir y levantar el contenedor

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up --build
```

La primera vez tarda unos minutos porque Docker descarga la imagen base de Node.js e instala todas las dependencias.

Cuando veas en la terminal:

```
▲ Next.js ready
- Local: http://localhost:3000
```

La aplicación está disponible en **http://localhost:3000**.

---

## Comandos útiles

| Comando | Descripción |
|---|---|
| `docker compose up --build` | Construye la imagen y levanta el contenedor |
| `docker compose up` | Levanta el contenedor sin reconstruir la imagen |
| `docker compose down` | Detiene y elimina el contenedor |
| `docker compose logs -f` | Ver los logs en tiempo real |

---

## Notas

- El archivo `.env.local` está en `.gitignore` y en `.dockerignore`, por lo que **nunca se sube a GitHub ni queda dentro de la imagen**.
- Si modificas el código fuente necesitas reconstruir la imagen con `docker compose up --build`.
- Este Docker es **solo para desarrollo local**. El despliegue en producción se hace automáticamente a través de Vercel.
