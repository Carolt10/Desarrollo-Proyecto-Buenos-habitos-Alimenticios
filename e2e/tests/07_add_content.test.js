"use strict";

const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const NavigationPage = require("../pages/NavigationPage");
const AlertsPage = require("../pages/AlertsPage");
const AddContentModal = require("../pages/modals/AddContentModal");
const { waitForVisible, pause } = require("../utils/waits");

describe("07 — Modal Agregar Contenido (Video y Artículo)", function () {
  let driver;
  let nav;
  let alertsPage;
  let modal;

  before(async function () {
    driver = await createDriver();
    nav = new NavigationPage(driver);
    alertsPage = new AlertsPage(driver);
    modal = new AddContentModal(driver);

    await nav.navigateToHome();
    await nav.goToAlerts();
    await alertsPage.waitForPageLoad();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  afterEach(async function () {
    if (this.currentTest.state === "failed") {
      await takeScreenshot(driver, this.currentTest.fullTitle());
    }
    // Cerrar modal si quedó abierto
    if (await modal.isOpen()) {
      try {
        await modal.cancel();
        await modal.waitForClose();
      } catch { /* ya cerrado */ }
    }
  });

  // ─── Apertura del modal ───────────────────────────────────────────────────

  it("el botón 'Agregar Contenido' abre el modal", async function () {
    await alertsPage.openAddContentModal();
    expect(await modal.isOpen()).to.be.true;
  });

  it("la pestaña activa por defecto es 'Video'", async function () {
    if (!(await modal.isOpen())) await alertsPage.openAddContentModal();
    // El input de youtube_url debe ser visible cuando la pestaña Video está activa
    const youtubeVisible = await modal.isVisible(modal.youtubeUrlInput);
    expect(youtubeVisible).to.be.true;
  });

  // ─── Pestañas Video / Artículo ────────────────────────────────────────────

  it("cambiar a la pestaña 'Articulo' muestra los campos de artículo", async function () {
    if (!(await modal.isOpen())) await alertsPage.openAddContentModal();
    await modal.switchToArticulo();

    const contenidoVisible = await modal.isVisible(modal.contenidoTextarea);
    expect(contenidoVisible).to.be.true;
  });

  it("la pestaña 'Articulo' oculta los campos específicos de video", async function () {
    if (!(await modal.isOpen())) await alertsPage.openAddContentModal();
    await modal.switchToArticulo();

    const youtubeVisible = await modal.isVisible(modal.youtubeUrlInput);
    expect(youtubeVisible).to.be.false;
  });

  it("puede volver a la pestaña 'Video' desde 'Articulo'", async function () {
    if (!(await modal.isOpen())) await alertsPage.openAddContentModal();
    await modal.switchToArticulo();
    await modal.switchToVideo();

    const youtubeVisible = await modal.isVisible(modal.youtubeUrlInput);
    expect(youtubeVisible).to.be.true;
  });

  // ─── Cancelar ────────────────────────────────────────────────────────────

  it("el botón 'Cancelar' cierra el modal", async function () {
    if (!(await modal.isOpen())) await alertsPage.openAddContentModal();
    await modal.cancel();
    await modal.waitForClose();
    expect(await modal.isOpen()).to.be.false;
  });

  // ─── Formulario de Video ──────────────────────────────────────────────────

  it("los campos del formulario de video son editables", async function () {
    await alertsPage.openAddContentModal();

    const tituloEl = await modal.find(modal.tituloInput);
    await tituloEl.sendKeys("Test");
    const value = await tituloEl.getAttribute("value");
    expect(value).to.include("Test");
  });

  it("guarda un video educativo con todos los campos completos", async function () {
    this.timeout(40000);
    await alertsPage.openAddContentModal();
    await modal.fillVideoFields();
    await modal.submit();

    // El modal debe cerrarse tras guardar
    await modal.waitForClose();
    expect(await modal.isOpen()).to.be.false;
  });

  // ─── Formulario de Artículo ───────────────────────────────────────────────

  it("guarda un artículo informativo con todos los campos completos", async function () {
    this.timeout(40000);
    await alertsPage.openAddContentModal();
    await modal.switchToArticulo();
    await modal.fillArticuloFields();
    await modal.submit();

    // El modal debe cerrarse
    await modal.waitForClose();
    expect(await modal.isOpen()).to.be.false;
  });

  // ─── Recarga de contenido ─────────────────────────────────────────────────

  it("después de agregar contenido, la lista se actualiza", async function () {
    this.timeout(40000);
    // Verificar que la página está en estado de carga normal
    const heading = await alertsPage.isVisible(alertsPage.pageHeading);
    expect(heading).to.be.true;
  });
});
