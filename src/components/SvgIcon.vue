<template>
  <div v-if="isExternalComputed" :style="styleExternalIconComputed" class="svg-external-icon svg-icon" v-bind="$attrs"/>
  <svg v-else :class="svgClassComputed" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconNameComputed"/>
  </svg>
</template>

<script setup lang="ts">
import {computed, ComputedRef} from "vue";
import {isExternal} from "@/utils/validate";

// Props
const props = defineProps({
  iconClass: {type: String, required: true},
  className: {type: String, default: ''}
});

// Computed
const isExternalComputed: ComputedRef<boolean> = computed(() => {
  return isExternal(props.iconClass);
});

const iconNameComputed: ComputedRef<string> = computed(() => {
  return `#icon-${props.iconClass}`;
});

const svgClassComputed: ComputedRef<string> = computed(() => {
  return props.className ? `svg-icon ${props.className}` : 'svg-icon';
});

const styleExternalIconComputed: ComputedRef<{ "-webkit-mask": string; mask: string }> = computed(() => {
  return {
    mask: `url(${props.iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
  }
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>