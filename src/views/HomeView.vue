<template>
  <main>
    <TabMenu :model="items" />
    <div class="content-container pt-3">
      <RouterView/>
    </div>
  </main>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

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
]);

onMounted(async () => {
  await router.isReady();
});

</script>
<style scoped>
</style>

