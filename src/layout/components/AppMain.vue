<script setup lang="ts">
import {Close} from "@element-plus/icons-vue";
import {Store, useStore} from 'vuex';
import router from "@/router";
import {computed, ComputedRef, Ref, ref} from "vue";
import {TabInterface, TabStateInterface} from "@/store/modules/tab.state.ts";
import 'animate.css'

const store: Store<any> = useStore();

// tab store manage
const tabStore: ComputedRef<TabStateInterface> = computed(() => {
  return store.state.tab;
});

const ids: Ref<number> = ref(1);

const addTestTab = () => {
  addOrSwitchTab({
    id: ids.value,
    tabName: "test",
    routePath: `/tab/repository/${Math.random()}`,
    routeName: "Repository",
    active: false
  });

  ids.value++;
  console.log(ids.value);
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
             class="tab-title animate__animated animate__fadeIn"
             :id="tabInstance.id.toString()"
             :style="{backgroundColor: tabInstance.active ? '#ffffff' : '#f8f8f8', borderTop: tabInstance.active ? 'solid 2px #409eff' : 'solid 2px #f8f8f8'}"
        >
          <div class="tab-title-content" @click="addOrSwitchTab(tabInstance)">{{ tabInstance.tabName }}</div>
          <el-icon size="large" class="tab-close-icon" @click="removeTab(tabInstance)">
            <close/>
          </el-icon>
        </div>
      </div>
      <div class="tab-content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="tabStore.keepAliveList">
            <component :key="router.currentRoute.value.fullPath" :is="Component"/>
          </keep-alive>
        </router-view>
        <el-button @click="addTestTab">
          添加测试tab
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-main {
  min-width: 200px;
  background-color: #f1f3f5;
}

.tab-title-list {
  height: 35px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: #f8f8f8;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.tab-title {
  width: 110px;
  height: 35px;

  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;

  padding: 0 5px;
  z-index: 100;
}

.tab-title-content {
  width: 100%;
  height: 100%;
  line-height: 100%;
  text-align: start;
  align-content: center;
}

.tab-close-icon {
  border-radius: 50%;
  align-self: center;
}

.tab-close-icon:hover {
  background-color: #d9d9d9;
}

.tab-content {
  height: calc(100vh - 135px);
}
</style>