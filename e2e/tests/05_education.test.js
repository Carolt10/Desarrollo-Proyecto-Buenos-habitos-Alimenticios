"use strict";

const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const NavigationPage = require("../pages/NavigationPage");
const EducationPage = require("../pages/EducationPage");

describe("05 — Página Guías de Educación", function () {
  let driver;
  let nav;
  let education;

  before(async function () {
    driver = await createDriver();
    nav = new NavigationPage(driver);
    education = new EducationPage(driver);

    await nav.navigateToHome();
    await nav.goToEducation();
    await education.waitForPageLoad();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  afterEach(async function () {
    if (this.currentTest.state === "failed") {
      await takeScreenshot(driver, this.currentTest.fullTitle());
    }
  });

  // ─── Estructura general ───────────────────────────────────────────────────

  it("muestra el encabezado 'Educación'", async function () {
    const visible = await education.isVisible(
      By.xpath("//h1[contains(., 'Educaci')]")
    );
    expect(visible).to.be.true;
  });

  it("muestra contenido de lectura de etiquetas o azúcares", async function () {
    const visible = await education.isVisible(
      By.xpath(
        "//*[contains(.,'Az') or contains(.,'etiqueta') or contains(.,'Etiqueta')]"
      )
    );
    expect(visible).to.be.true;
  });

  it("muestra la sección del sistema semáforo nutricional", async function () {
    const visible = await education.isVisible(
      By.xpath(
        "//*[contains(.,'em') or contains(.,'nutricional') or contains(.,'Sem')]"
      )
    );
    expect(visible).to.be.true;
  });

  it("muestra la sección de consejos para supermercado", async function () {
    const visible = await education.isSupermarketSectionVisible();
    expect(visible).to.be.true;
  });

  // ─── Botones de descarga ──────────────────────────────────────────────────

  it("muestra botones para descargar guías PDF", async function () {
    const count = await education.getDownloadButtonCount();
    expect(count).to.be.greaterThan(0);
  });

  it("los botones de descarga son clicables", async function () {
    const count = await education.getDownloadButtonCount();
    if (count === 0) this.skip();

    // Verificar que el primer botón no está deshabilitado
    const buttons = await education.findAll(education.downloadButtons);
    const isEnabled = await buttons[0].isEnabled();
    expect(isEnabled).to.be.true;
  });
});
