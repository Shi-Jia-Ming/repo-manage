<script setup lang="ts">
import GlobalToolBar from "./components/GlobalToolBar.vue";
import GlobalSider from "./components/GlobalSider.vue";
import GlobalStatusBar from "@/layout/components/GlobalStatusBar.vue";
import AppMain from "@/layout/components/AppMain.vue";
import {Multipane} from "vue-multipane/src";
import TranslateSider from "@/layout/components/TranslateSider.vue";
import {Ref, ref} from "vue";

const isTranslateSiderVisible: Ref<boolean> = ref(false);
</script>

<template>
  <div class="global-layout">
    <global-tool-bar v-model:is-translate-sider-visible="isTranslateSiderVisible"/>
    <multipane layout="vertical" class="custom-resizer main-layout">
      <!-- TODO animation of collapse and expand -->
      <global-sider/>
      <app-main/>
      <translate-sider v-model:is-translate-sider-visible="isTranslateSiderVisible"/>
    </multipane>
    <global-status-bar/>
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

.fade_enter-active, .fade_leave-active {
  transition: opacity 0.5s;
}
</style>