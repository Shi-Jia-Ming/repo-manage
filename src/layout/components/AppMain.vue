<script setup lang="ts">
import {Store, useStore} from 'vuex';
import router from "@/router";
import {computed, ComputedRef} from "vue";
import {TabInterface, TabStateInterface} from "@/store/modules/tab.state.ts";

const store: Store<any> = useStore();

// tab store manage
const tabStore: ComputedRef<TabStateInterface> = computed(() => {
  return store.state.tab;
});

const addTestTab = () => {
  addOrSwitchTab({
    tabName: "test",
    routePath: "/tab/repository",
    routeName: "Repository",
    active: false
  });
}

const deleteTestTab = () => {
  removeTab({
    tabName: "test",
    routePath: "/tab/repository",
    routeName: "Repository",
    active: false
  });
}

// switch or add a tab instance
const addOrSwitchTab = (tab: TabInterface) => {
  store.commit("tab/add", tab);
};

const removeTab = (tab: TabInterface) => {
  store.commit("tab/remove", tab);
}
</script>

<template>
  <div :style="{ flexGrow: 1 }" class="pane app-main">
    <div class="main-view">
      <div class="tab-title-list">
        <div v-for="(tabInstance, index) in tabStore.tabList"
             :key="index"
             class="tab-title"
             @click="addOrSwitchTab(tabInstance)"
        >
          {{ tabInstance.tabName }}
        </div>
        <el-button @click="addTestTab">
          添加测试tab
        </el-button>
        <el-button @click="deleteTestTab">
          删除测试tab
        </el-button>
      </div>
      <div class="tab-content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="tabStore.keepAliveList">
            <component :key="router.currentRoute.value.name" :is="Component"/>
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-main {
  min-width: 200px;
  background-color: #f1f3f5;
}
</style>