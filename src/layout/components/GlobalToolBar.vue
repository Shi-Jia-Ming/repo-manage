<script setup lang="ts">
import {Close, Minus, FullScreen} from '@element-plus/icons-vue';
import {appWindow} from '@tauri-apps/api/window';
import toolbarList, {ToolbarItem} from "@/toolbar/toolbar.list.ts";
import ToolbarContent from "@/layout/components/ToolBarContent.vue";
import {onMounted, onUnmounted, Ref, ref} from "vue";

// is toolbar content show
const isToolbarContentShow: Ref<boolean> = ref(false);

// active toolbar item
const activeToolbarItem: Ref<ToolbarItem | undefined> = ref(undefined);

// mounted
onMounted(() => {
  document.addEventListener('click', handleToolbarContentHide);
});

// unmounted
onUnmounted(() => {
  document.removeEventListener('click', handleToolbarContentHide);
});

// handle toolbar content show
const handleToolbarContentShow = (toolbarItem: ToolbarItem) => {
  activeToolbarItem.value = toolbarItem;
  isToolbarContentShow.value = true;
  toolbarItem.action ? toolbarItem.action() : () => {};
};

// hide toolbar content if not click
const handleToolbarContentHide = (event: any) => {
  // don't hide
  if (!isToolbarContentShow.value ||
      event.target.classList[0] === 'toolbar-content' ||
      event.target.classList[0] === 'tool-item') return;
  // hide
  isToolbarContentShow.value = false;
};
</script>

<template>
  <div data-tauri-drag-region class="toolbar-container">
    <div class="left-content">
      <div class="app-icon">
        <el-image src="/vite.svg" alt="" style="height: 15px; width: 15px;" data-tauri-drag-region/>
      </div>
      <div class="tool-list">
        <div
            v-for="toolbarItem in toolbarList"
            @click="handleToolbarContentShow(toolbarItem)"
            class="tool-item"
        >{{ toolbarItem.title }}
        </div>
      </div>

      <toolbar-content
          class="toolbar-content"
          :toolbarItem="activeToolbarItem"
          :is-show="isToolbarContentShow"
      />
    </div>
    <el-button-group size="default" class="btn-container">
      <el-button type="text" @click="appWindow.minimize()" class="min-btn">
        <template #default>
          <el-icon :size="15" class="minus-icon">
            <minus/>
          </el-icon>
        </template>
      </el-button>
      <el-button type="text" @click="appWindow.toggleMaximize()" class="max-btn">
        <template #default>
          <el-icon :size="14" class="full-screen-icon">
            <full-screen/>
          </el-icon>
        </template>
      </el-button>
      <el-button type="text" @click="appWindow.close()" class="close-btn">
        <template #default>
          <el-icon :size="15" class="close-icon">
            <close/>
          </el-icon>
        </template>
      </el-button>
    </el-button-group>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-container {
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: end;
  background-color: #cdcdcd;
}

.left-content {
  display: flex;
  flex-direction: row;
}

.app-icon {
  height: 100%;
  margin: 0 12px;
  display: flex;
  align-items: center;
}

.tool-list {
  display: flex;
  flex-direction: row;
}

.tool-item {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  margin: 0 8px;
}

.el-button {
  width: 50px;
}

.el-icon {
  color: black !important;
  fill: black !important;
  font-size: medium;
}

.min-btn:hover,
.max-btn:hover {
  background-color: #b8b8b8;
}

.close-btn:hover {
  background-color: #e81123;
}

.min-btn:active,
.max-btn:active {
  background-color: #a4a4a4;
}

.close-btn:active {
  background-color: #dc5c66;

  .close-icon {
    color: white !important;
  }
}
</style>