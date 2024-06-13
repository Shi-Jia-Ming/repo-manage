<script setup lang="ts">
import {Close, Minus, FullScreen} from '@element-plus/icons-vue';
import { appWindow } from '@tauri-apps/api/window';
</script>

<template>
  <div data-tauri-drag-region class="toolbar-container">
    <el-button-group size="large" class="btn-container">
      <el-button type="text" @click="appWindow.minimize()" class="min-btn">
        <template #default>
          <el-icon :size="15" class="minus-icon">
            <minus />
          </el-icon>
        </template>
      </el-button>
      <el-button type="text" @click="appWindow.toggleMaximize()" class="max-btn">
        <template #default>
          <el-icon :size="14" class="full-screen-icon">
            <full-screen />
          </el-icon>
        </template>
      </el-button>
      <el-button type="text" @click="appWindow.close()" class="close-btn">
        <template #default>
          <el-icon :size="15" class="close-icon">
            <close />
          </el-icon>
        </template>
      </el-button>
    </el-button-group>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-container {
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-content: end;
  background-color: #cdcdcd;
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