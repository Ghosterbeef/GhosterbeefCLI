// https://nuxt.com/docs/api/configuration/nuxt-config
import eslintPlugin from "vite-plugin-eslint";

export default defineNuxtConfig({
  css: ["@/assets/base.css"],
  vite: {
    plugins: [eslintPlugin()],
  },
  modules: ["@pinia/nuxt"],
  app: {
    head: {
      title: "GhosterbeefCLI"
    }
  }
});
