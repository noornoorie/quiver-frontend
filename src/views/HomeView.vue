<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import TabMenu from 'primevue/tabmenu'
import { useRoute, useRouter } from "vue-router"

const { t } = useI18n()
const route = useRoute()
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

const activeRouteIndex = computed({
  get() {
    const path = route.path === '/' ? '/workflows' : route.path
    return items.value.findIndex(({ to }) => to === path)
  },
  set(index) {
    router.push(items.value[index].to)
  }
})

</script>
<template>
  <main>
    <div class="container mx-auto">
      <TabMenu v-model:activeIndex="activeRouteIndex" :model="items" />
      <div class="content-container pt-6">
        <RouterView/>
      </div>
    </div>
  </main>
</template>



