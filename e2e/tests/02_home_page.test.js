"use strict";

const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const HomePage = require("../pages/HomePage");
const NavigationPage = require("../pages/NavigationPage");

describe("02 — Página de Inicio", function () {
  let driver;
  let home;
  let nav;

  before(async function () {
    driver = await createDriver();
    home = new HomePage(driver);
    nav = new NavigationPage(driver);
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

  // ─── Hero Section ─────────────────────────────────────────────────────────

  it("muestra el título principal de la aplicación", async function () {
    const title = await home.getHeroTitle();
    expect(title).to.not.be.empty;
    expect(title).to.include("Nutrici");
  });

  it("muestra los botones de llamada a la acción (CTA)", async function () {
    const ctaStart = await home.isVisible(home.ctaStartButton);
    const ctaVideos = await home.isVisible(home.ctaVideosButton);
    // Al menos uno de los CTAs debe estar visible
    expect(ctaStart || ctaVideos).to.be.true;
  });

  // ─── Sección de Testimonios ───────────────────────────────────────────────

  it("muestra la sección de testimonios", async function () {
    const visible = await home.isVisible(
      By.xpath("//section[.//button[contains(., 'Comparte')]] | //div[.//button[contains(., 'Comparte')]]")
    );
    expect(visible).to.be.true;
  });

  it("muestra al menos un testimonio de ejemplo", async function () {
    // Los testimonios de ejemplo siempre están en el estado inicial
    const visible = await home.isVisible(
      By.xpath("//*[contains(., 'María González') or contains(., 'Carlos López')]")
    );
    expect(visible).to.be.true;
  });

  it("el botón 'Comparte tu Historia' está visible", async function () {
    const visible = await home.isShareStoryButtonVisible();
    expect(visible).to.be.true;
  });

  // ─── Sección de estadísticas ──────────────────────────────────────────────

  it("muestra estadísticas de la plataforma", async function () {
    // La página muestra métricas como familias beneficiadas, etc.
    const hasStats = await home.isVisible(
      By.xpath("//*[contains(., 'Familias') or contains(., 'familias') or contains(., 'familia')]")
    );
    expect(hasStats).to.be.true;
  });

  // ─── Interacción con el modal ─────────────────────────────────────────────

  it("abre el modal al hacer clic en 'Comparte tu Historia'", async function () {
    await home.openShareStoryModal();

    const modalVisible = await home.isVisible(
      By.xpath("//h2[contains(., 'Comparte tu Historia')]")
    );
    expect(modalVisible).to.be.true;
  });

  it("el modal se puede cerrar con el botón X", async function () {
    // Cerrar el modal abierto en el test anterior
    const closeBtn = await home.find(
      By.xpath(
        "//div[contains(@class,'sticky')]//button[.//*[name()='svg']]"
      )
    );
    await closeBtn.click();

    const modalGone = !(await home.isVisible(
      By.xpath("//h2[contains(., 'Comparte tu Historia')]")
    ));
    expect(modalGone).to.be.true;
  });
});
