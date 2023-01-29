<template>
  <i class="svg-icon" :class="'size-' + props.size" v-html="getSvg"></i>
</template>

<script setup>
import { computed } from "vue";
import { getIcon } from '@/helpers/icon';

const props = defineProps(['name', 'size']);

const getSvg = computed(() => {
  return getIcon(props.name);
});

</script>

<style lang="scss" scoped>
.svg-icon {
  position: relative;
  display: flex;
  width: 16px;
  height: 16px;

  &.size-lg {
    width: 20px;
    height: 20px;
  }

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
