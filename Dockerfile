# Imagen base oficial de Node.js 22 (Alpine = imagen liviana)
FROM node:22-alpine

# Instalar pnpm (gestor de paquetes que usa este proyecto)
RUN npm install -g pnpm

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (aprovecha la caché de capas de Docker)
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --ignore-scripts

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Next.js
RUN pnpm build

# Puerto que expone el contenedor
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["pnpm", "start"]
