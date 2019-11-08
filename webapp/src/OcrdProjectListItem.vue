<template>
  <b-card
    :title="project.org_plus_name"
    tag="article"
    :class="`mb-5 ocrd-project-list-item ${project.compliant_cli ? 'compliant' : 'non-compliant'}`"
    >
    <b-card-text v-if="!modal">
      <b-button @click="$root.showModal('project', projectIndex)">Expand</b-button>
    </b-card-text>
    <b-tabs v-model="tabIndex">
      <b-tab title="README">
        <div v-html="compiledReadme"></div>
      </b-tab>
      <b-tab title="Dockerfile">
        <vue-code-highlight>{{ project.files.Dockerfile || '# NO DOCKERFILE' }}</vue-code-highlight>
      </b-tab>
      <b-tab title="Git">
        <b-card-text>
          <p>
            <a v-if="project.python" href="`https://pypi.org/project/${ project.python.name }/`">             <img :src="`https://img.shields.io/pypi/v/${ project.python.name }.svg`"                                     /> </a>
            <!-- <a href="`https://travis-ci.org/${ project.org_plus_name }`">               <img :src="`https://travis-ci.org/${ project.org_plus_name }.svg?branch=master`"                             /> </a> -->
            <!-- <a href="`https://circleci.com/gh/${ project.org_plus_name }`">             <img :src="`https://circleci.com/gh/${ project.org_plus_name }.svg?style=svg`"                               /> </a> -->
            <!-- <a href="`https://hub.docker.com/r/ocrd/core/tags/`">                     <img :src="`https://img.shields.io/docker/automated/ocrd/core.svg`"                                        /> </a> -->
            <!-- <a href="`https://codecov.io/gh/${ project.org_plus_name }`">               <img :src="`https://codecov.io/gh/${ project.org_plus_name }/branch/master/graph/badge.svg`"                 /> </a> -->
            <!-- <a href="`https://scrutinizer-ci.com/g/${ project.org_plus_name }`">        <img :src="`https://scrutinizer-ci.com/g/${ project.org_plus_name }/badges/quality-score.png?b=master`"      /> </a> -->
            <!-- <a href="`https://lgtm.com/projects/g/${ project.org_plus_name }/alerts/`"> <img :src="`https://img.shields.io/lgtm/alerts/g/${ project.org_plus_name }.svg?logo=lgtm&amp;logoWidth=18`" /> </a> -->
          </p>
          <b-table v-if="project.git" :items="[project.git]"></b-table>
        </b-card-text>
      </b-tab>

      <b-tab title="ocrd-tool validation">
        <b-card-text>
          <vue-code-highlight>{{ project.ocrd_tool_validate || '# NO validation data' }}</vue-code-highlight>
        </b-card-text>
      </b-tab>

      <b-tab title="Python">
        <b-card-text>
          <b-table v-if="project.python" :items="[project.python]"></b-table>
        </b-card-text>
      </b-tab>

    </b-tabs>
  </b-card>
</template>

<script>
import marked from 'marked'
import { component as VueCodeHighlight } from 'vue-code-highlight'

export default {
  components: {
    VueCodeHighlight
  },
  props: {
    project: {required: true},
    tabIndex: {default: 0},
    projectIndex: {required: true},
    modal: {default: false}
  },
  computed: {
    cleanId() {
      return this.project.org_plus_name.replace(/[^A-Za-z0-9]/g, '-')
    },
    compiledReadme() {
      let src = this.project.files['README.md']
      if (!src) src = '`# NO README`'
      return marked(src)
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
