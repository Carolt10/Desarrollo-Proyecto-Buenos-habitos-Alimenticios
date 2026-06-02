"use strict";

const { By, until } = require("selenium-webdriver");
const env = require("../config/env");

const DEFAULT_TIMEOUT = env.TIMEOUT;

/**
 * Espera a que un elemento esté presente Y visible en el DOM.
 *
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {number} [timeout]
 * @returns {Promise<WebElement>}
 */
async function waitForVisible(driver, locator, timeout = DEFAULT_TIMEOUT) {
  await driver.wait(until.elementLocated(locator), timeout);
  const el = await driver.findElement(locator);
  await driver.wait(until.elementIsVisible(el), timeout);
  return el;
}

/**
 * Espera a que un elemento desaparezca del DOM o deje de ser visible.
 *
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {number} [timeout]
 */
async function waitForHidden(driver, locator, timeout = DEFAULT_TIMEOUT) {
  try {
    const el = await driver.findElement(locator);
    await driver.wait(until.elementIsNotVisible(el), timeout);
  } catch {
    // El elemento ya no existe en el DOM — está oculto
  }
}

/**
 * Espera a que aparezca texto en el body de la página.
 *
 * @param {WebDriver} driver
 * @param {string} text
 * @param {number} [timeout]
 */
async function waitForText(driver, text, timeout = DEFAULT_TIMEOUT) {
  await driver.wait(
    until.elementLocated(By.xpath(`//*[contains(., '${text}')]`)),
    timeout,
    `Texto "${text}" no apareció en ${timeout}ms`
  );
}

/**
 * Espera a que un <select> tenga más opciones que la por defecto ("Seleccionar...").
 *
 * @param {WebDriver} driver
 * @param {WebElement} selectElement
 * @param {number} [timeout]
 */
async function waitForSelectOptions(driver, selectElement, timeout = DEFAULT_TIMEOUT) {
  await driver.wait(async () => {
    const options = await selectElement.findElements(By.css("option"));
    return options.length > 1;
  }, timeout, "Las opciones del select no se cargaron");
}

/**
 * Selecciona la primera opción válida de un <select> (ignora el placeholder).
 *
 * @param {WebDriver} driver
 * @param {WebElement} selectElement
 * @returns {Promise<string>} Texto de la opción seleccionada
 */
async function selectFirstOption(driver, selectElement) {
  await waitForSelectOptions(driver, selectElement);
  const options = await selectElement.findElements(
    By.xpath('.//option[@value!=""]')
  );
  if (options.length === 0) throw new Error("No hay opciones disponibles en el select");
  await options[0].click();
  return options[0].getText();
}

/**
 * Hace scroll hasta que el elemento sea visible y luego lo devuelve.
 *
 * @param {WebDriver} driver
 * @param {By} locator
 * @returns {Promise<WebElement>}
 */
async function scrollAndFind(driver, locator) {
  const el = await waitForVisible(driver, locator);
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'})", el);
  return el;
}

/**
 * Espera que el spinner de carga desaparezca.
 *
 * @param {WebDriver} driver
 * @param {number} [timeout]
 */
async function waitForSpinnerGone(driver, timeout = DEFAULT_TIMEOUT) {
  try {
    await driver.wait(async () => {
      const spinners = await driver.findElements(
        By.css(".animate-spin")
      );
      return spinners.length === 0;
    }, timeout);
  } catch {
    // Si no hay spinner, continuar normalmente
  }
}

/**
 * Pausa de cortesía para animaciones CSS (150-300ms típicamente).
 * Usar solo cuando sea estrictamente necesario.
 *
 * @param {number} [ms=300]
 */
function pause(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  waitForVisible,
  waitForHidden,
  waitForText,
  waitForSelectOptions,
  selectFirstOption,
  scrollAndFind,
  waitForSpinnerGone,
  pause,
};
