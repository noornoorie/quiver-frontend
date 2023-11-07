import type { Selection } from "d3-selection"

interface D3TooltipOptions {
  content?: string,
  classes?: string
}

interface D3TooltipEventOptions {
  useData: (d: any) => string
}

export function createTooltip(container: Selection<Element, undefined, any, undefined>, options: D3TooltipOptions = {}) {
  const { content = '', classes = '' } = options
    return  container
    .append("div")
    .classed('d3-tooltip', true)
    .classed(classes, true)
    .style("position", "fixed")
    .style("z-index", "9999")
    .style("visibility", "hidden")
    .html(content)
}

export function setEventListeners(
  container: Selection<Element, undefined, any, undefined>,
  tooltip: Selection<Element, undefined, any, undefined>,
  options: D3TooltipEventOptions
) {

  const { useData = () => '' } = options

  container
    .on("mouseover", function(e, d) {
      const content = useData(d)
      const { top, left } = this.getBoundingClientRect()
      tooltip.html('<div>' + content + '</div>')
      return tooltip
        .style("visibility", "visible")
        .style("top", (top - 60) +"px")
        .style("left",left+"px")
    })
    .on("mouseout", function(){ return tooltip.style("visibility", "hidden") })
}
