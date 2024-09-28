<script setup lang="ts">
import {Store, useStore} from "vuex";
import {FileInterface, FileStateInterface} from "@/store/modules/file.state.ts";
import {computed, ComputedRef, onMounted} from "vue";
import {UploadRequestOptions} from "element-plus";
import {TabInterface, TabStateInterface} from "@/store/modules/tab.state.ts";
import {BaseDirectory, BinaryFileContents, writeBinaryFile} from "@tauri-apps/api/fs";
import {invoke} from "@tauri-apps/api/tauri";
import {appDataDir} from "@tauri-apps/api/path";
import SvgIcon from "@/components/SvgIcon.vue";

const store: Store<any> = useStore();

// file store manage
const fileStore: ComputedRef<FileStateInterface> = computed(() => {
  return store.state.file;
});

const tabStore: ComputedRef<TabStateInterface> = computed(() => {
  return store.state.tab;
});

const fileList: ComputedRef<FileInterface[]> = computed(() => {
  return fileStore.value.fileList;
});

const tabList: ComputedRef<TabInterface[]> = computed(() => {
  return tabStore.value.tabList;
});

onMounted(() => {
  initFileList();
})

async function fileToUint8Array(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      resolve(new Uint8Array(arrayBuffer as ArrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

const initFileList = async () => {
  const appDataDirPath = await appDataDir();
  const files: string[] = await invoke('get_file_list', {filePath: appDataDirPath});
  console.log(files);
  files.forEach((file) => {
    const fileInstance: FileInterface = {
      id: fileList.value.length,
      index: fileList.value.length,
      fileName: file,
      active: false
    };

    store.commit("file/add", fileInstance);
  });
}

const uploadFile = (xhrData: UploadRequestOptions) => {
  console.log(xhrData);

  fileToUint8Array(xhrData.file).then(async (uint8Array) => {
    console.log(uint8Array);
    await writeBinaryFile(xhrData.file.name, uint8Array as BinaryFileContents, {dir: BaseDirectory.AppData});

    const fileInstance: FileInterface = {
      id: fileList.value.length,
      index: fileList.value.length,
      fileName: xhrData.file.name,
      active: true
    };

    store.commit("file/add", fileInstance);

    const pdfTab: TabInterface = {
      id: tabList.value.length,
      index: tabList.value.length,
      tabName: xhrData.file.name,
      routePath: `/tab/pdf/${xhrData.file.name}`,
      routeName: 'pdf',
      active: false
    };

    store.commit("tab/add", pdfTab);
  });

  return Promise.resolve();
}

const activate = (file: FileInterface) => {
  fileList.value.forEach((item) => {
    item.active = false;
  });

  file.active = true;

  const pdfTab: TabInterface = {
    id: tabList.value.length,
    index: tabList.value.length,
    tabName: file.fileName,
    routePath: `/tab/pdf/${file.fileName}`,
    routeName: 'pdf',
    active: true
  };

  store.commit("tab/add", pdfTab);
}
</script>

<template>
  <div class="document-sidebar-container">
    <div class="document-sidebar-toolbar">
      <div class="document-sidebar-title">
        文件列表
      </div>
      <el-upload
          class="document-sidebar-upload"
          action="#"
          :http-request="uploadFile"
          :show-file-list="false"
      >
        <el-button type="text">
          <svg-icon icon-class="folder-badge-plus" style="height: 24px; width: 24px;"/>
        </el-button>
      </el-upload>
    </div>
    <div class="document-sidebar-file-list">
      <div
        class="document-sidebar-file-item"
        v-for="file in fileList"
        :style="{backgroundColor: file.active ? '#ffffff' : '#f1f3f5'}"
        @click="activate(file)"
      >
        <svg-icon icon-class="pdf-file" style="width: 16px; height: 16px;"/>
        {{ file.fileName }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.document-sidebar-container {
  height: 100%;
  width: 100%;
  background-color: #f1f3f5;
}

.document-sidebar-file-item {
  display: inline-block;
  white-space: nowrap;
  width: 99%;
  overflow: hidden;
  text-overflow: ellipsis;

  line-height: 30px;
  padding: 2px 5px;
  border-radius: 6px;
  align-content: center;

  // can not select
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.document-sidebar-toolbar {
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .document-sidebar-title {
    height: 100%;
    text-align: center;
    line-height: 32px;
  }
}

.document-sidebar-file-list {
  margin: 5px 5px 0 5px;
}
</style>