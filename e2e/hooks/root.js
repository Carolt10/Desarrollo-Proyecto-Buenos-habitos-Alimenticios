"use strict";

const { checkServerIsRunning } = require("../utils/serverCheck");

/**
 * Root hooks de Mocha — se ejecutan UNA SOLA VEZ antes/después de toda la suite.
 * Cargado mediante: --require hooks/root.js  (en .mocharc.cjs)
 */
exports.mochaHooks = {
  /**
   * Antes de cualquier test: verificar que el servidor está corriendo.
   * Si no responde, lanza un error descriptivo en lugar de un WebDriverError críptico.
   */
  async beforeAll() {
    await checkServerIsRunning();
  },
};
