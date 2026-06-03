"use strict";

const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const NavigationPage = require("../pages/NavigationPage");
const HomePage = require("../pages/HomePage");

describe("01 — Navegación entre páginas (Sidebar)", function () {
  let driver;
  let nav;
  let home;

  before(async function () {
    driver = await createDriver();
    nav = new NavigationPage(driver);
    home = new HomePage(driver);
    await nav.navigateToHome();
    await home.waitForPageLoad();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  afterEach(async function () {
    if (this.currentTest.state === "failed") {
      await takeScreenshot(driver, this.currentTest.fullTitle());
    }
  });

  // ─── Tests de carga inicial ──────────────────────────────────────────────

  it("carga la aplicación y muestra la página de Inicio por defecto", async function () {
    const visible = await nav.isSidebarVisible();
    expect(visible).to.be.true;

    const h1 = await home.getHeroTitle();
    expect(h1).to.include("Nutrici");
  });

  it("el sidebar está siempre visible", async function () {
    expect(await nav.isSidebarVisible()).to.be.true;
  });

  it("el header está siempre visible", async function () {
    expect(await nav.isHeaderVisible()).to.be.true;
  });

  // ─── Tests de navegación ─────────────────────────────────────────────────

  it("navega a Recetas Saludables desde el sidebar", async function () {
    await nav.goToRecipes();
    const hasH1 = await home.hasH1Containing("Recetas");
    expect(hasH1).to.be.true;
  });

  it("el botón de Recetas queda activo tras la navegación", async function () {
    expect(await nav.isNavButtonActive("Recetas")).to.be.true;
  });

  it("navega a Alerta y Concientización desde el sidebar", async function () {
    await nav.goToAlerts();
    const hasH1 = await home.hasH1Containing("Alerta");
    expect(hasH1).to.be.true;
  });

  it("el botón de Alertas queda activo tras la navegación", async function () {
    expect(await nav.isNavButtonActive("Alerta")).to.be.true;
  });

  it("navega a Guías de Educación desde el sidebar", async function () {
    await nav.goToEducation();
    const hasH1 = await home.hasH1Containing("Educaci");
    expect(hasH1).to.be.true;
  });

  it("el botón de Educación queda activo tras la navegación", async function () {
    expect(await nav.isNavButtonActive("Guías")).to.be.true;
  });

  it("regresa a Inicio desde el sidebar", async function () {
    await nav.goToHome();
    const h1 = await home.getHeroTitle();
    expect(h1).to.include("Nutrici");
  });

  it("el botón de Inicio queda activo tras volver al home", async function () {
    expect(await nav.isNavButtonActive("Inicio")).to.be.true;
  });

  // ─── Tests de navegación cíclica ─────────────────────────────────────────

  it("puede navegar: Inicio → Recetas → Alertas → Educación → Inicio", async function () {
    await nav.goToHome();
    await nav.goToRecipes();
    await nav.goToAlerts();
    await nav.goToEducation();
    await nav.goToHome();

    const h1 = await home.getHeroTitle();
    expect(h1).to.include("Nutrici");
  });

  it("la URL permanece igual durante toda la navegación (SPA)", async function () {
    const baseUrl = require("../config/env").BASE_URL;
    const currentUrl = await nav.getCurrentUrl();
    expect(currentUrl).to.equal(`${baseUrl}/`);
  });
});
