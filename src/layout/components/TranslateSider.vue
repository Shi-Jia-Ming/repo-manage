<script setup lang="ts">
import {MultipaneResizer} from "vue-multipane/src";
import {defineModel, onMounted, Ref, ref} from "vue";

const isTranslateSiderVisible = defineModel('isTranslateSiderVisible');
const sidebarRef = ref<HTMLElement | null>(null);

const sidebarWidth: Ref<number> = ref(50);

onMounted(() => {
  // cache the width of the sidebar on mounted
  sidebarWidth.value = <number>sidebarRef.value?.offsetWidth;
})
</script>

<template>
  <multipane-resizer v-show="isTranslateSiderVisible"/>
  <div
      class="translate-sider pane"
      ref="sidebarRef"
      :style="{width: `${sidebarWidth}px`}"
      v-show="isTranslateSiderVisible">
    {{ isTranslateSiderVisible }}
  </div>
</template>

<style scoped lang="scss">
.translate-sider {
  min-width: 400px;
}
</style>