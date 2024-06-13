<script setup lang="ts">
import GlobalToolBar from "./components/GlobalToolBar.vue";
import GlobalSider from "./components/GlobalSider.vue";
import GlobalStatusBar from "@/layout/components/GlobalStatusBar.vue";
import AppMain from "@/layout/components/AppMain.vue";
import { Multipane } from "vue-multipane/src";
</script>

<template>
  <div class="global-layout">
    <global-tool-bar />
    <multipane layout="vertical" class="custom-resizer main-layout">
      <global-sider />
      <app-main />
    </multipane>
    <global-status-bar />
  </div>
</template>

<style scoped lang="scss">
.global-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-items: center;
}

.main-layout {
  width: 100%;
  height: 100%;
}


</style>