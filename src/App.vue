<script setup lang="ts">
import GlobalLayout from "@/layout/GlobalLayout.vue";
import "@/style/global.css";
import {onMounted} from "vue";
import {invoke} from "@tauri-apps/api/tauri";
import {appDataDir} from "@tauri-apps/api/path";

onMounted(async () => {
  const appDataDirPath = await appDataDir();
  await invoke('init_file_path', {filePath: appDataDirPath});
});
</script>

<template>
  <div class="common-container">
    <global-layout/>
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
  overflow: hidden;
}
</style>
