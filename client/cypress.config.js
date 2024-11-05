const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/e2e.js',
        specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}', // Add this line to specify where to find your spec files
        defaultCommandTimeout: 10000,
    },
});
