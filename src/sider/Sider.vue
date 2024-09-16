<script setup lang="ts">
import Repository from "@/sider/components/Repository.vue";
import HelloWorld from "@/sider/components/HelloWorld.vue";
import Document from "@/sider/components/Document.vue";

const props = defineProps<{
  currentComponent: string;
}>();
</script>

<template>
  <div class="sider-layout">
    <repository v-if="props.currentComponent === 'repository'"/>
    <hello-world v-if="props.currentComponent === 'hello-world'"/>
    <document v-if="props.currentComponent === 'document'"/>
  </div>
</template>

<style scoped lang="scss">

</style>