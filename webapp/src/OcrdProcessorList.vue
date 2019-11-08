<template>
  <div>
    <b-row>
      <b-button v-b-toggle.processor-controls class="m-1">Toggle Controls</b-button>
      <b-collapse id="processor-controls">
        <b-container>
          <b-row>
            <b-form-checkbox v-model="show_noncompliant" name="check-button" switch>
            Non-compliant projects <b>({{ show_noncompliant ? "Show" : "Hide" }})</b>
            </b-form-checkbox>
          </b-row>
          <b-row>
            <b-form-checkbox v-model="show_unofficial" name="check-button" switch>
            Unofficial processors <b>({{ show_unofficial ? "Show" : "hide" }})</b>
            </b-form-checkbox>
          </b-row>
          <b-row>
            Filter by category:
            <b-badge
              v-for="category in categories"
              :key="category"
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
              :key="step"
              :variant="step_filter.indexOf(step) != -1 ? 'primary' : 'secondary'"
              @click="step_filter.indexOf(step) != -1 ? step_filter.splice(step_filter.indexOf(step), 1) : step_filter.push(step)"
              >
              {{ step }}
            </b-badge>
          </b-row>
        </b-container>
      </b-collapse>
    </b-row>
    <b-row>
        <ocrd-processor-list-item
          v-for="processor in filtered_processors"
          :key="processor.executable"
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
  data() {
    return {
      step_filter: [],
      show_unofficial: true,
      show_noncompliant: true,
      category_filter: {require: true},
      category_filter: [],
    }
  },
  props: {
    processors: {required: true},
  },
  computed: {
    filtered_processors() {
      return this.processors.filter(tool => {
        for (let step_filter of this.step_filter) {
          if (tool.steps.indexOf(step_filter) == -1)
            return false
        }
        for (let category_filter of this.category_filter) {
          if (tool.categories.indexOf(category_filter) == -1)
            return false
        }
        if (!(this.show_unofficial || tool.official)) {
          return false
        }
        if (!(this.show_noncompliant || project.compliant_cli)) {
          return false
        }
        return true
      })
    },
    steps() {
      return this.processors.reduce((all, processor) => {
        all.push(...processor.steps.filter(step => all.indexOf(step) == -1))
        return all
      }, [])
    },
    categories() {
      return this.processors.reduce((all, processor) => {
        all.push(...processor.categories.filter(category => all.indexOf(category) == -1))
        return all
      }, [])
    },
  },
  methods: {
    toggleStepFilter(v) {
      if (v in this.step_filter) {
        this.step_filter = this.step_filter.splice(this.step_filter.indexOf(v), 1)
      } else {
        this.step_filter.push(v)
      }
    }
  }
}
</script>
