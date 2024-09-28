<script setup lang="ts">
import {Store, useStore} from "vuex";
import {ComputedRef, computed, Ref, onMounted, ref} from "vue";
import {TabStateInterface} from "@/store/modules/tab.state.ts";
import {appConfigDir} from "@tauri-apps/api/path";
import {invoke} from "@tauri-apps/api/tauri";

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

const currentApi: Ref<string> = ref("");
const currentApiToken: Ref<string> = ref("");

onMounted(async () => {
  const appConfigDirPath = await appConfigDir();
  const config: {
    service: {
      translate_url: string,
      translate_token: string
    }
  } = await invoke('get_configuration', {configDirPath: appConfigDirPath});
  currentApiToken.value = config.service.translate_token;
  currentApi.value = config.service.translate_url;
});
</script>

<template>
  <div class="global-statusbar-container">
    <div class="current-active-container">
      <div class="current-active-icon-container">
        <svg-icon
            :icon-class="activePdfName === '' ? 'circle' : 'circle-active'"
            style="height: 12px; width: 12px;"/>
      </div>
      <div v-if="activePdfName !== ''" class="current-active">
        <span>当前激活的 PDF：</span>
        <span>{{activePdfName}}</span>
      </div>
      <div v-else class="no-active">
        <span>当前未激活任何 PDF</span>
      </div>
    </div>
    <div class="api-status-container">
      <span>当前API：</span>
      <span>{{currentApi}}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.global-statusbar-container {
  width: 100%;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.current-active-container {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  font-size: x-small;

  // can not select
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.api-status-container {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  font-size: x-small;

  // can not select
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.current-active-icon-container {
  margin-right: 5px;
  display: flex;
  justify-content: center;
}
</style>