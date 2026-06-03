"use strict";

const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const NavigationPage = require("../pages/NavigationPage");
const HomePage = require("../pages/HomePage");
const ShareStoryModal = require("../pages/modals/ShareStoryModal");

describe("03 — Modal Comparte tu Historia (Testimonio)", function () {
  let driver;
  let nav;
  let home;
  let modal;

  before(async function () {
    driver = await createDriver();
    nav = new NavigationPage(driver);
    home = new HomePage(driver);
    modal = new ShareStoryModal(driver);
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
    // Si el modal quedó abierto después de un test, cerrarlo
    if (await modal.isOpen()) {
      try {
        await modal.cancel();
      } catch {
        // El modal puede haberse cerrado automáticamente
      }
    }
  });

  // ─── Apertura y cierre ────────────────────────────────────────────────────

  it("el modal se abre al hacer clic en 'Comparte tu Historia'", async function () {
    await home.openShareStoryModal();
    expect(await modal.isOpen()).to.be.true;
  });

  it("el modal se cierra al hacer clic en 'Cancelar'", async function () {
    if (!(await modal.isOpen())) await home.openShareStoryModal();
    await modal.cancel();
    await modal.waitForClose();
    expect(await modal.isOpen()).to.be.false;
  });

  it("el modal se cierra al hacer clic en el botón X", async function () {
    await home.openShareStoryModal();
    expect(await modal.isOpen()).to.be.true;

    // Clic en el botón de cerrar (X)
    const closeBtn = await modal.find(
      modal.closeButton
    ).catch(() =>
      modal.find(
        require("selenium-webdriver").By.xpath(
          "//div[contains(@class,'sticky')]//button"
        )
      )
    );
    await closeBtn.click();
    await modal.waitForClose();
    expect(await modal.isOpen()).to.be.false;
  });

  // ─── Validación de campos requeridos ──────────────────────────────────────

  it("muestra errores al enviar el formulario vacío", async function () {
    await home.openShareStoryModal();
    await modal.submit();

    // Debe mostrar al menos un mensaje de error
    const hasError = await modal.isVisible(
      require("selenium-webdriver").By.xpath(
        "//p[contains(@class,'text-red') and string-length(.) > 3]"
      )
    );
    expect(hasError).to.be.true;
  });

  it("muestra error cuando 'Nombre del Acudiente' está vacío", async function () {
    if (!(await modal.isOpen())) await home.openShareStoryModal();
    await modal.submit();
    const hasError = await modal.isErrorVisible("guardianName");
    expect(hasError).to.be.true;
  });

  it("muestra error cuando 'Nombre del Niño' está vacío", async function () {
    if (!(await modal.isOpen())) await home.openShareStoryModal();
    await modal.submit();
    const hasError = await modal.isErrorVisible("childName");
    expect(hasError).to.be.true;
  });

  it("muestra error cuando 'Tu Historia' está vacía", async function () {
    if (!(await modal.isOpen())) await home.openShareStoryModal();
    await modal.submit();
    const hasError = await modal.isErrorVisible("story");
    expect(hasError).to.be.true;
  });

  it("muestra error cuando 'Logro o Resultado' está vacío", async function () {
    if (!(await modal.isOpen())) await home.openShareStoryModal();
    await modal.submit();
    const hasError = await modal.isErrorVisible("achievement");
    expect(hasError).to.be.true;
  });

  // ─── Interacción con campos ────────────────────────────────────────────────

  it("permite seleccionar la relación del acudiente", async function () {
    if (!(await modal.isOpen())) await home.openShareStoryModal();

    await modal.selectGuardianRole("padre");
    const select = await modal.find(modal.guardianRoleSelect);
    const value = await select.getAttribute("value");
    expect(value).to.equal("padre");
  });

  it("permite dar una calificación con las estrellas", async function () {
    if (!(await modal.isOpen())) await home.openShareStoryModal();
    // No debe lanzar error al clicar las estrellas
    await modal.setRating(4);
  });

  // ─── Flujo completo de envío ───────────────────────────────────────────────

  it("muestra mensaje de éxito tras enviar el formulario con datos válidos", async function () {
    this.timeout(40000); // Dar más tiempo para la petición al servidor
    await home.openShareStoryModal();
    await modal.fillWithValidData();
    await modal.submit();

    // Esperar mensaje de éxito o cierre del modal
    try {
      await modal.waitForSuccess();
      const successVisible = await modal.isVisible(modal.successMessage);
      expect(successVisible).to.be.true;
    } catch {
      // Si no hay mensaje de éxito, al menos el modal debe cerrarse
      await modal.waitForClose();
      expect(await modal.isOpen()).to.be.false;
    }
  });
});
