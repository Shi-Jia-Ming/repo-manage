<script setup lang="ts">
import {Close} from "@element-plus/icons-vue";
import {Store, useStore} from 'vuex';
import router from "@/router";
import {computed, ComputedRef, Ref, ref, UnwrapRef} from "vue";
import {TabInterface, TabStateInterface} from "@/store/modules/tab.state.ts";
import 'animate.css'

const store: Store<any> = useStore();

// tab store manage
const tabStore: ComputedRef<TabStateInterface> = computed(() => {
  return store.state.tab;
});

// scroller bar ref
const scrollerBarRef: Ref<HTMLElement | null> = ref(null);

const ids: Ref<number> = ref(0);

// current active tab
const currentActiveTab: Ref<TabInterface | undefined> = ref(tabStore.value.tabList[0]);

// the offsetX of slide block
const slideBlockOffsetX: Ref<UnwrapRef<number | undefined>> = ref(scrollerBarRef.value?.offsetLeft);

// the position of slide block
const slideBlockPosition: ComputedRef<number> = computed(() => {
  return currentActiveTab.value?.index! * 120 - (slideBlockOffsetX.value ? slideBlockOffsetX.value : 0);
});

//whether the tab switch animation open
const tabSwitchAnimation: Ref<boolean> = ref(false);

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
  currentActiveTab.value = tab;
};

const removeTab = (tab: TabInterface) => {
  store.commit("tab/remove", tab);
  currentActiveTab.value = tabStore.value.tabList.find((tabInstance) => tabInstance.active);
}

const handleScroll = ({scrollLeft}: {scrollLeft: number}) => {
  slideBlockOffsetX.value = scrollLeft;
}
</script>

<template>
  <div :style="{ flexGrow: 1 }" class="pane app-main">
    <div class="main-view">
      <el-scrollbar ref="scrollerBarRef" @scroll="handleScroll">
        <div class="tab-title-list">
          <div v-for="(tabInstance, index) in tabStore.tabList"
               :key="index"
               class="tab-title animate__animated animate__fadeIn"
               :id="tabInstance.id.toString()"
               :style="{backgroundColor: tabInstance.active ? '#ffffff' : '#f8f8f8', borderTop: tabInstance.active && !tabSwitchAnimation ? 'solid 2px #409eff' : 'solid 2px #f8f8f8'}"
          >
            <div class="tab-title-content" @click="addOrSwitchTab(tabInstance)">{{ tabInstance.tabName }}</div>
            <el-icon size="large" class="tab-close-icon" @click="removeTab(tabInstance)">
              <close/>
            </el-icon>
          </div>
          <div
              :style="{'left': `${slideBlockPosition}px`}"
              v-if="currentActiveTab?.index !== undefined && tabSwitchAnimation"
              class="title-slide-block"
          />
        </div>
      </el-scrollbar>

      <div class="tab-content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="tabStore.keepAliveList">
            <component :key="router.currentRoute.value.fullPath" :is="Component"/>
          </keep-alive>
        </router-view>
        <el-button @click="addTestTab">
          添加测试tab
        </el-button>
        <el-switch v-model="tabSwitchAnimation" active-text="开启" inactive-text="关闭"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-main {
  min-width: 200px;
  background-color: #f1f3f5;
}

.main-view {
  width: 100%;
}

.tab-title-list {
  height: 37px;
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  cursor: pointer;
  // can not select
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: #f8f8f8;
}

.title-slide-block {
  width: 120px;
  height: 2px;
  background-color: #409eff;
  position: absolute;
  cursor: pointer;

  z-index: 1;
  transition: all .5s;
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
  flex-shrink: 0;
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