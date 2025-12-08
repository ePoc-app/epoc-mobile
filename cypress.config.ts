import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: 'tests/cypress/e2e/support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'tests/cypress/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',
    videosFolder: 'tests/cypress/e2e/videos',
    screenshotsFolder: 'tests/cypress/e2e/screenshots',
    baseUrl: 'http://localhost:8100',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
