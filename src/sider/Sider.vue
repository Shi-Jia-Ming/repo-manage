<script setup lang="ts">
import Repository from "@/sider/components/Repository.vue";
import HelloWorld from "@/sider/components/HelloWorld.vue";

const props = defineProps<{
  currentComponent: string;
}>();
</script>

<template>
  <div class="sider-layout">
    <repository v-if="props.currentComponent === 'repository'"/>
    <hello-world v-if="props.currentComponent === 'hello-world'"/>
  </div>
</template>

<style scoped lang="scss">

</style>