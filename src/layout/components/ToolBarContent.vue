<script setup lang="ts">

import {ToolbarItem} from "@/toolbar/toolbar.list.ts";
import {watch} from "vue";

const props = defineProps<{
  toolbarItem: ToolbarItem | undefined,
  isShow: boolean
}>();

watch(() => props.isShow, (newVal) => {
  console.log(newVal);
});

</script>

<template>
  <div v-if="props.isShow" class="toolbar-content-container">
    <div v-for="child in props.toolbarItem?.children">
      <div>{{child.title}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar-content-container {
  position: absolute;
  top: 30px;
  left: 0;
  width: 200px;
  height: 200px;
  background-color: #f1f3f5;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all .5s;
}
</style>