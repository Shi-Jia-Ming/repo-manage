<script setup lang="ts">
import Document from "@/sider/components/Document.vue";

const props = defineProps<{
  currentComponent: string;
}>();
</script>

<template>
  <div class="sider-layout">
    <document v-if="props.currentComponent === 'document'"/>
  </div>
</template>

<style scoped lang="scss">
.sider-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f1f3f5;
}
</style>