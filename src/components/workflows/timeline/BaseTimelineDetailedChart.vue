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
  tooltipContent: (d: TimelineChartDataPoint) => string,
  yAxisTitle?: string,
  workflow?: string,
  higherIsPositive?: boolean
}

const props = defineProps<Props>()

const height = props.height || 60
const marginTop = 10
const marginRight = 10
const marginBottom = 90
const marginLeft = 70
const _width = computed(() => props.width ?? 300)
const yAxisTitle = computed(() => {
  let text = ''
  if (props.yAxisTitle) {
    text = props.yAxisTitle

    if (props.workflow) {
      text = `${props.workflow} - ${text}`
    }
  }
  return text
})

const yAxisTextHeight = computed(() => {
  let value = -(height / 2 + marginTop)
  value -= yAxisTitle.value.length ** 1.3
  return Math.round(value)
})

const container = ref<HTMLDivElement>()

function isUp(data: TimelineChartDataPoint[], higherIsPositive = true) {

  if (data.length === 0) return 0

  const last = data[data.length - 1].value
  const secondLast = data.length > 1 ? data[data.length - 2].value : last

  const diff = higherIsPositive ? last - secondLast : secondLast - last

  if (diff === 0) return 0
  else if (diff > 0) return 1
  else return -1
}

function render([data, startDate, endDate, maxY]) {
  if (!data || !startDate || !endDate) return

  if (data.length === 0) return

  // Declare the x (horizontal position) scale.
  const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([marginLeft, _width.value - marginRight])

// Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
      .domain([0, maxY])
      .range([height - marginBottom, marginTop])

// Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", _width.value - marginRight)
      .attr("height", height)
      .classed('!overflow-visible', true)

// Add the x-axis.
  svg.append("g")
      .classed('x-axis-group', true)
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(6).tickPadding(8).tickSize(5).tickFormat(d3.utcFormat("%d.%m.%Y")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.9em")
      .attr("dy", "-0.2em")
      .attr("transform", "rotate(-60)")

  svg.select('.x-axis-group .domain').attr('stroke', colors.gray['400'])
  svg.selectAll('.x-axis-group .tick text').attr('fill', colors.gray['400'])

  // Append x-axis title on the bottom
  svg
    .append('text')
    .attr('x', (_width.value / 2) - marginLeft)
    .attr('y', height)
    .text('Date')
    .attr('fill', colors.gray['400'])

// Add the y-axis.
  svg.append("g")
      .classed('y-axis-group', true)
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3
        .axisLeft(y)
        .ticks(6)
        .tickSize(0)
        .tickPadding(5)
        .tickSizeInner(-_width.value + marginLeft + marginRight)
      )

  // Append y-axis title on the left
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", marginLeft - 55)
      .attr("x", yAxisTextHeight.value )
      .text(yAxisTitle.value)
      .attr('fill', colors.gray['400'])


  svg.select('.y-axis-group .domain').attr('stroke', colors.gray['400'])
  svg.selectAll('.y-axis-group .tick text').attr('fill', colors.gray['400'])


  const trend = isUp(data, props.higherIsPositive)

  const pathGroup = svg
      .append('g')
      .classed('path-group', true)
      .classed('trend-positive', trend === 1)
      .classed('trend-negative', trend === -1)

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

    const releaseGroup = releasesGroup.append('g')

    releaseGroup
      .append("path")
      .attr("stroke-width", 1.5)
      .attr('stroke-dasharray', 4)
      .attr("d", d3.line()([[xPos, y(0)], [xPos, y(maxY)]]))

    const group = releaseGroup.append('g').attr('transform', 'translate(-79 0)')

    group
      .append('rect')
      .attr("x", xPos)
      .attr("y", y(maxY))
      .attr('width', 80)
      .attr('height', 18)
      .style("fill", 'white')

    group
      .append("text")
      .classed('tag-name', true)
      .attr("y", y(maxY))
      .attr("x", xPos)
      .attr('dy', 12)
      .attr('dx', 8)
      .text(release.tag_name)
      .attr('stroke', 'none')
      .attr('fill', colors.gray['600'])
      .style('cursor', 'pointer')

    releaseGroup.on('mouseenter', function(e) {
      this.parentElement.appendChild(this)
    })
  })

  // Append the SVG element.
  if (!container.value) return
  container.value.replaceChildren()
  container.value.append(svg.node())
}

onMounted(() => {
  render([props.data, props.startDate, props.endDate, props.maxY])
})

watch([() => props.data, () => props.startDate, () => props.endDate, () => props.maxY], render)


</script>

<template>
  <div class="svg-container" ref="container"></div>
</template>

<style lang="scss" scoped>

.svg-container:deep(svg) {
  .releases-group {
    .tag-name {
      font-size: 10px;
    }
  }

  .path-group {
    path {
      fill: none;
      stroke: var(--color--neutral-text);
    }

    circle {
      fill: var(--color--neutral-text);
    }

    &.trend-positive {
      path {
        stroke: var(--color--positive-text);
      }

      circle {
        fill: var(--color--positive-text);
      }
    }

    &.trend-negative {
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

        line {
          stroke: none;
        }
      }
      text {
        @apply text-[11px];
      }

      line {
        stroke: theme('colors.gray.200');
      }
    }
  }

  .x-axis-group {
    text {
      @apply text-[11px];
    }
  }
}

</style>

