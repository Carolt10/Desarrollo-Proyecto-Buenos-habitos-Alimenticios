"use strict";

module.exports = {
  spec: "tests/**/*.test.js",
  timeout: 30000,
  slow: 10000,
  retries: 1,
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "reports",
    reportFilename: "e2e-report",
    quiet: true,
    overwrite: true,
    html: true,
    json: true,
    charts: true,
    timestamp: "isoUtc",
  },
  require: ["dotenv/config", "./hooks/root.js"],
};
