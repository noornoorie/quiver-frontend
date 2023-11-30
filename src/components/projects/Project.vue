<script setup>
import { computed, ref, watch } from "vue"
import { store } from "@/helpers/store"
import Icon from "@/components/Icon.vue"
import { useI18n } from "vue-i18n"
import Button from "primevue/button"
import OverlayPanel from "primevue/overlaypanel"

const { t } = useI18n()

const props = defineProps(['id'])
const repo = ref(null)
const op = ref(null)

watch(() => props.id, (id) => {
  repo.value = store.getRepoById(id)
}, { immediate: true })

const statusList = computed(() => {
  return repo.value ? [
    ...(repo.value.unreleased_changes
        ? [{ icon: 'alert-triangle', label: repo.value.unreleased_changes + ' ' + t('unreleased_changes') }]
        : [{ icon: 'check-circle', label: t('version') + ' ' + repo.value.latest_version }]
    ),
    ...(repo.value.ocrd_tool_json_valid
        ? [{ icon: 'check-circle', label: 'ocrd-tool.json ' + t('is_valid') }]
        : [{ icon: 'slash', label: 'ocrd-tool.json ' + t('is_not_valid') }]
    ),
    ...(repo.value.dependency_conflicts
        ? [{ icon: 'alert-triangle', label: t('dependency_conflicts') }]
        : [{ icon: 'check-circle', label: t('no_dependency_conflicts') }]
    )
  ] : []
})

const readmeUrl = computed(() => {
  if (!repo.value) return ''
  return repo.value.additional_info.links['README.md']
})

const changeLogUrl = computed(() => {
  if (!repo.value) return ''
  return repo.value.additional_info.links['README.md']
})

const projectType = computed(() => {
  if (!repo.value) return null
  return repo.value.project_type
})

function toggleInfo(event) {
  op.value.toggle(event)
}

</script>

<template>
  <div class="flex flex-col border rounded-md">
    <div class="flex items-center px-4 py-2 bg-gray-200">
      <h3 class="card-title mt-0">{{ props.id }}</h3>
      <div class="ml-auto">
        <Button icon="pi pi-info" size="small" rounded outlined aria-label="Info" @click="toggleInfo" />
        <OverlayPanel ref="op" placement="top">
          <template #container>
            <h5 class="mt-0">{{ $t('additional_info')}}</h5>
            <p>This is the popover body. Useful information goes here.</p>
            <div class="flex">
              <a :href="readmeUrl" title="README" target="_blank">README</a>
              <a :href="changeLogUrl" title="CHANGELOG" target="_blank" class="ml-auto">CHANGELOG</a>
            </div>
          </template>
        </OverlayPanel>
      </div>
    </div>
    <div class="flex flex-col p-4">
      <div v-if="repo">
        <div v-for="{ icon, label } in statusList" :key="label" class="flex items-center">
          <Icon
            :name="icon"
            class="mr-1"
            :class="{
                'text-negative': icon === 'slash',
                'text-neutral': icon === 'alert-triangle',
                'text-positive': icon === 'check-circle'
              }">

          </Icon>
          <span>{{ label }}</span>
        </div>
        <div class="flex mt-2 mb-1">
          <div class="bg-gray-200 rounded-lg px-2 py-1 text-sm" v-if="projectType">{{ projectType }}</div>
        </div>
      </div>
      <div v-else class="flex h-full items-center justify-center">
        <span>{{ $t('error_repo_not_found') }}</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.p-button.p-button-sm {
  padding: 0.5rem 0.25rem;
}

.p-button.p-button-icon-only.p-button-rounded {
  height: 1.25rem;
  width: 1.25rem;
}

.p-button.p-button-sm .p-button-icon {
  font-size: 0.5rem;
}
</style>
