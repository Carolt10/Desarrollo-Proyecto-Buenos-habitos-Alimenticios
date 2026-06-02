"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const { waitForVisible, waitForSpinnerGone, pause } = require("../utils/waits");

/**
 * AlertsPage — Page Object para la página Alerta y Concientización.
 *
 * Secciones:
 *  - Alerta principal (azúcar)
 *  - Videos educativos con modal de reproducción
 *  - Artículos informativos con vista de blog
 *  - Botón FAB "Agregar Contenido" (abre modal de creación)
 */
class AlertsPage extends BasePage {
  // ─── Selectores ──────────────────────────────────────────────────────────

  get pageHeading() {
    return By.xpath("//h1[contains(., 'Alerta')]");
  }

  get mainAlertCard() {
    return By.xpath("//div[contains(@class,'bg-red-50')]//h3[contains(., 'Alerta')]");
  }

  get videosSection() {
    return By.xpath("//h2[contains(., 'Video') or contains(., 'video')]");
  }

  get articlesSection() {
    return By.xpath("//h2[contains(., 'Art') or contains(., 'art')]");
  }

  get playVideoButtons() {
    // Cards de video con botón de reproducción
    return By.xpath("//button[.//*[contains(@class,'lucide-play') or name()='svg']][ancestor::div[contains(@class,'cursor-pointer') or contains(@class,'hover')]]");
  }

  get videoCards() {
    return By.xpath(
      "//div[.//button[.//*[name()='svg']] and .//h3]"
    );
  }

  get articleCards() {
    return By.xpath(
      "//div[.//button[contains(., 'Leer') or contains(., 'más')]]"
    );
  }

  get readMoreButtons() {
    return By.xpath("//button[contains(., 'Leer')]");
  }

  get addContentButton() {
    // Botón FAB en la esquina inferior derecha
    return By.xpath(
      "//button[contains(., 'Agregar') and contains(., 'Contenido') or contains(.,'Agregar Contenido')]" +
      " | //button[@title='Agregar Contenido' or contains(@class,'fixed')]"
    );
  }

  get videoModal() {
    return By.xpath("//div[contains(@class,'fixed') and contains(@class,'bg-black')]//iframe");
  }

  get closeVideoModalButton() {
    return By.xpath(
      "//div[contains(@class,'fixed') and contains(@class,'bg-black')]//button"
    );
  }

  get articleModal() {
    return By.xpath(
      "//div[contains(@class,'fixed') and contains(@class,'bg-white') and .//button[contains(.,'Volver')]]"
    );
  }

  get backFromArticleButton() {
    return By.xpath(
      "//button[contains(., 'Volver') and not(contains(.,'Recetas'))]"
    );
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async waitForPageLoad() {
    await waitForVisible(this.driver, this.pageHeading, this.timeout);
    await waitForSpinnerGone(this.driver);
  }

  async getVideoCount() {
    const cards = await this.driver.findElements(this.videoCards);
    return cards.length;
  }

  async getArticleCount() {
    const cards = await this.driver.findElements(this.articleCards);
    return cards.length;
  }

  async clickFirstVideoCard() {
    const buttons = await this.driver.findElements(this.playVideoButtons);
    if (buttons.length === 0) {
      // Intento alternativo: buscar cards de video
      const cards = await this.driver.findElements(
        By.xpath("//div[.//h3 and .//button]")
      );
      if (cards.length > 0) {
        await this.driver.executeScript(
          "arguments[0].scrollIntoView({block:'center'})",
          cards[0]
        );
        const btn = await cards[0].findElement(By.css("button"));
        await btn.click();
      }
    } else {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'})",
        buttons[0]
      );
      await buttons[0].click();
    }
    await pause(500);
  }

  async closeVideoModal() {
    await this.click(this.closeVideoModalButton);
    await pause(300);
  }

  async clickFirstArticle() {
    const buttons = await this.driver.findElements(this.readMoreButtons);
    if (buttons.length === 0) throw new Error("No hay artículos visibles");
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'})",
      buttons[0]
    );
    await buttons[0].click();
    await pause(500);
  }

  async closeArticleModal() {
    await this.click(this.backFromArticleButton);
    await pause(300);
  }

  async openAddContentModal() {
    // El botón FAB tiene texto "Agregar Contenido" y está fijo en la esquina
    const candidates = await this.driver.findElements(
      By.xpath("//button[contains(., 'Agregar')]")
    );
    if (candidates.length === 0) throw new Error("Botón Agregar Contenido no encontrado");

    for (const btn of candidates) {
      const text = await btn.getText();
      if (text.includes("Agregar") || text.includes("Contenido")) {
        await this.driver.executeScript(
          "arguments[0].scrollIntoView({block:'center'})",
          btn
        );
        await btn.click();
        break;
      }
    }

    await waitForVisible(
      this.driver,
      By.xpath("//h3[contains(., 'Agregar') or contains(., 'Contenido')]"),
      this.timeout
    );
  }

  async isMainAlertVisible() {
    return this.isVisible(this.mainAlertCard);
  }
}

module.exports = AlertsPage;
