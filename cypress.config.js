import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://zeta-connect-fe.vercel.app",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
