<template>
  <TheHeader />
  <router-view />
</template>

<script setup>
import { RouterView } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
</script>

<style>
@import "@/assets/base.css";

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
