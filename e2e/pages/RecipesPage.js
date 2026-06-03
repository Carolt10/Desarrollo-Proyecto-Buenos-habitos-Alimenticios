"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const { waitForVisible, waitForSpinnerGone, pause } = require("../utils/waits");

/**
 * RecipesPage — Page Object para la página de Recetas Saludables.
 *
 * Funcionalidades:
 *  - Búsqueda de recetas por texto
 *  - Filtros por tipo de comida (Desayuno, Almuerzo, Cena, Snack, <15 min)
 *  - Modal "Añadir Receta" con formulario completo
 *  - Vista detalle de receta
 */
class RecipesPage extends BasePage {
  // ─── Selectores ──────────────────────────────────────────────────────────

  get pageHeading() {
    return By.xpath("//h1[contains(., 'Recetas')]");
  }

  get searchInput() {
    return By.css("input[placeholder='Buscar recetas...']");
  }

  get addRecipeButton() {
    return By.xpath("//button[contains(., 'Anadir Receta') or contains(., 'Añadir Receta')]");
  }

  filterButton(label) {
    return By.xpath(
      `//button[normalize-space(.)='${label}' and contains(@class,'rounded-full')]`
    );
  }

  get clearFiltersButton() {
    return By.xpath("//button[contains(., 'Limpiar filtros')]");
  }

  get recipeCards() {
    // Cards de receta tienen h3 con el título y los datos de tiempo/porciones
    return By.xpath("//div[.//h3 and .//button[contains(.,'Ver receta')]]");
  }

  get viewRecipeButtons() {
    return By.xpath("//button[contains(., 'Ver receta')]");
  }

  get recipeDetailModal() {
    return By.xpath("//button[contains(., 'Volver a Recetas')]");
  }

  get backToRecipesButton() {
    return By.xpath("//button[contains(., 'Volver a Recetas')]");
  }

  get featuredRecipeCard() {
    return By.xpath("//div[contains(@class,'border-l-4') and contains(@class,'border-orange-')]");
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async waitForPageLoad() {
    await waitForVisible(this.driver, this.pageHeading, this.timeout);
    await waitForSpinnerGone(this.driver);
  }

  async searchRecipes(query) {
    const input = await this.find(this.searchInput);
    await input.clear();
    await input.sendKeys(query);
    await pause(500); // esperar debounce del filtro
  }

  async clearSearch() {
    const input = await this.find(this.searchInput);
    await input.clear();
    await pause(300);
  }

  async clickFilter(label) {
    await this.click(this.filterButton(label));
    await pause(500);
  }

  async clearFilters() {
    if (await this.isVisible(this.clearFiltersButton)) {
      await this.click(this.clearFiltersButton);
      await pause(300);
    }
  }

  async isFilterActive(label) {
    const btn = await this.driver.findElement(this.filterButton(label));
    const classes = await btn.getAttribute("class");
    return classes.includes("bg-orange-600");
  }

  async getRecipeCount() {
    const cards = await this.driver.findElements(this.recipeCards);
    return cards.length;
  }

  async clickFirstRecipe() {
    const buttons = await this.findAll(this.viewRecipeButtons);
    if (buttons.length === 0) throw new Error("No hay recetas visibles");
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'})",
      buttons[0]
    );
    await buttons[0].click();
    await waitForVisible(this.driver, this.recipeDetailModal, this.timeout);
  }

  async closeRecipeDetail() {
    await this.click(this.backToRecipesButton);
    await waitForVisible(this.driver, this.addRecipeButton, this.timeout);
  }

  async openAddRecipeModal() {
    await this.click(this.addRecipeButton);
    await waitForVisible(
      this.driver,
      By.xpath("//h3[contains(., 'Anadir Nueva Receta') or contains(., 'Añadir Nueva Receta')]"),
      this.timeout
    );
  }
}

module.exports = RecipesPage;
