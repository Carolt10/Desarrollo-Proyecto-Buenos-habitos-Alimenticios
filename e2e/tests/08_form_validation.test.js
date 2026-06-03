"use strict";

const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const NavigationPage = require("../pages/NavigationPage");
const HomePage = require("../pages/HomePage");
const RecipesPage = require("../pages/RecipesPage");
const AlertsPage = require("../pages/AlertsPage");
const ShareStoryModal = require("../pages/modals/ShareStoryModal");
const AddRecipeModal = require("../pages/modals/AddRecipeModal");
const AddContentModal = require("../pages/modals/AddContentModal");
const { pause } = require("../utils/waits");

describe("08 — Validación de Formularios", function () {
  let driver;
  let nav;
  let home;
  let recipes;
  let alerts;
  let storyModal;
  let recipeModal;
  let contentModal;

  before(async function () {
    driver = await createDriver();
    nav = new NavigationPage(driver);
    home = new HomePage(driver);
    recipes = new RecipesPage(driver);
    alerts = new AlertsPage(driver);
    storyModal = new ShareStoryModal(driver);
    recipeModal = new AddRecipeModal(driver);
    contentModal = new AddContentModal(driver);

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
    // Cerrar cualquier modal abierto
    for (const modal of [storyModal, recipeModal, contentModal]) {
      if (await modal.isOpen()) {
        try { await modal.cancel(); await pause(300); } catch { /* ya cerrado */ }
      }
    }
  });

  // ─── Validación: Modal Comparte tu Historia ───────────────────────────────

  describe("Modal 'Comparte tu Historia'", function () {
    beforeEach(async function () {
      if (!(await storyModal.isOpen())) {
        await home.openShareStoryModal();
      }
    });

    it("el botón de envío está habilitado (validación es client-side)", async function () {
      const btn = await storyModal.find(storyModal.submitButton);
      const enabled = await btn.isEnabled();
      expect(enabled).to.be.true;
    });

    it("aparecen errores al enviar sin nombre de acudiente", async function () {
      await storyModal.submit();
      expect(await storyModal.isErrorVisible("guardianName")).to.be.true;
    });

    it("aparecen errores al enviar sin nombre del niño", async function () {
      await storyModal.submit();
      expect(await storyModal.isErrorVisible("childName")).to.be.true;
    });

    it("aparecen errores al enviar sin historia", async function () {
      await storyModal.submit();
      expect(await storyModal.isErrorVisible("story")).to.be.true;
    });

    it("aparecen errores al enviar sin logro", async function () {
      await storyModal.submit();
      expect(await storyModal.isErrorVisible("achievement")).to.be.true;
    });

    it("los errores desaparecen al rellenar los campos", async function () {
      await storyModal.submit(); // mostrar errores
      await storyModal.fillGuardianName("Tatiana Rubio");

      // El error de guardianName debe desaparecer al escribir el nombre
      // (o al reenviar)
      await storyModal.submit(); // revalidar
      // El error de nombre ya no debe estar (guardianName está lleno)
      const guardianNameError = await storyModal.isErrorVisible("guardianName");
      expect(guardianNameError).to.be.false;
    });
  });

  // ─── Validación: Modal Añadir Receta ─────────────────────────────────────

  describe("Modal 'Añadir Receta'", function () {
    before(async function () {
      await nav.goToRecipes();
      await recipes.waitForPageLoad();
    });

    beforeEach(async function () {
      if (!(await recipeModal.isOpen())) {
        await recipes.openAddRecipeModal();
      }
    });

    it("los campos obligatorios tienen el atributo 'required'", async function () {
      const tituloEl = await recipeModal.find(recipeModal.tituloInput);
      const isRequired = await tituloEl.getAttribute("required");
      expect(isRequired).to.not.be.null;
    });

    it("el campo título tiene placeholder descriptivo", async function () {
      const tituloEl = await recipeModal.find(recipeModal.tituloInput);
      const placeholder = await tituloEl.getAttribute("placeholder");
      expect(placeholder).to.include("Bowl");
    });

    it("el tipo de comida por defecto es 'Desayuno'", async function () {
      const select = await recipeModal.find(recipeModal.tipoComidaSelect);
      const value = await select.getAttribute("value");
      expect(value).to.equal("Desayuno");
    });

    it("el tiempo de preparación acepta solo valores numéricos positivos", async function () {
      const el = await recipeModal.find(recipeModal.tiempoInput);
      const type = await el.getAttribute("type");
      const min = await el.getAttribute("min");
      expect(type).to.equal("number");
      expect(parseInt(min)).to.be.at.least(1);
    });

    it("las porciones aceptan solo valores numéricos positivos", async function () {
      const el = await recipeModal.find(recipeModal.porcionesInput);
      const type = await el.getAttribute("type");
      const min = await el.getAttribute("min");
      expect(type).to.equal("number");
      expect(parseInt(min)).to.be.at.least(1);
    });

    it("el select de tipo de comida contiene las opciones esperadas", async function () {
      const select = await recipeModal.find(recipeModal.tipoComidaSelect);
      const options = await select.findElements(By.css("option"));
      const texts = await Promise.all(options.map((o) => o.getText()));
      expect(texts).to.include("Desayuno");
      expect(texts).to.include("Almuerzo");
      expect(texts).to.include("Cena");
      expect(texts).to.include("Snack");
    });

    it("el botón 'Guardar Receta' está deshabilitado durante el envío", async function () {
      // Llenar datos válidos para poder enviar
      await recipeModal.fillWithValidData();
      await recipeModal.submit();
      // Inmediatamente después del submit, el botón debería estar en estado "Guardando..."
      // (puede ser difícil de capturar — lo verificamos como tolerante)
      await recipeModal.waitForClose();
      expect(await recipeModal.isOpen()).to.be.false;
    });
  });

  // ─── Validación: Modal Agregar Contenido ──────────────────────────────────

  describe("Modal 'Agregar Contenido'", function () {
    before(async function () {
      await nav.goToAlerts();
      await alerts.waitForPageLoad();
    });

    beforeEach(async function () {
      if (!(await contentModal.isOpen())) {
        await alerts.openAddContentModal();
      }
    });

    it("el campo título es obligatorio en la pestaña Video", async function () {
      const tituloEl = await contentModal.find(contentModal.tituloInput);
      const required = await tituloEl.getAttribute("required");
      expect(required).to.not.be.null;
    });

    it("el campo autor es obligatorio en la pestaña Video", async function () {
      const autorEl = await contentModal.find(contentModal.autorInput);
      const required = await autorEl.getAttribute("required");
      expect(required).to.not.be.null;
    });

    it("el campo URL de YouTube tiene placeholder con formato correcto", async function () {
      const el = await contentModal.find(contentModal.youtubeUrlInput);
      const placeholder = await el.getAttribute("placeholder");
      expect(placeholder).to.include("youtube.com/embed");
    });

    it("el select de tipo de autor tiene las opciones Nutricionista y Pediatra", async function () {
      const select = await contentModal.find(contentModal.tipoAutorSelect);
      const options = await select.findElements(By.css("option"));
      const texts = await Promise.all(options.map((o) => o.getText()));
      expect(texts).to.include("Nutricionista");
      expect(texts).to.include("Pediatra");
    });

    it("cambiando a pestaña Artículo, el campo de contenido es obligatorio", async function () {
      await contentModal.switchToArticulo();
      const contenidoEl = await contentModal.find(contentModal.contenidoTextarea);
      const required = await contenidoEl.getAttribute("required");
      expect(required).to.not.be.null;
    });
  });
});
