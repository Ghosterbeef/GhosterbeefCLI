import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "cli",
  state: () => ({
    version: "1.0.0",
    prefix: "GhosterbeefCLI>"
  })
});
