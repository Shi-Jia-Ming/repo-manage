<script setup lang="ts">
import {inject, Ref, ref, watch} from "vue";
import TranslateService from "@/utils/translate.service.ts";
import {Loading} from "@element-plus/icons-vue";

// @ts-ignore
const {wordToTranslate, updateWordToTranslate} = inject<{
  wordToTranslate: Ref<string>,
  updateWordToTranslate: (word: string) => void
}>('wordToTranslate');

const targetWord = ref<string>('');

const isLoading: Ref<boolean> = ref(false);

watch(wordToTranslate, (newWord) => {
  isLoading.value = true;
  TranslateService.translate(newWord).then((res) => {
    targetWord.value = res;
    isLoading.value = false;
  });
});

</script>

<template>
  <div
      class="translate-sider">
    <div class="translate-target-container">
      <div class="translate-target-title-container">
        <div class="translate-target-title">
          <span>译文</span>
        </div>
        <div class="translate-loading-icon" v-if="isLoading">
          <el-icon class="is-loading" style="height: 20px; width: 20px;">
            <loading/>
          </el-icon>
        </div>
      </div>

      <div class="translate-target-content">
        <span>{{ targetWord }}</span>
      </div>
    </div>
    <div class="translate-origin-container">
      <div class="translate-origin-title">
        <span>原文</span>
      </div>
      <div class="translate-origin-content">
        <span>{{ wordToTranslate }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.translate-sider {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.translate-origin-container,
.translate-target-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 95%;

  .translate-target-title-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }

  .translate-loading-icon {
    width: 20px;
    height: 20px;
    padding: 0 5px;
    justify-content: center;
    align-self: center;
  }
}

.translate-origin-container {
  height: 35%;
}

.translate-target-container {
  height: 55%;
}

.translate-origin-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.translate-target-title {
  font-size: 16px;
  font-weight: bold;
}

.translate-origin-content,
.translate-target-content {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  height: 100%;
  overflow-y: auto;
  background-color: white;
}
</style>