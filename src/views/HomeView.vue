<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import TabMenu from 'primevue/tabmenu'
import { useRouter } from "vue-router"

const { t } = useI18n()
const router = useRouter()

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
  }
])

function onTabChange({ index }) {
  router.push(items.value[index].to)
}
</script>
<template>
  <main>
    <div class="container mx-auto">
      <TabMenu :model="items" @tab-change="onTabChange" />
      <div class="content-container pt-6">
        <RouterView/>
      </div>
    </div>
  </main>
</template>



