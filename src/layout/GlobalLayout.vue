<script setup lang="ts">
import GlobalToolBar from "./components/GlobalToolBar.vue";
import GlobalSider from "./components/GlobalSider.vue";
import GlobalStatusBar from "@/layout/components/GlobalStatusBar.vue";
import AppMain from "@/layout/components/AppMain.vue";
import { Multipane, MultipaneResizer } from "vue-multipane/src";
</script>

<template>
  <div class="global-layout">
    <global-tool-bar />
    <multipane layout="vertical" class="custom-resizer main-layout">
      <global-sider />
        <multipane-resizer />
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

.multipane-resizer {
  margin: 0; left: 0;
  position: relative;

  &:before {
    display: block;
    content: "";
    width: 3px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -1.5px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  &:hover {
    &:before {
      border-color: #999;
    }
  }
}
</style>