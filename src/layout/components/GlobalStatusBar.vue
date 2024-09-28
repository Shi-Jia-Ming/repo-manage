<script setup lang="ts">
import {Store, useStore} from "vuex";
import {ComputedRef, computed} from "vue";
import {TabStateInterface} from "@/store/modules/tab.state.ts";

const store: Store<any> = useStore();

const tabStore: ComputedRef<TabStateInterface> = computed(() => {
  return store.state.tab;
});

const activePdfName: ComputedRef<string> = computed(() => {
  for (let tab of tabStore.value.tabList) {
    if (tab.active) {
      return tab.tabName;
    }
  }
  return "";
});
</script>

<template>
  <div class="global-statusbar-container">
    <div class="current-active-container">
      <div v-if="activePdfName !== ''" class="current-active">
        <span>当前激活的 PDF：</span>
        <span>{{activePdfName}}</span>
      </div>
      <div v-else class="no-active">
        <span>当前未激活任何 PDF</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.global-statusbar-container {
  width: 100%;
  height: 25px;
}
.current-active-container {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  font-size: x-small;

  // can not select
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>