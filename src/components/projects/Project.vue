<template>
  <i-card>
      <template #header>
        <div class="_display:flex">
          <h3 class="card-title _margin-top:0">{{ props.id }}</h3>
          <div class="_margin-left:auto">
            <i-popover placement="top">
              <i-button link color="dark">
                <i-icon name="ink-info"></i-icon>
              </i-button>
              <template #header>
                <h5 class="_margin-top:0">{{ $t('additional_info')}}</h5>
              </template>
              <template #body>
                <p>This is the popover body. Useful information goes here.</p>
              </template>
              <template #footer>
                <div class="_display:flex">
                  <a :href="readmeUrl" title="README" target="_blank">README</a>
                  <a :href="changeLogUrl" title="CHANGELOG" target="_blank" class="_margin-left:auto">CHANGELOG</a>
                </div>
              </template>
          </i-popover>
          </div>
          </div>
      </template>
      <div v-if="repo">
        <div v-for="{ icon, label } in statusList" :key="label" class="_display:flex _align-items:center">
          <Icon
              :name="icon"
              class="_margin-right:1"
              :class="{
                'text-negative': icon === 'slash',
                'text-medium': icon === 'alert-triangle',
                'text-positive': icon === 'check-circle'
              }">

          </Icon>
          <span>{{ label }}</span>
        </div>
        <div class="_display:flex _margin-top:2 _margin-bottom:1">
          <i-badge v-if="projectType">{{ projectType }}</i-badge>
        </div>
      </div>
      <div v-else class="_display:flex _height:100% _align-items:center _justify-content:center">
        <span>{{ $t('error_repo_not_found') }}</span>
      </div>
  </i-card>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { store } from "@/helpers/store"
import Icon from "@/components/Icon.vue"
import { useI18n } from "vue-i18n"


const { t } = useI18n()

const props = defineProps(['id'])
const repo = ref(null)

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

</script>

<style lang="scss" scoped>
</style>
