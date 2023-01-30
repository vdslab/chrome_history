export const defaultLayout = {
  name: "cola",
  animate: true,
  // refresh: 1, // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: 0, // max length in ms to run the layout6    ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  // boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node

  // // layout event callbacks
  // ready: function () {}, // on layoutready
  // stop: function () {}, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout
  avoidOverlap: true, // if true, prevents overlap of node bounding boxes
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  convergenceThreshold: 0.05, // when the alpha value (system energy) falls below this value, the layout stops
  nodeSpacing: function (node) {
    return 10;
  }, // extra spacing around nodes
  flow: { axis: "y", minSeparation: 30 }, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
  gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]
  centerGraph: true, // adjusts the node positions initially to center the graph (pass false if you want to start the layout from the current position)

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: undefined, // sets edge length directly in simulation
  edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
  edgeJaccardLength: undefined, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: 10, // unconstrained initial layout iterations
  userConstIter: 10, // initial layout iterations with user-specified constraints
  allConstIter: 10, // initial layout iterations with all constraints including non-overlap
};

export const styleSheet = [
  {
    selector: "node",
    style: {
      backgroundColor: "#4a56a6",
      width: 30,
      height: 30,
      label: "data(label)",

      // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
      // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
      // "text-valign": "center",
      // "text-halign": "center",
      "overlay-padding": "6px",
      "z-index": "10",
      //text props
      "text-outline-color": "#4a56a6",
      "text-outline-width": "2px",
      color: "white",
      fontSize: 20,
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#77828C",
      width: 50,
      height: 50,
      //text props
      "text-outline-color": "#77828C",
      "text-outline-width": 8,
    },
  },
  {
    selector: "node[type='ghost']",
    style: {
      shape: "rectangle",
      opacity: 0,
      "z-index": 5,
    },
  },
  {
    selector: "edge[!isBack]",
    style: {
      width: 3,
      "line-color": "#AAD8FF",
      "target-arrow-color": "#6774cb",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
  {
    selector: "edge[?isBack]",
    style: {
      width: 3,
      "line-color": "#6774cb",
      "source-arrow-shape": "triangle",
      "curve-style": "unbundled-bezier",
      "control-point-distances": [-40, 40, -40],
    },
  },
];
