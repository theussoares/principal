<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";

const BaseNavbar = defineAsyncComponent(
  () => import("design_system/BaseNavbar"),
);

const route = useRoute();

const navLinks = computed(() => [
  { label: "Pokédex", href: "/", active: route.path === "/" },
]);
</script>

<template>
  <div class="app-layout">
    <ClientOnly>
      <BaseNavbar brand-name="MicroFrontends POC" :links="navLinks" />
      <template #fallback>
        <div class="navbar-skeleton" />
      </template>
    </ClientOnly>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: "Inter", system-ui, sans-serif;
  background: #0a0e1a;
  color: #e2e8f0;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

.navbar-skeleton {
  height: 64px;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
