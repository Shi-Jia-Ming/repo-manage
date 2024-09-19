<script setup lang="ts">
import {Close} from "@element-plus/icons-vue";
import {Store, useStore} from 'vuex';
import router from "@/router";
import {computed, ComputedRef, onMounted, Ref, ref, UnwrapRef} from "vue";
import Sortable from "sortablejs";
import {TabInterface, TabStateInterface} from "@/store/modules/tab.state.ts";
import 'animate.css'
import {FileInterface, FileStateInterface} from "@/store/modules/file.state.ts";

const store: Store<any> = useStore();

// tab store manage
const tabStore: ComputedRef<TabStateInterface> = computed(() => {
  return store.state.tab;
});

const fileStore: ComputedRef<FileStateInterface> = computed(() => {
  return store.state.file;
});

// scroller bar ref
const scrollerBarRef: Ref<HTMLElement | null> = ref(null);

// current active tab
const currentActiveTab: Ref<TabInterface | undefined> = ref(tabStore.value.tabList[0]);

// the offsetX of slide block
const slideBlockOffsetX: Ref<UnwrapRef<number | undefined>> = ref(scrollerBarRef.value?.offsetLeft);

// the position of slide block
const slideBlockPosition: ComputedRef<number> = computed(() => {
  return currentActiveTab.value?.index! * 121 - (slideBlockOffsetX.value ? slideBlockOffsetX.value : 0);
});

//whether the tab switch animation open
const tabSwitchAnimation: Ref<boolean> = ref(false);

const tabList: ComputedRef<TabInterface[]> = computed(() => {
  return tabStore.value.tabList;
});

const fileList: ComputedRef<FileInterface[]> = computed(() => {
  return fileStore.value.fileList;
});

onMounted(() => {
  tabDrag();
})

// switch or add a tab instance
const addOrSwitchTab = (tab: TabInterface) => {
  store.commit("tab/add", tab);
  currentActiveTab.value = tab;

  if (tab.routeName === "pdf") {
    fileList.value.forEach((file) => {
      file.active = file.fileName === tab.tabName;
    });
  }
};

const removeTab = (tab: TabInterface) => {
  store.commit("tab/remove", tab);
  currentActiveTab.value = tabStore.value.tabList.find((tabInstance) => tabInstance.active);

  if (tab.routeName === "pdf") {
    fileList.value.forEach((file) => {
      file.active = file.fileName === currentActiveTab.value?.tabName;
    });
  }
};

const handleScroll = ({scrollLeft}: {scrollLeft: number}) => {
  slideBlockOffsetX.value = scrollLeft;
};

const tabDrag = () => {
  const element: HTMLElement = document.querySelector('.tab-title-list')!;

  new Sortable(element, {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd({ newIndex, oldIndex}) {
      // TODO drag tab
      const dragTab = tabList.value.splice(oldIndex!, 1)[0];
      tabList.value.splice(newIndex!, 0, dragTab);
      console.log(tabList.value);
      console.log(newIndex, oldIndex);
    }
  })
}
</script>

<template>
  <div :style="{ flexGrow: 1 }" class="app-main">
    <div class="main-view">
      <el-scrollbar ref="scrollerBarRef" @scroll="handleScroll" class="tab-scroller">
        <div class="tab-title-list">
          <div v-for="(tabInstance, index) in tabList"
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
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-main {
  height: 100%;
  min-width: 200px;
  background-color: #f1f3f5;
}

.main-view {
  height: 100%;
  width: 100%;

  .tab-scroller {
    height: 37px;
  }

  .tab-content {
    height: calc(100% - 37px);
  }
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
  min-width: 110px;
  height: 35px;

  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;

  padding: 0 5px;
  flex-shrink: 0;

  border-right: solid 1px #b9b9b9;
}

.tab-title-content {
  width: 100%;
  height: 100%;
  margin-right: 10px;
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

.test-div {
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 20px;
  z-index: 3;
  bottom: 0;
}
</style>