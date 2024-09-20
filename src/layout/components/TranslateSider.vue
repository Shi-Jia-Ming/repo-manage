<script setup lang="ts">
import {inject, Ref, watch, ref} from "vue";
import TranslateService from "@/utils/translate.service.ts";

// @ts-ignore
const {wordToTranslate, updateWordToTranslate} = inject<{wordToTranslate: Ref<string>, updateWordToTranslate: (word: string) => void}>('wordToTranslate');

const targetWord = ref<string>('');

watch(wordToTranslate, (newWord) => {
  console.log(newWord);
  TranslateService.translate(newWord).then((res) => {
    targetWord.value = res;
  });
});

</script>

<template>
  <div
      class="translate-sider">
    <div class="translate-target-container">
      <div class="translate-target-title">
        <span>译文</span>
      </div>
      <div class="translate-target-content">
        <span>{{targetWord}}</span>
      </div>
    </div>
    <div class="translate-origin-container">
      <div class="translate-origin-title">
        <span>原文</span>
      </div>
      <div class="translate-origin-content">
        <span>{{wordToTranslate}}</span>
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
}

.translate-origin-container {
  height: 35%;
}

.translate-target-container {
  height: 55%;
}

.translate-origin-title,
.translate-target-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
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