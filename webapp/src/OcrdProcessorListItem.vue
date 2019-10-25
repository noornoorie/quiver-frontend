<template>
  <b-card
    tag="article"
    :title="processor.executable.replace('ocrd-', '')"
    class="mb-5"
    >
    <b-card-text>

      <b-tabs>
        <b-tab title="Description">
          <blockquote>
            {{ processor.description }}
          </blockquote>
          <b-badge variant="info" v-for="step in processor.steps" :key="step">{{ step }}</b-badge>
  <b-badge variant="success" v-for="category in processor.categories" :key="category">{{ category }}</b-badge>
          <p>
            Part of <a href="">{{ processor.part_of }}</a>
          </p>
          <p>
            <a href="">Read the Documentation!</a>
          </p>
        </b-tab>

        <b-tab title="Parameters">
          <ul>
            <li v-for="param, name in processor.parameters" :key="name">
              <strong>{{ name }}</strong> {{ param }}
            </li>
          </ul>
        </b-tab>

      </b-tabs>

    </b-card-text>
  </b-card>
</template>

<script>
export default {
  props: {
    processor: {required: true}
  }
}
</script>
