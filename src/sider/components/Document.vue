<script setup lang="ts">
import {Plus} from "@element-plus/icons-vue";
import {Store, useStore} from "vuex";
import {FileInterface, FileStateInterface} from "@/store/modules/file.state.ts";
import {computed, ComputedRef} from "vue";
import {UploadRequestOptions} from "element-plus";
import {TabInterface, TabStateInterface} from "@/store/modules/tab.state.ts";
import {BaseDirectory, BinaryFileContents, writeBinaryFile} from "@tauri-apps/api/fs";

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

const uploadFile = (xhrData: UploadRequestOptions) => {
  console.log(xhrData);

  fileToUint8Array(xhrData.file).then(async (uint8Array) => {
    console.log(uint8Array);
    await writeBinaryFile(xhrData.file.name, uint8Array as BinaryFileContents, {dir: BaseDirectory.AppData});

    const fileInstance: FileInterface = {
      id: fileList.value.length,
      index: fileList.value.length,
      fileName: xhrData.file.name,
      fileContent: xhrData.file,
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
</script>

<template>
  <div class="document-sidebar-container">
    <div class="document-sidebar-toolbar">
      <el-upload
          class="document-sidebar-upload"
          action="#"
          :http-request="uploadFile"
          :show-file-list="false"
      >
        <el-button type="text">
          <el-icon>
            <plus/>
          </el-icon>
        </el-button>
      </el-upload>
    </div>
    <div class="document-sidebar-file-list">
      <div
        class="document-sidebar-file-item"
        v-for="file in fileList">
        {{ file.fileName }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.document-sidebar-file-item {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  margin-top: 5px;
}
</style>