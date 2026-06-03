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
 * AddContentModal — Page Object del modal "Agregar Contenido" en la página Alerts.
 *
 * Tiene dos pestañas (contentType):
 *   - Video: titulo, descripcion, autor, tipo_autor, duracion, youtube_url, categoria_id
 *   - Articulo: titulo, descripcion, contenido, tiempo_lectura, categoria_id
 */
class AddContentModal extends BasePage {
  // ─── Selectores del modal ─────────────────────────────────────────────────

  get heading() {
    return By.xpath(
      "//h3[contains(., 'Agregar') or contains(., 'Contenido') or contains(., 'Nuevo')]"
    );
  }

  get videoTabButton() {
    return By.xpath(
      "//button[normalize-space(.)='Video' or contains(normalize-space(.),'Video')]" +
      "[not(contains(.,'Agregar')) and not(contains(.,'Contenido'))]"
    );
  }

  get articuloTabButton() {
    return By.xpath(
      "//button[contains(normalize-space(.),'Articulo') or contains(normalize-space(.),'Artículo')]" +
      "[not(contains(.,'Agregar')) and not(contains(.,'Contenido'))]"
    );
  }

  // ─── Campos comunes ───────────────────────────────────────────────────────

  get tituloInput() {
    return By.css("input[placeholder='Titulo del contenido']");
  }

  get descripcionTextarea() {
    return By.css("textarea[placeholder='Breve descripcion del contenido']");
  }

  get categoriaSelect() {
    return By.xpath(
      "(//div[contains(@class,'fixed')]//select)[last()]"
    );
  }

  // ─── Campos de Video ─────────────────────────────────────────────────────

  get autorInput() {
    return By.css("input[placeholder='Nombre del autor']");
  }

  get tipoAutorSelect() {
    return By.xpath(
      "//label[contains(text(),'Tipo de Autor')]/..//select"
    );
  }

  get duracionInput() {
    return By.css("input[placeholder='Ej: 10:45']");
  }

  get youtubeUrlInput() {
    return By.css("input[placeholder*='youtube.com/embed']");
  }

  // ─── Campos de Artículo ───────────────────────────────────────────────────

  get contenidoTextarea() {
    return By.css("textarea[placeholder*='contenido completo']");
  }

  get tiempoLecturaInput() {
    return By.css("input[placeholder*='min lectura']");
  }

  // ─── Botones de acción ────────────────────────────────────────────────────

  get submitButton() {
    return By.xpath(
      "//div[contains(@class,'fixed')]//button[contains(., 'Guardar')]"
    );
  }

  get cancelButton() {
    return By.xpath(
      "//div[contains(@class,'fixed')]//button[normalize-space(.)='Cancelar']"
    );
  }

  // ─── Estado ──────────────────────────────────────────────────────────────

  async isOpen() {
    return this.isVisible(this.heading);
  }

  async waitForOpen() {
    await waitForVisible(this.driver, this.heading, this.timeout);
  }

  async waitForClose() {
    await waitForHidden(this.driver, this.heading, this.timeout);
  }

  // ─── Cambio de pestaña ────────────────────────────────────────────────────

  async switchToVideo() {
    await this.click(this.videoTabButton);
    await pause(200);
  }

  async switchToArticulo() {
    await this.click(this.articuloTabButton);
    await pause(200);
    await waitForVisible(this.driver, this.contenidoTextarea, this.timeout);
  }

  async isVideoTabActive() {
    const btn = await this.driver.findElement(this.videoTabButton);
    const classes = await btn.getAttribute("class");
    return classes.includes("border-orange-600");
  }

  async isArticuloTabActive() {
    const btn = await this.driver.findElement(this.articuloTabButton);
    const classes = await btn.getAttribute("class");
    return classes.includes("border-orange-600");
  }

  // ─── Relleno de formulario (Video) ────────────────────────────────────────

  async fillCommonFields(titulo, descripcion) {
    const tituloEl = await this.find(this.tituloInput);
    await tituloEl.clear();
    await tituloEl.sendKeys(titulo);

    const descEl = await this.find(this.descripcionTextarea);
    await descEl.clear();
    await descEl.sendKeys(descripcion);
  }

  async fillVideoFields(data = {}) {
    const defaults = {
      titulo: "Nutrición infantil: primeros pasos",
      descripcion: "Video educativo sobre alimentación saludable",
      autor: "Dra. Ana López",
      tipo_autor: "Nutricionista",
      duracion: "08:30",
      youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    };
    const d = { ...defaults, ...data };

    await this.fillCommonFields(d.titulo, d.descripcion);

    const autorEl = await this.find(this.autorInput);
    await autorEl.clear();
    await autorEl.sendKeys(d.autor);

    const tipoAutorSel = await this.find(this.tipoAutorSelect);
    await tipoAutorSel.sendKeys(d.tipo_autor);

    const duracionEl = await this.find(this.duracionInput);
    await duracionEl.clear();
    await duracionEl.sendKeys(d.duracion);

    const youtubeEl = await this.find(this.youtubeUrlInput);
    await youtubeEl.clear();
    await youtubeEl.sendKeys(d.youtube_url);

    // Seleccionar categoría — es el select con required dentro del modal
    const catSelects = await this.driver.findElements(
      By.xpath("//div[contains(@class,'fixed')]//select[@required]")
    );
    if (catSelects.length > 0) {
      await selectFirstOption(this.driver, catSelects[catSelects.length - 1]);
    }
  }

  async fillArticuloFields(data = {}) {
    const defaults = {
      titulo: "Hábitos saludables para niños en edad escolar",
      descripcion: "Guía práctica para padres y cuidadores",
      contenido:
        "Los hábitos alimenticios saludables se forman desde temprana edad. " +
        "Es fundamental que los padres establezcan rutinas de comida equilibradas.",
      tiempo_lectura: "6 min lectura",
    };
    const d = { ...defaults, ...data };

    await this.fillCommonFields(d.titulo, d.descripcion);

    const contenidoEl = await this.find(this.contenidoTextarea);
    await contenidoEl.clear();
    await contenidoEl.sendKeys(d.contenido);

    const tiempoEl = await this.find(this.tiempoLecturaInput);
    await tiempoEl.clear();
    await tiempoEl.sendKeys(d.tiempo_lectura);

    // Seleccionar categoría
    const catSelects = await this.driver.findElements(
      By.xpath("//div[contains(@class,'fixed')]//select[@required]")
    );
    if (catSelects.length > 0) {
      await selectFirstOption(this.driver, catSelects[catSelects.length - 1]);
    }
  }

  async submit() {
    await this.click(this.submitButton);
  }

  async cancel() {
    await this.click(this.cancelButton);
  }
}

module.exports = AddContentModal;
