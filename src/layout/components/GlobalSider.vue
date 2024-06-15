<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {MultipaneResizer} from "vue-multipane/src";
import Sider from "@/sider/Sider.vue";
import sidebarList, {SidebarItem} from "@/sider/sidebar.list";

// current sidebar
const currentSidebar: Ref<string> = ref<string>('');
// current sidebar index
const currentSidebarIndex: Ref<number> = ref(0);

// is the sidebar visible
const isSidebarVisible: Ref<Boolean> = ref(false);

// the sidebar ref
const sidebarRef: Ref<HTMLElement | null> = ref(null);

// cache the width of the sidebar
const sidebarWidth: Ref<number> = ref(50);

onMounted(() => {
  // cache the width of the sidebar on mounted
  sidebarWidth.value = <number>sidebarRef.value?.offsetWidth;
})

// handle hide sidebar
const handleSwitch = (sidebarItem: SidebarItem, index: number) => {
  if (!isSidebarVisible.value) {
    // open the sidebar
    currentSidebar.value = sidebarItem.name;
    currentSidebarIndex.value = index;
    isSidebarVisible.value = !isSidebarVisible.value;
  } else if (currentSidebar.value !== sidebarItem.name) {
    // switch the sidebar
    currentSidebar.value = sidebarItem.name;
    currentSidebarIndex.value = index;
    // cache the width of the sidebar when it is switched
    sidebarWidth.value = <number>sidebarRef.value?.offsetWidth;
  } else if (currentSidebar.value === sidebarItem.name) {
    // close the sidebar
    currentSidebar.value = '';
    currentSidebarIndex.value = -1;
    isSidebarVisible.value = !isSidebarVisible.value;
    // cache the width of the sidebar when it is closed
    sidebarWidth.value = <number>sidebarRef.value?.offsetWidth;
  }
}
</script>

<template>
  <div class="sidebar-icon-list-container">
    <div class="sidebar-icon-list">
      <div
          v-for="(sidebarItem, index) in sidebarList"
          @click="handleSwitch(sidebarItem, index)"
          class="sidebar-icon-container"
      >
        <el-image :src="`/icons/${sidebarItem.icon}`" alt="" class="sidebar-icon"/>
      </div>

      <div
          v-if="isSidebarVisible"
          :style="{ 'top': `${currentSidebarIndex * 45}px` }"
          class="sidebar-slide-block"/>
    </div>
  </div>
  <div
      v-if="isSidebarVisible"
      ref="sidebarRef"
      :style="{width: `${sidebarWidth}px`}"
      class="pane global-sider">
    <div>
      <sider :current-component="currentSidebar"/>
    </div>
  </div>
  <multipane-resizer v-if="isSidebarVisible"/>
</template>

<style scoped lang="scss">
.global-sider {
  min-width: 100px;
  background-color: #f1f3f5;
}

.sidebar-icon-list-container {
  width: 50px;
  max-width: 50px;
  min-width: 50px;
  display: flex;
  flex-direction: column;
  align-content: center;
  background-color: #eeeeee;
  border-right: solid 1px #e5e5e5;
}

.sidebar-icon-container {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-content: center;
  cursor: pointer;
}

.sidebar-slide-block {
  width: 2px;
  height: 45px;
  background-color: #73767a;
  position: absolute;
  cursor: pointer;

  z-index: 1;
  transition: all .4s;
}

.sidebar-icon {
  width: 27px;
  height: 27px;
  align-self: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.multipane-resizer {
  margin: 0 2px 0 0;
  left: 0;
  position: relative;
  background-color: #f1f3f5;

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