"use strict";

const { By, until, Key } = require("selenium-webdriver");
const {
  waitForVisible,
  waitForText,
  waitForSpinnerGone,
  selectFirstOption,
  pause,
} = require("../utils/waits");
const env = require("../config/env");

/**
 * BasePage — clase base para todos los Page Objects.
 * Provee métodos comunes de interacción con el DOM.
 */
class BasePage {
  /**
   * @param {import('selenium-webdriver').WebDriver} driver
   */
  constructor(driver) {
    this.driver = driver;
    this.timeout = env.TIMEOUT;
    this.baseUrl = env.BASE_URL;
  }

  // ─── Navegación ──────────────────────────────────────────────────────────

  async navigateToHome() {
    await this.driver.get(this.baseUrl);
    await waitForSpinnerGone(this.driver);
  }

  async getPageTitle() {
    return this.driver.getTitle();
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }

  // ─── Búsqueda de elementos ────────────────────────────────────────────────

  /** Espera y retorna un elemento por su locator */
  async find(locator) {
    return waitForVisible(this.driver, locator, this.timeout);
  }

  /** Retorna todos los elementos que coincidan con el locator */
  async findAll(locator) {
    await this.driver.wait(until.elementLocated(locator), this.timeout);
    return this.driver.findElements(locator);
  }

  /** Verifica si un elemento está presente y visible */
  async isVisible(locator) {
    try {
      const els = await this.driver.findElements(locator);
      if (els.length === 0) return false;
      return els[0].isDisplayed();
    } catch {
      return false;
    }
  }

  // ─── Interacciones ────────────────────────────────────────────────────────

  /** Click en un elemento */
  async click(locator) {
    const el = await this.find(locator);
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'})",
      el
    );
    await pause(100);
    await el.click();
  }

  /** Click en un botón buscándolo por texto visible */
  async clickButton(text) {
    const locator = By.xpath(
      `//button[normalize-space(.)='${text}' or contains(normalize-space(.), '${text}')]`
    );
    await this.click(locator);
  }

  /** Escribe texto en un input encontrado por placeholder */
  async typeByPlaceholder(placeholder, text) {
    const locator = By.css(`input[placeholder="${placeholder}"], textarea[placeholder="${placeholder}"]`);
    const el = await this.find(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  /** Escribe texto en una textarea encontrada por placeholder */
  async typeInTextarea(placeholder, text) {
    const locator = By.xpath(
      `//textarea[@placeholder="${placeholder}"]`
    );
    const el = await this.find(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  /** Escribe en un input usando su label como selector de contexto */
  async typeByLabel(labelText, text) {
    const locator = By.xpath(
      `//label[contains(text(),'${labelText}')]/following-sibling::input | //label[contains(text(),'${labelText}')]/..//input`
    );
    const el = await this.find(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  /**
   * Selecciona la primera opción válida en un <select> cercano a una etiqueta
   * @param {string} labelText  Texto del <label> asociado
   */
  async selectFirstOptionByLabel(labelText) {
    const locator = By.xpath(
      `//label[contains(text(),'${labelText}')]/..//select | //label[contains(text(),'${labelText}')]/following-sibling::select`
    );
    const selectEl = await this.find(locator);
    return selectFirstOption(this.driver, selectEl);
  }

  /** Limpia y escribe en un input de tipo number */
  async setNumberInput(locator, value) {
    const el = await this.find(locator);
    await el.clear();
    await el.sendKeys(String(value));
  }

  /** Obtiene el texto visible de un elemento */
  async getText(locator) {
    const el = await this.find(locator);
    return el.getText();
  }

  /** Obtiene el valor (value) de un input */
  async getValue(locator) {
    const el = await this.find(locator);
    return el.getAttribute("value");
  }

  // ─── Esperas ──────────────────────────────────────────────────────────────

  /** Espera a que aparezca texto en algún lugar de la página */
  async waitForText(text) {
    return waitForText(this.driver, text, this.timeout);
  }

  /** Espera que desaparezca el spinner de carga */
  async waitForLoadComplete() {
    return waitForSpinnerGone(this.driver, this.timeout);
  }

  // ─── Headings ─────────────────────────────────────────────────────────────

  /** Verifica que el h1 de la página coincida con el texto esperado */
  async getH1Text() {
    return this.getText(By.css("h1"));
  }

  /** Verifica que existe un h1 conteniendo el texto dado */
  async hasH1Containing(text) {
    return this.isVisible(
      By.xpath(`//h1[contains(text(),'${text}')]`)
    );
  }
}

module.exports = BasePage;
