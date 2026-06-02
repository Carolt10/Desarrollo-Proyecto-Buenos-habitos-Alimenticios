"use strict";

const fs = require("fs");
const path = require("path");
const env = require("../config/env");

/**
 * Toma un screenshot y lo guarda en disco.
 * Se llama automáticamente en el hook afterEach cuando una prueba falla.
 *
 * @param {WebDriver} driver
 * @param {string} testName  Nombre del test (se sanitiza para el nombre de archivo)
 * @returns {Promise<string>} Ruta absoluta del archivo guardado
 */
async function takeScreenshot(driver, testName) {
  const dir = path.resolve(env.SCREENSHOT_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, -5);

  const safeName = testName
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80);

  const filename = `FAIL_${safeName}_${timestamp}.png`;
  const filepath = path.join(dir, filename);

  try {
    const data = await driver.takeScreenshot();
    fs.writeFileSync(filepath, data, "base64");
    console.log(`\n  📸 Screenshot guardado: ${filepath}`);
    return filepath;
  } catch (err) {
    console.error(`  ❌ No se pudo guardar el screenshot: ${err.message}`);
    return null;
  }
}

module.exports = { takeScreenshot };
