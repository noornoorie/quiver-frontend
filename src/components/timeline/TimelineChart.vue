<script setup lang="ts">
import * as d3 from "d3"
import { onMounted, ref, watch, withDefaults, defineProps, computed } from "vue"
import type { TimelineChartDataPoint } from "@/types"
import { createTooltip, setEventListeners } from "@/helpers/d3/d3-tooltip"


interface Props {
  data: TimelineChartDataPoint[],
  maxY?: number,
  width?: number
}

const props = defineProps<Props>()

const height = 60
const marginTop = 10
const marginRight = 10
const marginBottom = 30
const marginLeft = 40
const _width = computed(() => props.width ?? 300)
const _maxY = computed(() => props.maxY ?? 2)

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

watch(() => props.data, (value) => {
  let data = value

  if (data.length === 0) return

  // Declare the x (horizontal position) scale.
  const x = d3.scaleTime()
    .domain([data[0].date, data[data.length -1].date])
    .range([marginLeft, _width.value - marginRight])

// Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
    .domain([0, _maxY.value])
    .range([height - marginBottom, marginTop])

// Create the SVG container.
  const svg = d3.create("svg")
    .attr("width", _width.value)
    .attr("height", height)

// Add the x-axis.
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(3).tickFormat(d3.utcFormat("%d.%m.%Y")))

// Add the y-axis.
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(1))

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
    .attr("cx", function(d) { return x(d.date) })
    .attr("cy", function(d) { return y(d.value) })

  const oldTooltip = document.querySelector('.d3-tooltip')
  const tooltip = oldTooltip ? d3.select(oldTooltip) : createTooltip(d3.select('body'), {
    classes: 'border border-gray-300 bg-white p-2 rounded-md'
  })

  setEventListeners(svg.selectAll('.chart-point'), tooltip, { useData: (d) => d.value })

  // Append the SVG element.
  container.value.replaceChildren()
  container.value.append(svg.node())
})


</script>

<template>
  <div ref="container"></div>
</template>

<style lang="scss">

.path-group {
  path {
    fill: none;
    stroke: var(--color--medium-text);
  }

  circle {
    fill: var(--color--medium-text);
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

</style>

