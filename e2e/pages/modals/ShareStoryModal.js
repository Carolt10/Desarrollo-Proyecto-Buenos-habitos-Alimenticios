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
 * ShareStoryModal — Page Object del modal "Comparte tu Historia".
 *
 * Campos del formulario:
 *  - guardianName:  input[placeholder="Tu nombre completo"]
 *  - guardianRole:  select (madre/padre/abuelo/abuela/acudiente)
 *  - childName:     input[placeholder="Nombre del niño"]
 *  - categoriaId:   select (cargado desde API)
 *  - rating:        5 botones estrella
 *  - story:         textarea (placeholder larga)
 *  - achievement:   input[placeholder="Ej: Pérdida de 3kg..."]
 */
class ShareStoryModal extends BasePage {
  // ─── Selectores ──────────────────────────────────────────────────────────

  get modalRoot() {
    return By.xpath("//div[contains(@class,'fixed') and .//h2[contains(.,'Comparte')]]");
  }

  get heading() {
    return By.xpath("//h2[contains(., 'Comparte tu Historia')]");
  }

  get closeButton() {
    return By.xpath("//h2[contains(., 'Comparte tu Historia')]/..//button[.//*[contains(@class,'lucide-x') or contains(@class,'X')]]");
  }

  get guardianNameInput() {
    return By.css("input[placeholder='Tu nombre completo']");
  }

  get guardianRoleSelect() {
    return By.xpath(
      "//label[contains(text(),'Relación')]/..//select | //select[.//option[contains(.,'Madre')]]"
    );
  }

  get childNameInput() {
    return By.css("input[placeholder='Nombre del niño']");
  }

  get categoriaSelect() {
    return By.xpath(
      "//label[contains(text(),'Categor')]/..//select"
    );
  }

  get starButtons() {
    return By.xpath(
      "//label[contains(text(),'experiencia')]/..//button[@type='button']"
    );
  }

  get storyTextarea() {
    return By.xpath(
      "//textarea[contains(@placeholder,'experiencia')]"
    );
  }

  get achievementInput() {
    return By.css("input[placeholder*='Pérdida']");
  }

  get submitButton() {
    return By.xpath("//button[contains(.,'Compartir Historia')]");
  }

  get cancelButton() {
    return By.xpath("//button[contains(.,'Cancelar')]");
  }

  get successMessage() {
    return By.xpath("//h3[contains(.,'Gracias')]");
  }

  // ─── Error selectors ─────────────────────────────────────────────────────

  errorFor(field) {
    const messages = {
      guardianName: "El nombre del acudiente es requerido",
      childName: "El nombre del niño es requerido",
      story: "La historia es requerida",
      achievement: "El logro es requerido",
      categoria: "Debes seleccionar una categoría",
    };
    const msg = messages[field];
    return By.xpath(`//p[contains(.,'${msg}')]`);
  }

  // ─── Estado del modal ──────────────────────────────────────────────────────

  async isOpen() {
    return this.isVisible(this.heading);
  }

  async waitForOpen() {
    await waitForVisible(this.driver, this.heading, this.timeout);
  }

  async waitForClose() {
    await waitForHidden(this.driver, this.heading, this.timeout);
  }

  // ─── Acciones de formulario ───────────────────────────────────────────────

  async fillGuardianName(name) {
    const el = await this.find(this.guardianNameInput);
    await el.clear();
    await el.sendKeys(name);
  }

  async selectGuardianRole(role) {
    // role: 'madre' | 'padre' | 'abuelo' | 'abuela' | 'acudiente'
    const select = await this.find(this.guardianRoleSelect);
    await select.sendKeys(role);
  }

  async fillChildName(name) {
    const el = await this.find(this.childNameInput);
    await el.clear();
    await el.sendKeys(name);
  }

  async selectCategoria() {
    const select = await this.find(this.categoriaSelect);
    return selectFirstOption(this.driver, select);
  }

  async setRating(stars = 4) {
    // stars: 1–5
    const buttons = await this.findAll(this.starButtons);
    if (buttons.length >= stars) {
      await buttons[stars - 1].click();
    }
  }

  async fillStory(text) {
    const el = await this.find(this.storyTextarea);
    await el.clear();
    await el.sendKeys(text);
  }

  async fillAchievement(text) {
    const el = await this.find(this.achievementInput);
    await el.clear();
    await el.sendKeys(text);
  }

  async submit() {
    await this.click(this.submitButton);
  }

  async cancel() {
    await this.click(this.cancelButton);
  }

  async close() {
    await this.click(this.closeButton);
  }

  async waitForSuccess() {
    await waitForVisible(this.driver, this.successMessage, this.timeout);
  }

  async isErrorVisible(field) {
    return this.isVisible(this.errorFor(field));
  }

  /**
   * Rellena todos los campos con datos válidos de prueba.
   */
  async fillWithValidData(data = {}) {
    const defaults = {
      guardianName: "Tatiana Rubio",
      childName: "Valentina",
      story:
        "Desde que empezamos con los hábitos saludables, mi hija come mejor y tiene más energía.",
      achievement: "Come 3 frutas al día",
    };
    const d = { ...defaults, ...data };

    await this.fillGuardianName(d.guardianName);
    await this.fillChildName(d.childName);
    await this.selectCategoria();
    await this.setRating(4);
    await this.fillStory(d.story);
    await this.fillAchievement(d.achievement);
  }
}

module.exports = ShareStoryModal;
