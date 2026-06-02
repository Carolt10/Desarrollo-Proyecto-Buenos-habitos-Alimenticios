"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const { waitForVisible, waitForSpinnerGone } = require("../utils/waits");

/**
 * NavigationPage — interacciones con el Sidebar y el Header.
 *
 * El sidebar tiene 4 botones de navegación:
 *   Inicio | Alerta y Concienzación | Recetas Saludables | Guías de Educación
 *
 * La navegación es client-side (SPA); la URL no cambia.
 * Se verifica el cambio de página esperando el h1 de cada sección.
 */
class NavigationPage extends BasePage {
  // ─── Selectores del Sidebar ──────────────────────────────────────────────

  get sidebar() {
    return By.css("aside");
  }

  navButton(label) {
    return By.xpath(`//aside//button[contains(., '${label}')]`);
  }

  // ─── Selectores del Header ───────────────────────────────────────────────

  get header() {
    return By.css("header");
  }

  get menuToggleButton() {
    return By.xpath("//header//button");
  }

  get searchInput() {
    return By.css("header input[placeholder]");
  }

  // ─── Acciones de navegación ───────────────────────────────────────────────

  async goToHome() {
    await this.click(this.navButton("Inicio"));
    await waitForVisible(
      this.driver,
      By.xpath("//h1[contains(., 'Nutrici')]"),
      this.timeout
    );
  }

  async goToAlerts() {
    await this.click(this.navButton("Alerta"));
    await waitForVisible(
      this.driver,
      By.xpath("//h1[contains(., 'Alerta')]"),
      this.timeout
    );
  }

  async goToRecipes() {
    await this.click(this.navButton("Recetas"));
    await waitForVisible(
      this.driver,
      By.xpath("//h1[contains(., 'Recetas')]"),
      this.timeout
    );
    await waitForSpinnerGone(this.driver);
  }

  async goToEducation() {
    await this.click(this.navButton("Guías"));
    await waitForVisible(
      this.driver,
      By.xpath("//h1[contains(., 'Educaci')]"),
      this.timeout
    );
  }

  // ─── Verificaciones ───────────────────────────────────────────────────────

  async isSidebarVisible() {
    return this.isVisible(this.sidebar);
  }

  async isHeaderVisible() {
    return this.isVisible(this.header);
  }

  async getActiveNavLabel() {
    // El botón activo tiene clase bg-orange-600
    const active = await this.driver.findElement(
      By.xpath("//aside//button[contains(@class,'bg-orange-600')]")
    );
    return active.getText();
  }

  async isNavButtonActive(label) {
    const button = await this.driver.findElement(this.navButton(label));
    const classes = await button.getAttribute("class");
    return classes.includes("bg-orange-600");
  }
}

module.exports = NavigationPage;
