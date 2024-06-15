<script setup lang="ts">
import {RouteParamValue, useRoute} from "vue-router";
import {Ref, ref, UnwrapRef} from "vue";

const route = useRoute();

const repoName: Ref<UnwrapRef<string | RouteParamValue[]>> = ref(route.params.repoName);
</script>

<template>
  <div class="repository-container">
    {{ repoName }}
  </div>
</template>

<style scoped lang="scss">
.repository-container {
  height: 100%;
  background-color: #ffffff;
}
</style>