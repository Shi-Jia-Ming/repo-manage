<script setup lang="ts">
import GlobalLayout from "@/layout/GlobalLayout.vue";
import "@/style/global.css";
</script>

<template>
  <div class="common-container">
    <global-layout />
  </div>
</template>

<style lang="scss" scoped>
.common-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-items: center;
}
</style>
