<script setup lang="ts">
import * as d3 from "d3"
import { ref, watch, computed, onMounted } from "vue"
import type { TimelineChartDataPoint } from "@/types"
import { createTooltip, setEventListeners } from "@/helpers/d3/d3-tooltip"
import colors from 'tailwindcss/colors'
import workflowsStore from "@/store/workflows-store"


interface Props {
  data: TimelineChartDataPoint[],
  maxY?: number,
  width?: number,
  startDate: Date,
  endDate: Date,
  height?: number,
  tooltipContent: (d: TimelineChartDataPoint) => string
}

const props = defineProps<Props>()

const height = props.height || 45
const marginTop = 10
const marginRight = 10
const marginBottom = 5
const marginLeft = 40
const _width = computed(() => props.width ?? 300)

const container = ref<HTMLDivElement>()

function isUp(data: TimelineChartDataPoint[], higherIsUp = true) {

  if (data.length === 0) return 0

  const last = data[data.length - 1].value
  const secondLast = data.length > 1 ? data[data.length - 2].value : last

  const diff = higherIsUp ? last - secondLast : secondLast - last

  if (diff === 0) return 0
  else if (diff > 0) return 1
  else return -1
}

function renderReleases() {

}

function render([data, startDate, endDate, maxY]) {
  if (!data || !startDate || !endDate) return

  if (data.length === 0) return

  if (!container.value) return
  container.value.replaceChildren()

  // Declare the x (horizontal position) scale.
  const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([marginLeft, _width.value - marginRight])

// Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
      .domain([0, maxY])
      .range([height - marginBottom, marginTop])
      .nice()


// Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", _width.value)
      .attr("height", height)

// Add the x-axis.
  svg.append("g")
      .classed('x-axis-group', true)
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(0).tickSize(0).tickFormat(d3.utcFormat("%d.%m.%Y")))

  svg.select('.x-axis-group .domain').attr('stroke', colors.gray['400'])
  svg.selectAll('.x-axis-group .tick text').attr('fill', colors.gray['400'])

// Add the y-axis.
  svg.append("g")
      .classed('y-axis-group', true)
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickValues([0, maxY]).tickSize(0).tickPadding(5))

  svg.select('.y-axis-group .domain').attr('stroke', colors.gray['400'])
  svg.selectAll('.y-axis-group .tick text').attr('fill', colors.gray['400'])


  const trend = isUp(data, false)

  const pathGroup = svg
      .append('g')
      .classed('path-group', true)
      .classed('up', trend === 1)
      .classed('down', trend === -1)

  pathGroup.append("path")
      .datum(data)
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(d.value) })
      )

  const pointGroups = pathGroup.selectAll("myCircles")
      .data(data)
      .enter()
      .append("g")

  pointGroups
      .append('circle')
      .attr("r", 10)
      .style('fill', 'transparent')
      .style('cursor', 'pointer')
      .attr("cx", function(d) { return x(d.date) })
      .attr("cy", function(d) { return y(d.value) })
      .classed('chart-point', true)

  pointGroups
      .append("circle")
      .attr("r", 2)
      .classed('pointer-events-none', true)
      .attr("cx", function(d) { return x(d.date) })
      .attr("cy", function(d) { return y(d.value) })

  const oldTooltip = document.querySelector('.d3-tooltip')
  const tooltip = oldTooltip ? d3.select(oldTooltip) : createTooltip(d3.select('body'), {
    classes: 'border border-gray-300 bg-white p-2 rounded-md'
  })

  setEventListeners(svg.selectAll('.chart-point'), tooltip, { useData: props.tooltipContent })


  const releasesGroup = svg
    .append('g')
    .classed('releases-group', true)

  workflowsStore.releases.forEach(release => {
    const xPos = x(new Date(release.published_at))

    releasesGroup
      .append("path")
      .attr("stroke-width", 1.5)
      .attr('stroke-dasharray', 4)
      .attr("d", d3.line()([[xPos, y(0)], [xPos, y(maxY)]]))
  })

  // Append the SVG element.
  container.value.append(svg.node())
}

onMounted(() => {
  render([props.data, props.startDate, props.endDate, props.maxY])
})

watch([() => props.data, () => props.startDate, () => props.endDate, () => props.maxY], render)
</script>

<template>
  <div ref="container"></div>
</template>

<style lang="scss">

.releases-group {
  fill: none;
  stroke: theme('colors.gray.400');
}

.path-group {
  path {
    fill: none;
    stroke: var(--color--neutral-text);
  }

  circle {
    fill: var(--color--neutral-text);
  }

  &.up {
    path {
      stroke: var(--color--positive-text);
    }

    circle {
      fill: var(--color--positive-text);
    }
  }

  &.down {
    path {
      stroke: var(--color--negative-text);
    }

    circle {
      fill: var(--color--negative-text);
    }
  }
}

.y-axis-group {
  .tick {
    &:first-of-type {
      text {
        transform: translateY(-3px);
      }
    }
    text {
      @apply text-[9px];
    }
  }
}

</style>

