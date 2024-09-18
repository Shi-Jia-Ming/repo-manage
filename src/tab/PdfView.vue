<script setup lang="ts">
import {onMounted, ref, Ref, UnwrapRef} from "vue";
import {RouteLocationNormalized, RouteParamValue, useRoute} from "vue-router";
import {invoke} from "@tauri-apps/api/tauri";
import {appDataDir} from "@tauri-apps/api/path";

const route: RouteLocationNormalized = useRoute();

const pdfName: Ref<UnwrapRef<string | RouteParamValue[]>> = ref(route.params.pdfName);

const pdfUrl: Ref<string> = ref('');

onMounted(async () => {
   try {
     const appDataDirPath = await appDataDir();
     pdfUrl.value = await invoke('load_file', {filePath: appDataDirPath + pdfName.value});
     pdfUrl.value = URL.createObjectURL(base64ToBlob(pdfUrl.value));
   } catch (e) {
     console.error(e);
   }
})

function base64ToBlob(code: string) {
  code = code.replace(/[\n\r]/g, '')
  // atob() 方法用于解码使用 base-64 编码的字符串。
  const raw = window.atob(code)
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: 'application/pdf' })
}
</script>

<template>
  <div class="pdf-view">
    <div class="pdf-main">
      <iframe id="pdf" :src="`/pdf.js/web/viewer.html?file=${pdfUrl}`" style="width: 100%; height: 100%;"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pdf-view {
  height: 100%;
  background-color: #ffffff;
}

.pdf-main {
  display: flex;
  flex-direction: row;
  height: 100%;

  .pdf-sider {
    width: 250px;
    background-color: #f0f0f0;
  }
}

.pdf-toolbar {
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #f0f0f0;

  .page-group {
    //width: 100%;
  }
}

.pdf-scrollbar-container {
  width: 100%;
  justify-content: center;
}
</style>