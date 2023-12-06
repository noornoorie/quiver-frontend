<script setup lang="ts">
const props = withDefaults(defineProps<{
  showTextColors: boolean
}>(), {
  showTextColors: true
})
</script>

<template>
  <div class="flex space-x-3 text-sm text-gray-600" :class="{ 'text-colors': showTextColors }">
    <div class="flex items-center positive"><i class="w-3 h-3 mr-1"></i><span>{{ $t('better') }}</span></div>
    <div class="flex items-center neutral"><i class="w-3 h-3 mr-1"></i><span>{{ $t('equal') }}</span></div>
    <div class="flex items-center negative"><i class="w-3 h-3 mr-1"></i><span>{{ $t('worse') }}</span></div>
  </div>
</template>

<style scoped lang="scss">

.text-colors {
  .positive {
    i {
      background: var(--color--positive-text);
    }
  }

  .neutral {
    i {
      background: var(--color--neutral-text);
    }
  }

  .negative {
    i {
      background: var(--color--negative-text);
    }
  }
}

.positive {
  i {
    background: var(--color--positive-background);
  }
}

.neutral {
  i {
    background: var(--color--neutral-background);
  }
}

.negative {
  i {
    background: var(--color--negative-background);
  }
}

</style>
