<script setup lang="ts">
import {Plus} from "@element-plus/icons-vue";
import {Store, useStore} from "vuex";
import {FileInterface, FileStateInterface} from "@/store/modules/file.state.ts";
import {computed, ComputedRef} from "vue";
import {UploadRequestOptions} from "element-plus";

const store: Store<any> = useStore();

// file store manage
const fileStore: ComputedRef<FileStateInterface> = computed(() => {
  return store.state.file;
});

const fileList: ComputedRef<FileInterface[]> = computed(() => {
  return fileStore.value.fileList;
});

const uploadFile = (xhrData: UploadRequestOptions) => {
  console.log(xhrData);

  const fileInstance: FileInterface = {
    id: fileList.value.length,
    index: fileList.value.length,
    fileName: xhrData.file.name,
    fileContent: xhrData.file,
    active: true
  };

  store.commit("file/add", fileInstance);
  console.log(fileList.value);

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