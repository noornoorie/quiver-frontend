<template>
  <div>
    <b-row>
      Filter by category:
      <b-badge
        v-for="category in categories"
        :variant="category_filter.indexOf(category) != -1 ? 'primary' : 'secondary'"
        @click="category_filter.indexOf(category) != -1 ? category_filter.splice(category_filter.indexOf(category), 1) : category_filter.push(category)"
        >
        {{ category }}
      </b-badge>
    </b-row>
    <b-row>
      Filter by step:
      <b-badge
        v-for="step in steps"
        :variant="step_filter.indexOf(step) != -1 ? 'primary' : 'secondary'"
        @click="step_filter.indexOf(step) != -1 ? step_filter.splice(step_filter.indexOf(step), 1) : step_filter.push(step)"
        >
        {{ step }}
      </b-badge>
    </b-row>
    <b-row>
        <ocrd-processor-list-item
          v-for="processor in processors"
          :processor="processor"
        ></ocrd-processor-list-item>
    </b-row>
  </div>
</template>

<script>
import OcrdProcessorListItem from './OcrdProcessorListItem.vue'
export default {
  components: {
    OcrdProcessorListItem
  },
  props: {
    processors: {required: true},
    steps: {required: true},
    step_filter: {require: true},
    categories: {required: true},
    category_filter: {require: true},
  },
}
</script>
