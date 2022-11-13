/* eslint-disable */
// TODO: remove the eslint disable

import * as d3 from 'd3';
import {
  ARROWHEAD_FATNESS,
  ARROWHEAD_FILL,
  CONTAINER_DEFAULT_HEIGHT,
  CONTAINER_DEFAULT_WIDTH,
  EDGE_FILL,
  EDGE_PATH_D,
  EDGE_WIDTH,
  NODE_DIAMETER,
  STROKE_WIDTH,
  VERTEX_FONT_SIZE,
  VISUALISER_CANVAS,
  WEIGHT_LABEL_SIZE,
} from 'visualiser-src/common/constants';

function getPrimitiveVal(value) {
  return value !== null && typeof value === 'object' ? value.valueOf() : value;
}

// TODO: move or delete
const lineStyle = {
  'stroke-width': 3,
  'stroke-linecap': 'round',
  opacity: 0,
  stroke: '#000',
};

// Defining the arrowhead for directed edges.
// Sourced the attributes from here: http://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1.
// TODO: these could be defined declaratively elsewhere
// TODO: remove.
function defineArrowheads() {}

export function renderForceGraph(
  {
    vertices, // an iterable of node objects (typically [{id}, …])
    edges, // an iterable of link objects (typically [{source, target}, …])
  },
  {
    // TODO: simplify options passing.
    nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
    nodeStroke = '#fff',
    nodeStrokeWidth = STROKE_WIDTH,
    nodeStrokeOpacity = 1,
    getEdgeSource = ({ source }) => source.id, // given d in links, returns a node identifier string
    getEdgeDest = ({ target }) => target.id, // given d in links, returns a node identifier string
    linkStroke = EDGE_FILL,
    linkStrokeWidth = (d) => d.weight,
    linkStrokeLinecap = 'round',
  } = {}
) {
  // Determining container dimensions.
  // TODO: on page dimensions change (from zooming in or out, for example), refresh the width and height so that the graph is positioned correctly.
  const containerWidth =
    Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) ||
    CONTAINER_DEFAULT_WIDTH;
  const containerHeight =
    Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 600 ||
    CONTAINER_DEFAULT_HEIGHT;

  // Generating the node & links dataset that D3 uses for simulating the graph.
  const verticesMap = d3.map(vertices, nodeId).map(getPrimitiveVal);
  const edgesSourceMap = d3.map(edges, getEdgeSource).map(getPrimitiveVal);
  const edgesDestMap = d3.map(edges, getEdgeDest).map(getPrimitiveVal);

  // Replace the input nodes and links with mutable objects for the simulation.
  // Here, we build the vertex and edge maps that are used to render the graph.
  const simVertices = d3.map(vertices, (_, i) => ({ id: verticesMap[i] }));
  const simEdges = d3.map(edges, (edge, i) => ({
    source: edgesSourceMap[i],
    target: edgesDestMap[i],
    weight: edge.weight,
    isBidirectional: edge.isBidirectional,
  }));

  // Generating styling maps that we use to apply styles. We can do things
  // like make every edge's width scale proportionally to its weight, ie.
  // make higher weight edges wider than lower weight edges.
  const edgeWidths = typeof linkStrokeWidth !== 'function' ? null : d3.map(edges, linkStrokeWidth);
  const edgeColour = typeof linkStroke !== 'function' ? null : d3.map(edges, linkStroke);

  // Clear the graph's existing <g> children, which are the containers for
  // the graph's vertices, edges, weight labels, etc.
  d3.select(VISUALISER_CANVAS).selectAll('g').remove();

  function ticked(edgeGroup: any, vertexGroup: any, weightLabelGroup: any, vertexTextGroup: any) {
    const clampX = (x) =>
      Math.max(
        -containerWidth / 2 + NODE_DIAMETER / 2,
        Math.min(containerWidth / 2 - NODE_DIAMETER / 2, x)
      );
    const clampY = (y) =>
      Math.max(
        -containerHeight / 2 + NODE_DIAMETER / 2,
        Math.min(containerHeight / 2 - NODE_DIAMETER / 2, y)
      );

    // On each tick of the simulation, update the coordinates of everything.
    edgeGroup
      .attr('x1', (d) => clampX(d.source.x))
      .attr('y1', (d) => clampY(d.source.y))
      .attr('x2', (d) => clampX(d.target.x))
      .attr('y2', (d) => clampY(d.target.y));
    vertexGroup.attr('cx', (d) => clampX(d.x)).attr('cy', (d) => clampY(d.y));
    weightLabelGroup
      .attr('x', (d) => (clampX(d.source.x) + clampX(d.target.x)) / 2)
      .attr('y', (d) => (clampY(d.source.y) + clampY(d.target.y)) / 2);
    vertexTextGroup.attr('x', (d) => clampX(d.x)).attr('y', (d) => clampY(d.y));
  }

  // Setting the dimensions of the graph SVG container.
  // Expects the visualiser canvas to be mounted on the DOM already.
  const graph = d3
    .select(VISUALISER_CANVAS)
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr('viewBox', [-containerWidth / 2, -containerHeight / 2, containerWidth, containerHeight]); // Setting the origin to be at the center of the SVG container.
  defineArrowheads();

  // Construct the forces. Nodes must strongly repel each other and links must
  // attract them together.
  const forceNode = d3.forceManyBody().strength(-2000).distanceMax(300);
  const forceLink = d3
    .forceLink(simEdges)
    .id(({ index: i }) => verticesMap[i])
    .strength(0.08);
  // .strength(EDGE_ATTRACTIVE_FORCE_MULTIPLIER);
  const centralForce = d3.forceCenter();

  // Set the force directed layout simulation parameters.
  const simulation = d3
    .forceSimulation(simVertices)
    .force('link', forceLink)
    .force('charge', forceNode)
    .force('center', centralForce)
    .stop();

  // Add the edges to the graph and set their properties.
  const edgeGroup = graph
    .append('g')
    .attr('stroke', typeof linkStroke !== 'function' ? linkStroke : null)
    .attr('stroke-width', EDGE_WIDTH)
    .attr('stroke-linecap', linkStrokeLinecap)
    .attr('id', 'edges')
    .selectAll('line')
    .data(simEdges)
    .join('line')
    .attr(
      'class',
      (link) => `edge-${link.source.id}-${link.target.id} edge-${link.target.id}-${link.source.id}`
    )
    .attr('marker-end', (edge) => {
      // TODO: these 4 lines are duplicated a few times in this file.
      const src = getEdgeSource(edge);
      const dest = getEdgeDest(edge);
      const startVertex = src < dest ? src : dest;
      const endVertex = src < dest ? dest : src;
      return `url(#arrowhead-end-${startVertex}-${endVertex})`;
    })
    .attr('marker-start', (edge) => {
      if (edge.isBidirectional) {
        const src = getEdgeSource(edge);
        const dest = getEdgeDest(edge);
        const startVertex = src < dest ? src : dest;
        const endVertex = src < dest ? dest : src;
        return `url(#arrowhead-start-${startVertex}-${endVertex})`;
      }
    });

  // TODO: rename
  const markerGroup = graph
    .append('g')
    .attr('id', 'end-arrowheads')
    .selectAll('marker')
    .data(simEdges)
    .join('marker')
    .attr('id', (edge) => {
      const src = getEdgeSource(edge);
      const dest = getEdgeDest(edge);
      const startVertex = src < dest ? src : dest;
      const endVertex = src < dest ? dest : src;
      return `arrowhead-end-${startVertex}-${endVertex}`;
    })
    .attr('viewBox', '-0 -10 20 20')
    .attr('refX', NODE_DIAMETER / 2 - 5) // The offset of the arrowhead.
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', ARROWHEAD_FATNESS)
    .attr('markerHeight', ARROWHEAD_FATNESS)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', EDGE_PATH_D)
    .attr('fill', ARROWHEAD_FILL);

  const markerGroup2 = graph
    .append('g')
    .attr('id', 'start-arrowheads')
    .selectAll('marker')
    .data(simEdges)
    .join('marker')
    .attr('id', (edge) => {
      const src = getEdgeSource(edge);
      const dest = getEdgeDest(edge);
      const startVertex = src < dest ? src : dest;
      const endVertex = src < dest ? dest : src;
      return `arrowhead-start-${startVertex}-${endVertex}`;
    })
    .attr('viewBox', '-0 -10 20 20')
    .attr('refX', NODE_DIAMETER / 2 - 5) // The offset of the arrowhead.
    .attr('refY', 0)
    .attr('orient', 'auto-start-reverse') // Reverses the direction of 'end-arrowhead'. See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/orient.
    .attr('markerWidth', ARROWHEAD_FATNESS)
    .attr('markerHeight', ARROWHEAD_FATNESS)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', EDGE_PATH_D)
    .attr('fill', ARROWHEAD_FILL);

  // Add the weight labels to the graph and set their properties.
  const weightLabelGroup = graph
    .append('g')
    .attr('id', 'weight-labels')
    .style('user-select', 'none')
    .selectAll('text')
    .data(simEdges)
    .join('text')
    .attr(
      'id',
      (edge) =>
        `weight-${edge.source.id}-${edge.target.id} weight-${edge.target.id}-${edge.source.id}`
    )
    .text((edge) => `${edge.weight}`)
    .style('font-size', WEIGHT_LABEL_SIZE)
    .attr('fill', 'black')
    // .attr('stroke', 'brown')
    .attr('x', (link) => link.x1)
    .attr('y', (link) => link.y1)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle');

  // Add the vertices to the graph and set their properties.
  const vertexGroup = graph
    .append('g')
    .attr('fill', '#FFFFFF')
    .attr('stroke', nodeStroke)
    .attr('stroke-opacity', nodeStrokeOpacity)
    .attr('stroke-width', nodeStrokeWidth)
    .attr('id', 'vertices')
    .selectAll('circle')
    .data(simVertices)
    .join('circle')
    .attr('r', NODE_DIAMETER / 2)
    .attr('id', (node) => `vertex-${node.id}`)
    .attr('stroke', '#000000');

  // Add the vertex text labels to the graph and set their properties.
  const vertexTextGroup = graph
    .append('g')
    .attr('fill', '#000000')
    .style('user-select', 'none')
    .attr('id', 'vertex-labels')
    .selectAll('text')
    .data(simVertices)
    .join('text')
    .style('pointer-events', 'none')
    .attr('id', (node) => `text-${node.id}`)
    .attr('font-size', VERTEX_FONT_SIZE)
    .attr('alignment-baseline', 'middle') // Centering text inside a circle: https://stackoverflow.com/questions/28128491/svg-center-text-in-circle.
    .attr('text-anchor', 'middle')
    .text((_, i) => i);

  simulation.tick(300);

  const clampX = (x) =>
    Math.max(
      -containerWidth / 2 + NODE_DIAMETER / 2,
      Math.min(containerWidth / 2 - NODE_DIAMETER / 2, x)
    );
  const clampY = (y) =>
    Math.max(
      -containerHeight / 2 + NODE_DIAMETER / 2,
      Math.min(containerHeight / 2 - NODE_DIAMETER / 2, y)
    );

  // On each tick of the simulation, update the coordinates of everything.
  edgeGroup
    .attr('x1', (d) => clampX(d.source.x))
    .attr('y1', (d) => clampY(d.source.y))
    .attr('x2', (d) => clampX(d.target.x))
    .attr('y2', (d) => clampY(d.target.y));
  vertexGroup.attr('cx', (d) => clampX(d.x)).attr('cy', (d) => clampY(d.y));
  weightLabelGroup
    .attr('x', (d) => (clampX(d.source.x) + clampX(d.target.x)) / 2)
    .attr('y', (d) => (clampY(d.source.y) + clampY(d.target.y)) / 2);
  vertexTextGroup.attr('x', (d) => clampX(d.x)).attr('y', (d) => clampY(d.y));

  // Applying styling maps to the edges.
  if (edgeWidths) edgeGroup.attr('stroke-width', ({ index: i }) => edgeWidths[i]);
  if (edgeColour) edgeGroup.attr('stroke', ({ index: i }) => edgeColour[i]);

  simulation.on('tick', () => ticked(edgeGroup, vertexGroup, weightLabelGroup, vertexTextGroup));

  return Object.assign(graph.node());
}
