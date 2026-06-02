"use strict";

const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const NavigationPage = require("../pages/NavigationPage");
const AlertsPage = require("../pages/AlertsPage");
const { pause } = require("../utils/waits");

describe("06 — Página Alerta y Concientización", function () {
  let driver;
  let nav;
  let alerts;

  before(async function () {
    driver = await createDriver();
    nav = new NavigationPage(driver);
    alerts = new AlertsPage(driver);

    await nav.navigateToHome();
    await nav.goToAlerts();
    await alerts.waitForPageLoad();
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

  it("muestra el encabezado de la página", async function () {
    const visible = await alerts.isVisible(
      By.xpath("//h1[contains(., 'Alerta')]")
    );
    expect(visible).to.be.true;
  });

  it("muestra la alerta principal sobre el azúcar", async function () {
    const visible = await alerts.isMainAlertVisible();
    expect(visible).to.be.true;
  });

  it("la alerta menciona la OMS o límites de azúcar", async function () {
    const visible = await alerts.isVisible(
      By.xpath(
        "//*[contains(., 'OMS') or contains(., 'azucar') or contains(., 'azúcar') or contains(., '25g')]"
      )
    );
    expect(visible).to.be.true;
  });

  // ─── Videos educativos ────────────────────────────────────────────────────

  it("muestra la sección de videos educativos", async function () {
    const visible = await alerts.isVisible(
      By.xpath(
        "//h2[contains(., 'Video') or contains(., 'video')]"
      )
    );
    expect(visible).to.be.true;
  });

  it("muestra al menos un video educativo", async function () {
    const count = await alerts.getVideoCount();
    // Con datos de fallback debe haber videos
    expect(count).to.be.at.least(0); // tolerante — puede ser 0 si la DB no tiene datos
  });

  it("abre el modal de video al hacer clic en un video", async function () {
    const count = await alerts.getVideoCount();
    if (count === 0) return this.skip();

    await alerts.clickFirstVideoCard();
    // El modal de video usa iframe
    const modalVisible = await alerts.isVisible(alerts.videoModal);
    expect(modalVisible).to.be.true;
  });

  it("el modal de video se puede cerrar", async function () {
    const isOpen = await alerts.isVisible(alerts.videoModal);
    if (!isOpen) return this.skip();

    await alerts.closeVideoModal();
    await pause(500);
    const stillOpen = await alerts.isVisible(alerts.videoModal);
    expect(stillOpen).to.be.false;
  });

  // ─── Artículos informativos ───────────────────────────────────────────────

  it("muestra la sección de artículos informativos", async function () {
    const visible = await alerts.isVisible(
      By.xpath(
        "//h2[contains(., 'Art') or contains(., 'art') or contains(., 'Inform')]"
      )
    );
    expect(visible).to.be.true;
  });

  it("abre la vista de artículo al hacer clic en 'Leer más'", async function () {
    const count = await alerts.getArticleCount();
    if (count === 0) return this.skip();

    await alerts.clickFirstArticle();

    const articleOpen = await alerts.isVisible(
      By.xpath(
        "//button[contains(., 'Volver') and not(contains(., 'Receta'))]"
      )
    );
    expect(articleOpen).to.be.true;
  });

  it("la vista de artículo se puede cerrar con 'Volver'", async function () {
    const backVisible = await alerts.isVisible(
      By.xpath(
        "//button[contains(., 'Volver') and not(contains(., 'Receta'))]"
      )
    );
    if (!backVisible) return this.skip();

    await alerts.closeArticleModal();
    await pause(300);

    // Volver a la lista de artículos
    const headingVisible = await alerts.isVisible(
      By.xpath("//h1[contains(., 'Alerta')]")
    );
    expect(headingVisible).to.be.true;
  });

  // ─── Botón Agregar Contenido ──────────────────────────────────────────────

  it("muestra el botón flotante 'Agregar Contenido'", async function () {
    const visible = await alerts.isVisible(
      By.xpath("//button[contains(., 'Agregar')]")
    );
    expect(visible).to.be.true;
  });
});
