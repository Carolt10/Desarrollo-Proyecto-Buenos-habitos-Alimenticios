"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("../BasePage");
const {
  waitForVisible,
  waitForHidden,
  selectFirstOption,
  pause,
} = require("../../utils/waits");

/**
 * AddRecipeModal — Page Object del modal "Añadir Nueva Receta".
 *
 * Campos:
 *  - titulo:              input[placeholder="Ej: Bowl de Smoothie Tropical"]
 *  - descripcion:         textarea[placeholder="Breve descripcion..."]
 *  - tiempo_preparacion:  input[type="number"][min="1"] (primero)
 *  - porciones:           input[type="number"][min="1"] (segundo)
 *  - tipo_comida:         select (Desayuno/Almuerzo/Cena/Snack)
 *  - categoria_id:        select (opciones desde API)
 *  - imagen_url:          input[placeholder="https://..."]
 *  - ingredientes:        textarea[placeholder="Lista..."]
 *  - instrucciones:       textarea[placeholder="Pasos..."]
 */
class AddRecipeModal extends BasePage {
  // ─── Selectores ──────────────────────────────────────────────────────────

  get heading() {
    return By.xpath(
      "//h3[contains(., 'Anadir Nueva Receta') or contains(., 'Añadir Nueva Receta')]"
    );
  }

  get closeButton() {
    return By.xpath(
      "//h3[contains(., 'Receta')]/..//button[.//*[contains(@class,'lucide-x') or name()='svg']]"
    );
  }

  get tituloInput() {
    return By.css("input[placeholder='Ej: Bowl de Smoothie Tropical']");
  }

  get descripcionTextarea() {
    return By.css("textarea[placeholder='Breve descripcion de la receta...']");
  }

  get tiempoInput() {
    // Primer input type="number" del modal
    return By.xpath(
      "(//div[contains(@class,'fixed')]//input[@type='number'])[1]"
    );
  }

  get porcionesInput() {
    // Segundo input type="number" del modal
    return By.xpath(
      "(//div[contains(@class,'fixed')]//input[@type='number'])[2]"
    );
  }

  get tipoComidaSelect() {
    return By.xpath(
      "//label[contains(text(),'Tipo de Comida')]/..//select"
    );
  }

  get categoriaSelect() {
    return By.xpath(
      "//label[contains(text(),'Categoria')]/..//select | //label[contains(text(),'Categoría')]/..//select"
    );
  }

  get imagenUrlInput() {
    return By.css("input[placeholder='https://ejemplo.com/imagen.jpg']");
  }

  get ingredientesTextarea() {
    return By.css("textarea[placeholder*='ingredientes']");
  }

  get instruccionesTextarea() {
    return By.css("textarea[placeholder*='Pasos']");
  }

  get submitButton() {
    return By.xpath(
      "//button[contains(., 'Guardar Receta')]"
    );
  }

  get cancelButton() {
    return By.xpath(
      "//div[contains(@class,'fixed')]//button[normalize-space(.)='Cancelar']"
    );
  }

  get savingSpinner() {
    return By.xpath("//button[contains(., 'Guardando')]");
  }

  // ─── Estado del modal ─────────────────────────────────────────────────────

  async isOpen() {
    return this.isVisible(this.heading);
  }

  async waitForOpen() {
    await waitForVisible(this.driver, this.heading, this.timeout);
  }

  async waitForClose() {
    await waitForHidden(this.driver, this.heading, this.timeout);
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async fillTitulo(text) {
    const el = await this.find(this.tituloInput);
    await el.clear();
    await el.sendKeys(text);
  }

  async fillDescripcion(text) {
    const el = await this.find(this.descripcionTextarea);
    await el.clear();
    await el.sendKeys(text);
  }

  async setTiempo(minutes) {
    const el = await this.find(this.tiempoInput);
    await this.driver.executeScript("arguments[0].value = ''", el);
    await el.sendKeys(String(minutes));
  }

  async setPorciones(count) {
    const el = await this.find(this.porcionesInput);
    await this.driver.executeScript("arguments[0].value = ''", el);
    await el.sendKeys(String(count));
  }

  async selectTipoComida(tipo) {
    // tipo: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack'
    const select = await this.find(this.tipoComidaSelect);
    await select.sendKeys(tipo);
  }

  async selectCategoria() {
    const select = await this.find(this.categoriaSelect);
    return selectFirstOption(this.driver, select);
  }

  async fillIngredientes(text) {
    const el = await this.find(this.ingredientesTextarea);
    await el.clear();
    await el.sendKeys(text);
  }

  async fillInstrucciones(text) {
    const el = await this.find(this.instruccionesTextarea);
    await el.clear();
    await el.sendKeys(text);
  }

  async submit() {
    await this.click(this.submitButton);
  }

  async cancel() {
    await this.click(this.cancelButton);
  }

  async waitForSubmitComplete() {
    // Espera a que el botón de "Guardando..." desaparezca
    await waitForHidden(this.driver, this.savingSpinner, this.timeout);
  }

  /**
   * Rellena todos los campos obligatorios con datos de prueba.
   */
  async fillWithValidData(data = {}) {
    const defaults = {
      titulo: "Batido Verde de Espinaca",
      descripcion: "Batido nutritivo ideal para el desayuno infantil",
      tiempo: 10,
      porciones: 2,
      tipo: "Desayuno",
    };
    const d = { ...defaults, ...data };

    await this.fillTitulo(d.titulo);
    await this.fillDescripcion(d.descripcion);
    await this.setTiempo(d.tiempo);
    await this.setPorciones(d.porciones);
    await this.selectTipoComida(d.tipo);
    await this.selectCategoria();
    await this.fillIngredientes("2 tazas espinaca, 1 banano, 1 taza leche");
    await this.fillInstrucciones("1. Lavar espinaca. 2. Mezclar todo. 3. Servir frío.");
  }
}

module.exports = AddRecipeModal;
