"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const { waitForVisible, waitForSpinnerGone } = require("../utils/waits");

/**
 * HomePage — Page Object para la página de inicio.
 *
 * Secciones:
 *  - Hero: título principal, estadísticas, botones CTA
 *  - Features: tarjetas de características
 *  - Testimonials: cards de testimonios + modal "Comparte tu Historia"
 */
class HomePage extends BasePage {
  // ─── Selectores ──────────────────────────────────────────────────────────

  get heroHeading() {
    return By.xpath("//h1[contains(., 'Nutrici')]");
  }

  get heroSubheading() {
    return By.xpath("//p[contains(., 'Ayudamos a las familias')]");
  }

  get ctaStartButton() {
    return By.xpath("//button[contains(., 'Comenzar Ahora')]");
  }

  get ctaVideosButton() {
    return By.xpath("//button[contains(., 'Ver Vídeos')]");
  }

  get statsSection() {
    return By.xpath("//*[contains(., 'familias')]");
  }

  get testimonialsHeading() {
    return By.xpath("//h2[contains(., 'Historia') or contains(., 'Testimoni')]");
  }

  get testimonialCards() {
    // Las cards de testimonio contienen estrellas y texto de logro
    return By.xpath(
      "//*[contains(@class,'testimonial') or .//p[contains(., 'achievement') or contains(@class,'quote')]]" +
      " | //div[contains(@class,'space-y') and .//svg]"
    );
  }

  get shareStoryButton() {
    return By.xpath("//button[contains(., 'Comparte tu Historia')]");
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async waitForPageLoad() {
    await waitForVisible(this.driver, this.heroHeading, this.timeout);
    await waitForSpinnerGone(this.driver);
  }

  async openShareStoryModal() {
    const btn = await this.find(this.shareStoryButton);
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'})",
      btn
    );
    await btn.click();
    // Verificar que el modal abrió
    await waitForVisible(
      this.driver,
      By.xpath("//h2[contains(., 'Comparte tu Historia')]"),
      this.timeout
    );
  }

  async getHeroTitle() {
    return this.getText(this.heroHeading);
  }

  async isShareStoryButtonVisible() {
    return this.isVisible(this.shareStoryButton);
  }

  async getTestimonialCount() {
    // Busca cards que tienen el avatar inicial (letra en círculo) y la cita
    const cards = await this.driver.findElements(
      By.xpath(
        "//div[.//div[string-length(normalize-space(.))=1 and string-length(.) < 5] and .//p]"
      )
    );
    return cards.length;
  }
}

module.exports = HomePage;
