<template>
  <b-card
    :title="repo.org_plus_name"
    tag="article"
    class="mb-5 ocrd-project-list-item"
    >
    <b-tabs>
      <b-tab title="README">
        <div v-html="compiledReadme"></div>
      </b-tab>
      <b-tab title="Dockerfile">
        <vue-code-highlight>{{ repo.files.Dockerfile || '# NO DOCKERFILE' }}</vue-code-highlight>
      </b-tab>
      <b-tab title="Git">
        <b-card-text>
          <p>
            <a href="`https://pypi.org/project/${ repo.python.name }/`">             <img :src="`https://img.shields.io/pypi/v/${ repo.python.name }.svg`"                                     /> </a>
            <!-- <a href="`https://travis-ci.org/${ repo.org_plus_name }`">               <img :src="`https://travis-ci.org/${ repo.org_plus_name }.svg?branch=master`"                             /> </a> -->
            <!-- <a href="`https://circleci.com/gh/${ repo.org_plus_name }`">             <img :src="`https://circleci.com/gh/${ repo.org_plus_name }.svg?style=svg`"                               /> </a> -->
            <!-- <a href="`https://hub.docker.com/r/ocrd/core/tags/`">                     <img :src="`https://img.shields.io/docker/automated/ocrd/core.svg`"                                        /> </a> -->
            <!-- <a href="`https://codecov.io/gh/${ repo.org_plus_name }`">               <img :src="`https://codecov.io/gh/${ repo.org_plus_name }/branch/master/graph/badge.svg`"                 /> </a> -->
            <!-- <a href="`https://scrutinizer-ci.com/g/${ repo.org_plus_name }`">        <img :src="`https://scrutinizer-ci.com/g/${ repo.org_plus_name }/badges/quality-score.png?b=master`"      /> </a> -->
            <!-- <a href="`https://lgtm.com/projects/g/${ repo.org_plus_name }/alerts/`"> <img :src="`https://img.shields.io/lgtm/alerts/g/${ repo.org_plus_name }.svg?logo=lgtm&amp;logoWidth=18`" /> </a> -->
          </p>
          <b-table v-if="repo.git" :items="[repo.git]"></b-table>
        </b-card-text>
      </b-tab>

      <b-tab title="ocrd-tool validation">
        <b-card-text>
          <vue-code-highlight>{{ repo.ocrd_tool_validate || '# NO validation data' }}</vue-code-highlight>
        </b-card-text>
      </b-tab>

      <b-tab title="Python">
        <b-card-text>
          <b-table v-if="repo.python" :items="[repo.python]"></b-table>
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
    repo: {required: true},
  },
  computed: {
    cleanId() {
      return this.repo.org_plus_name.replace(/[^A-Za-z0-9]/g, '-')
    },
    compiledReadme() {
      let src = this.repo.files['README.md']
      if (!src) src = '`# NO README`'
      return marked(src)
    }
  }
}
</script>

<style>

.ocrd-project-list-item {
  max-width: 30rem;
  max-height: 30rem;
  overflow: auto;
}
</style>
