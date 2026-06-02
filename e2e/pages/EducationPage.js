"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const { waitForVisible } = require("../utils/waits");

/**
 * EducationPage — Page Object para la página de Guías de Educación.
 *
 * Contenido estático:
 *  - Guía de lectura de etiquetas
 *  - Nombres del azúcar oculto
 *  - Sistema semáforo nutricional
 *  - Descarga de guías PDF
 *  - Consejos para el supermercado
 */
class EducationPage extends BasePage {
  // ─── Selectores ──────────────────────────────────────────────────────────

  get pageHeading() {
    return By.xpath("//h1[contains(., 'Educaci')]");
  }

  get downloadButtons() {
    return By.xpath(
      "//button[contains(., 'Descargar') or contains(., 'PDF')]"
    );
  }

  get sugarSectionHeading() {
    return By.xpath("//h2[contains(., 'Az') or contains(., 'Etiqueta')]");
  }

  get trafficLightSection() {
    return By.xpath(
      "//*[contains(., 'sem') or contains(., 'Sem') or contains(., 'nutricional')]"
    );
  }

  get supermarketTipsSection() {
    return By.xpath(
      "//h2[contains(., 'Supermercado') or contains(., 'Consejos')]"
    );
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async waitForPageLoad() {
    await waitForVisible(this.driver, this.pageHeading, this.timeout);
  }

  async getDownloadButtonCount() {
    const buttons = await this.driver.findElements(this.downloadButtons);
    return buttons.length;
  }

  async clickFirstDownloadButton() {
    const buttons = await this.findAll(this.downloadButtons);
    if (buttons.length === 0) throw new Error("No hay botones de descarga");
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'})",
      buttons[0]
    );
    await buttons[0].click();
  }

  async isSugarSectionVisible() {
    return this.isVisible(this.sugarSectionHeading);
  }

  async isSupermarketSectionVisible() {
    return this.isVisible(this.supermarketTipsSection);
  }
}

module.exports = EducationPage;
