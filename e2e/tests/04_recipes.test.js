"use strict";

const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const NavigationPage = require("../pages/NavigationPage");
const RecipesPage = require("../pages/RecipesPage");
const AddRecipeModal = require("../pages/modals/AddRecipeModal");

describe("04 — Página de Recetas Saludables", function () {
  let driver;
  let nav;
  let recipes;
  let addModal;

  before(async function () {
    driver = await createDriver();
    nav = new NavigationPage(driver);
    recipes = new RecipesPage(driver);
    addModal = new AddRecipeModal(driver);

    await nav.navigateToHome();
    await nav.goToRecipes();
    await recipes.waitForPageLoad();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  afterEach(async function () {
    if (this.currentTest.state === "failed") {
      await takeScreenshot(driver, this.currentTest.fullTitle());
    }
    // Cerrar modal si quedó abierto
    if (await addModal.isOpen()) {
      try {
        await addModal.cancel();
        await addModal.waitForClose();
      } catch { /* modal ya cerrado */ }
    }
  });

  // ─── Carga de la página ───────────────────────────────────────────────────

  it("muestra el encabezado de la página de Recetas", async function () {
    const hasH1 = await recipes.isVisible(
      By.xpath("//h1[contains(., 'Recetas')]")
    );
    expect(hasH1).to.be.true;
  });

  it("muestra el campo de búsqueda", async function () {
    const visible = await recipes.isVisible(recipes.searchInput);
    expect(visible).to.be.true;
  });

  it("muestra el botón 'Añadir Receta'", async function () {
    const visible = await recipes.isVisible(recipes.addRecipeButton);
    expect(visible).to.be.true;
  });

  it("muestra los botones de filtro por tipo de comida", async function () {
    const filters = ["Desayuno", "Almuerzo", "Cena", "Snack"];
    for (const f of filters) {
      const visible = await recipes.isVisible(recipes.filterButton(f));
      expect(visible, `Filtro "${f}" debe ser visible`).to.be.true;
    }
  });

  // ─── Búsqueda ─────────────────────────────────────────────────────────────

  it("permite escribir en el campo de búsqueda", async function () {
    await recipes.searchRecipes("batido");
    const value = await recipes.getValue(recipes.searchInput);
    expect(value).to.equal("batido");
    await recipes.clearSearch();
  });

  it("la búsqueda filtra las recetas visibles", async function () {
    // Con un término improbable deben mostrarse 0 resultados
    await recipes.searchRecipes("zzzzrecetainexistente");
    const count = await recipes.getRecipeCount();
    expect(count).to.equal(0);
    await recipes.clearSearch();
  });

  it("limpiar búsqueda restaura todas las recetas", async function () {
    await recipes.searchRecipes("batido");
    await recipes.clearSearch();
    // El campo debe estar vacío
    const value = await recipes.getValue(recipes.searchInput);
    expect(value).to.equal("");
  });

  // ─── Filtros ──────────────────────────────────────────────────────────────

  it("activar un filtro de tipo de comida lo marca como activo", async function () {
    await recipes.clickFilter("Desayuno");
    const isActive = await recipes.isFilterActive("Desayuno");
    expect(isActive).to.be.true;
  });

  it("aparece el botón 'Limpiar filtros' cuando hay un filtro activo", async function () {
    const visible = await recipes.isVisible(recipes.clearFiltersButton);
    expect(visible).to.be.true;
  });

  it("'Limpiar filtros' desactiva el filtro activo", async function () {
    await recipes.clearFilters();
    const isActive = await recipes.isFilterActive("Desayuno");
    expect(isActive).to.be.false;
  });

  it("hacer clic en un filtro activo lo desactiva (toggle)", async function () {
    await recipes.clickFilter("Almuerzo");
    expect(await recipes.isFilterActive("Almuerzo")).to.be.true;

    await recipes.clickFilter("Almuerzo");
    expect(await recipes.isFilterActive("Almuerzo")).to.be.false;
  });

  // ─── Vista detalle de receta ───────────────────────────────────────────────

  it("hacer clic en 'Ver receta' abre el detalle de la receta", async function () {
    const count = await recipes.getRecipeCount();
    if (count === 0) {
      this.skip(); // Saltar si no hay recetas en la DB
    }
    await recipes.clickFirstRecipe();
    const detailVisible = await recipes.isVisible(recipes.recipeDetailModal);
    expect(detailVisible).to.be.true;
  });

  it("el detalle de receta tiene botón 'Volver a Recetas'", async function () {
    const visible = await recipes.isVisible(recipes.backToRecipesButton);
    expect(visible).to.be.true;
  });

  it("'Volver a Recetas' cierra el detalle y regresa a la lista", async function () {
    await recipes.closeRecipeDetail();
    const h1 = await recipes.isVisible(
      By.xpath("//h1[contains(., 'Recetas')]")
    );
    expect(h1).to.be.true;
  });

  // ─── Modal Añadir Receta ──────────────────────────────────────────────────

  it("el botón 'Añadir Receta' abre el modal de creación", async function () {
    await recipes.openAddRecipeModal();
    expect(await addModal.isOpen()).to.be.true;
  });

  it("el modal de receta muestra todos los campos del formulario", async function () {
    if (!(await addModal.isOpen())) await recipes.openAddRecipeModal();

    const fields = [
      addModal.tituloInput,
      addModal.descripcionTextarea,
      addModal.tipoComidaSelect,
    ];
    for (const locator of fields) {
      const visible = await addModal.isVisible(locator);
      expect(visible, `Campo ${JSON.stringify(locator)} debe estar visible`).to.be.true;
    }
  });

  it("el botón 'Cancelar' cierra el modal sin guardar", async function () {
    if (!(await addModal.isOpen())) await recipes.openAddRecipeModal();
    await addModal.cancel();
    await addModal.waitForClose();
    expect(await addModal.isOpen()).to.be.false;
  });

  it("guarda una receta correctamente con todos los campos obligatorios", async function () {
    this.timeout(40000);
    await recipes.openAddRecipeModal();
    await addModal.fillWithValidData();
    await addModal.submit();

    // El modal debe cerrarse tras guardar exitosamente
    await addModal.waitForClose();
    expect(await addModal.isOpen()).to.be.false;
  });
});
