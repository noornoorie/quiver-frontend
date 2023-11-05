<template>
  <main>
    <i-container>
      <div class="_display:flex _align-items:center _border-bottom-color:gray-20 _border-bottom" style="padding-bottom: 1px;">
        <i-tabs v-model="activeTab">
          <template #header>
            <i-tab-title v-for="tab in items" :key="tab.to" :for="tab.to">
              {{ tab.label }}
            </i-tab-title>
          </template>
        </i-tabs>
        <a
          class="_margin-left:auto _display:flex _align-items:center _cursor:pointer _color:gray-50"
          @click="setColorMode"
          v-html="colorMode === 'dark' ? getIcon('sun') : getIcon('moon')"
        >
        </a>
      </div>
      <div class="content-container _padding-top:3">
        <RouterView/>
      </div>
    </i-container>
  </main>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

import { getIcon } from '@/helpers/icon'

const router = useRouter()
const route = useRoute()

const { t } = useI18n()
const activeTab = ref('/workflows')

watch(activeTab, (value) => {
  router.push(value)
})

const items = ref([
  {
    label: t('projects'),
    icon: 'pi pi-fw pi-home',
    to: '/projects'
  },
  {
    label: t('processors'),
    icon: 'pi pi-fw pi-calendar',
    to: '/processors'
  },
  {
    label: t('workflows'),
    icon: 'pi pi-fw pi-pencil',
    to: '/workflows'
  },
  {
    label: t('timeline'),
    icon: 'pi pi-fw pi-pencil',
    to: '/timeline'
  },
])

onMounted(async () => {
  await router.isReady()
  activeTab.value = '/' + route.name
})

const inkline = inject('inkline', {})
const colorMode = ref(inkline.options.colorMode)

// Set the initial color mode value to determine the icon to be displayed
if (colorMode.value === 'system' && typeof window !== 'undefined') {
  colorMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Toggle between light and dark mode
const setColorMode = () => {
  const mode = colorMode.value === 'dark' ? 'light' : 'dark'

  inkline.options.colorMode = mode
  colorMode.value = mode
}

</script>
<style scoped>
.tabs {
  ----border-width: 0;
  ----padding-left: 1rem;
  ----padding-right: 1rem;
  ----padding-top: 1rem;
  ----padding-bottom: 1rem;
}
</style>

