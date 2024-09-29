<script setup lang="ts">
import sidebarList, {SidebarItem} from "@/sider/sidebar.list.ts";
import {Ref, ref} from "vue";
import SvgIcon from "@/components/SvgIcon.vue";

// is the sidebar visible
const isSidebarVisible = defineModel<boolean, string>('isSidebarVisible');

// current sidebar index
const currentSidebarIndex: Ref<number> = ref(0);

// current sidebar
const currentSidebar = defineModel<string, string>('currentSidebar');

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
  } else if (currentSidebar.value === sidebarItem.name) {
    // close the sidebar
    currentSidebar.value = '';
    currentSidebarIndex.value = -1;
    isSidebarVisible.value = !isSidebarVisible.value;
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
        <!-- icon animation -->
        <svg-icon :icon-class="sidebarItem.icon" class-name="sidebar-icon"/>
      </div>

      <div
          v-if="isSidebarVisible"
          :style="{ 'top': `calc(30px + ${currentSidebarIndex * 45}px)` }"
          class="sidebar-slide-block"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-icon-list-container {
  width: 45px;
  max-width: 45px;
  min-width: 45px;
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
</style>