<script setup lang="ts">
import {Store, useStore} from "vuex";
import {computed, ComputedRef, onMounted, Ref, ref} from "vue";
import {TabStateInterface} from "@/store/modules/tab.state.ts";
import {appConfigDir} from "@tauri-apps/api/path";
import {invoke} from "@tauri-apps/api/tauri";
import TranslateService from "@/utils/translate.service.ts";
import {Loading} from "@element-plus/icons-vue";
import {ElPopover} from "element-plus";

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

const currentApiName: Ref<string> = ref("");
const currentApiUrl: Ref<string> = ref("");
const currentApiToken: Ref<string> = ref("");
const currentApiStatus: Ref<boolean | undefined> = ref();

const apiPopover = ref<InstanceType<typeof ElPopover>>();

onMounted(async () => {
  const appConfigDirPath = await appConfigDir();
  const config: {
    service: {
      translate_name: string,
      translate_url: string,
      translate_token: string
    }
  } = await invoke('get_configuration', {configDirPath: appConfigDirPath});
  currentApiName.value = config.service.translate_name;
  currentApiToken.value = config.service.translate_token;
  currentApiUrl.value = config.service.translate_url;

  await testApi();
});

const testApi = async () => {
  TranslateService.updateApi(currentApiUrl.value, currentApiToken.value);
  currentApiStatus.value = undefined;
  TranslateService.translate('test').then((_res) => {
    currentApiStatus.value = true;
  }).catch((_err) => {
    currentApiStatus.value = false;
  });
}

const updateApi = async () => {
  const appConfigDirPath = await appConfigDir();
  await invoke('write_configuration', {
    configDirPath: appConfigDirPath,
    translateName: currentApiName.value,
    translateUrl: currentApiUrl.value,
    translateToken: currentApiToken.value
  });

  apiPopover.value?.hide();
}
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
        <span>{{ activePdfName }}</span>
      </div>
      <div v-else class="no-active">
        <span>当前未激活任何 PDF</span>
      </div>
    </div>
    <el-popover ref="apiPopover" class="api-tip-popover" width="300" trigger="click">
      <!-- TODO use class cannot-select -->
      <h3 class="cannot-select">API配置</h3>
      <el-form label-position="right" label-width="auto" style="justify-content: end;">
        <el-form-item label="名称" label-position="right">
          <el-input v-model="currentApiName"/>
        </el-form-item>
        <el-form-item label="地址" label-position="right">
          <el-input v-model="currentApiUrl"/>
        </el-form-item>
        <el-form-item label="令牌" label-position="right">
          <el-input v-model="currentApiToken"/>
        </el-form-item>
        <div style="width: 100%; margin-bottom: 15px; display: flex; justify-content: end;">
          <el-button type="primary" @click="testApi">测试</el-button>
          <el-button type="primary" @click="updateApi">更新</el-button>
        </div>
      </el-form>

      <template #reference>
        <div class="api-status-container">
          <span>当前API：</span>
          <span>{{ currentApiName }}</span>
          <div v-if="currentApiStatus !== undefined" style=" width: 110px; display: flex;">
            <span style="margin-left: 20px;">状态：</span>
            <div v-if="currentApiStatus" style="display: flex;">
              <span>可用</span>
              <svg-icon icon-class="circle-ok-green" class="status-icon"/>
            </div>
            <div v-else>
              <span>不可用</span>
              <svg-icon icon-class="circle-error-red" class="status-icon"/>
            </div>
          </div>
          <div v-else style="width: 110px;">
            <span style="margin-left: 20px;">状态检测中</span>
            <el-icon class="is-loading" style="margin: 0 3px;">
              <loading />
            </el-icon>
          </div>
        </div>
      </template>
    </el-popover>
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

  border-radius: 5px;
}

.api-status-container:hover {
  background-color: #f0f0f0;
}

.api-status-container:active {
  background-color: #eaeaea;
}

.current-active-icon-container {
  margin-right: 5px;
  display: flex;
  justify-content: center;
}

.status-icon {
  height: 12px;
  width: 12px;
  margin: 0 3px;
  align-self: center;
}
</style>