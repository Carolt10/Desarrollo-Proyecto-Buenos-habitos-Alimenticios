"use strict";

require("dotenv").config();

module.exports = {
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  BROWSER: (process.env.BROWSER || "chrome").toLowerCase(),
  HEADLESS: process.env.HEADLESS !== "false",
  TIMEOUT: parseInt(process.env.TIMEOUT || "15000", 10),
  SCREENSHOT_DIR: process.env.SCREENSHOT_DIR || "reports/screenshots",
  WINDOW_WIDTH: parseInt(process.env.WINDOW_WIDTH || "1920", 10),
  WINDOW_HEIGHT: parseInt(process.env.WINDOW_HEIGHT || "1080", 10),
};
