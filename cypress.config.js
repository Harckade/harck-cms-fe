require('dotenv').config()
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,
  e2e: {
    setupNodeEvents(on, config) {
      config.baseUrl = process.env.REACT_APP_REDIRECT_URI
      config.env.CLIENT_ID = process.env.REACT_APP_CLIENT_ID
      config.env.CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET
      config.env.TENANT_ID = process.env.REACT_APP_TENANT_ID
      config.env.API_SCOPE = process.env.REACT_APP_API_SCOPE
      config.env.USERNAME = process.env.REACT_APP_USERNAME
      config.env.PASSWORD = process.env.REACT_APP_PASSWORD
      return config
    },
  }
});