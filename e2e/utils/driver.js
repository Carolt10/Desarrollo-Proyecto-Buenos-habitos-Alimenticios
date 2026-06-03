"use strict";

const { Builder, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");
const env = require("../config/env");

/**
 * Crea y configura una instancia de WebDriver.
 * Usa Selenium Manager (incluido en selenium-webdriver >=4.6) para
 * descargar el driver del navegador automáticamente.
 *
 * @returns {Promise<WebDriver>}
 */
async function createDriver() {
  const { BROWSER, HEADLESS, WINDOW_WIDTH, WINDOW_HEIGHT } = env;

  switch (BROWSER) {
    case "chrome":
    case "chromium": {
      const options = new chrome.Options();
      options.addArguments(`--window-size=${WINDOW_WIDTH},${WINDOW_HEIGHT}`);
      options.addArguments("--no-sandbox");
      options.addArguments("--disable-dev-shm-usage");
      options.addArguments("--disable-gpu");
      options.addArguments("--lang=es-CO");
      if (HEADLESS) {
        options.addArguments("--headless=new");
      }
      return new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
    }

    case "firefox": {
      const options = new firefox.Options();
      if (HEADLESS) {
        options.addArguments("--headless");
      }
      options.addArguments(`--width=${WINDOW_WIDTH}`);
      options.addArguments(`--height=${WINDOW_HEIGHT}`);
      return new Builder()
        .forBrowser(Browser.FIREFOX)
        .setFirefoxOptions(options)
        .build();
    }

    case "edge": {
      const options = new edge.Options();
      if (HEADLESS) {
        options.addArguments("--headless=new");
      }
      options.addArguments(`--window-size=${WINDOW_WIDTH},${WINDOW_HEIGHT}`);
      return new Builder()
        .forBrowser(Browser.EDGE)
        .setEdgeOptions(options)
        .build();
    }

    default:
      throw new Error(
        `Navegador no soportado: "${BROWSER}". Usa: chrome, firefox, edge`
      );
  }
}

module.exports = { createDriver };
