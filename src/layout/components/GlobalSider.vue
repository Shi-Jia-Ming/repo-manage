<script setup lang="ts">
import router from "@/router";
import {computed, ComputedRef, onMounted, Ref, ref} from "vue";
import {RouteRecordRaw} from "vue-router";
import {MultipaneResizer} from "vue-multipane/src";

// get options of the sidebar routes
const sidebarRoutes: ComputedRef<RouteRecordRaw> = computed(() => {
  return router.options.routes[1];
});

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
const handleHide = (route: RouteRecordRaw) => {
  if (!isSidebarVisible.value) {
    // open the sidebar
    router.replace({name: route.name});
    isSidebarVisible.value = !isSidebarVisible.value;
  } else if (router.currentRoute.value.name !== route.name) {
    // switch the sidebar
    router.replace({name: route.name});
    // cache the width of the sidebar when it is switched
    sidebarWidth.value = <number>sidebarRef.value?.offsetWidth;
  } else if (router.currentRoute.value.name === route.name) {
    // close the sidebar
    router.replace({name: sidebarRoutes.value.name});
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
          v-for="route in sidebarRoutes.children"
          @click="handleHide(route)"
          :class="route.name === router.currentRoute.value.name ? 'sidebar-icon-active-container' : 'sidebar-icon-container'">
        <el-image :src="`/icons/${route.meta?.icon}`" alt="" class="sidebar-icon"/>
      </div>
    </div>
  </div>
  <div
      v-if="isSidebarVisible"
      ref="sidebarRef"
      :style="{width: `${sidebarWidth}px`}"
      class="pane global-sider">
    <div>
      <router-view/>
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
}

.sidebar-icon-container {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-content: center;
  border-left: solid 2px white;
  cursor: pointer;
}

.sidebar-icon-active-container {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-content: center;
  border-left: solid 2px #73767a;
  cursor: pointer;
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