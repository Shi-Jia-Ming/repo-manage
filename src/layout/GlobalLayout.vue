<script setup lang="ts">
import GlobalToolBar from "./components/GlobalToolBar.vue";
import GlobalStatusBar from "@/layout/components/GlobalStatusBar.vue";
import AppMain from "@/layout/components/AppMain.vue";
import TranslateSider from "@/layout/components/TranslateSider.vue";
import {Splitpanes, Pane} from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import {Ref, ref} from "vue";
import GlobalSidebarIcons from "@/layout/components/GlobalSidebarIcons.vue";
import Sider from "@/sider/Sider.vue";

const isTranslateSiderVisible: Ref<boolean> = ref(false);

// current sidebar
const currentSidebar: Ref<string> = ref<string>('');

// is the sidebar visible
const isSidebarVisible: Ref<boolean> = ref(false);
</script>

<template>
  <div class="global-layout">
    <global-tool-bar v-model:is-translate-sider-visible="isTranslateSiderVisible"/>
    <div style="display: flex; flex-direction: row; height: 100%; width: 100%;">
      <global-sidebar-icons
          v-model:current-sidebar="currentSidebar"
          v-model:is-sidebar-visible="isSidebarVisible"
      />
      <splitpanes layout="vertical" class="main-layout default-theme">
        <!-- TODO animation of collapse and expand -->
        <!-- TODO width of sidebar -->
        <pane v-if="isSidebarVisible" class="global-sidebar" min-size="10" max-size="30">
          <sider :current-component="currentSidebar"/>
        </pane>
        <pane min-size="70">
          <app-main/>
        </pane>
        <pane v-if="isTranslateSiderVisible">
          <translate-sider v-model:is-translate-sider-visible="isTranslateSiderVisible"/>
        </pane>
      </splitpanes>
    </div>
    <global-status-bar/>
  </div>
</template>

<style scoped lang="scss">
.global-sider {
  min-width: 100px;
  background-color: #f1f3f5;
}

.global-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-items: center;
  overflow: hidden;
}

.main-layout {
  width: 100%;
  height: 100%;
}

.fade_enter-active, .fade_leave-active {
  transition: opacity 0.5s;
}

pane {
  height: 100%;
}
</style>