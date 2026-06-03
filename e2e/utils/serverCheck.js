"use strict";

const http = require("http");
const https = require("https");
const env = require("../config/env");

/**
 * Verifica si el servidor está accesible en BASE_URL.
 * Reintenta hasta maxRetries veces con un delay entre intentos.
 *
 * @param {number} [maxRetries=5]
 * @param {number} [delayMs=2000]
 * @throws {Error} si el servidor no responde tras todos los intentos
 */
async function checkServerIsRunning(maxRetries = 5, delayMs = 2000) {
  const url = env.BASE_URL;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pingUrl(url);
      console.log(`  ✅ Servidor disponible en ${url}`);
      return;
    } catch {
      if (attempt < maxRetries) {
        console.log(
          `  ⏳ Intento ${attempt}/${maxRetries} — esperando servidor en ${url}...`
        );
        await sleep(delayMs);
      }
    }
  }

  throw new Error(
    `\n\n` +
    `  ❌  No se puede conectar al servidor en ${url}\n\n` +
    `  La aplicación debe estar corriendo ANTES de ejecutar los tests E2E.\n\n` +
    `  Solución rápida (dos terminales):\n` +
    `    Terminal 1:  cd ..  &&  pnpm dev\n` +
    `    Terminal 2:  npm test\n\n` +
    `  O usa el script todo-en-uno:\n` +
    `    npm run test:full\n`
  );
}

/**
 * Hace una petición HTTP/HTTPS GET y resuelve si el status es < 500.
 */
function pingUrl(rawUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const lib = parsed.protocol === "https:" ? https : http;

    const req = lib.get(
      { hostname: parsed.hostname, port: parsed.port || (parsed.protocol === "https:" ? 443 : 80), path: "/", timeout: 4000 },
      (res) => {
        res.resume(); // descartar el body
        if (res.statusCode < 500) resolve();
        else reject(new Error(`HTTP ${res.statusCode}`));
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = { checkServerIsRunning };
