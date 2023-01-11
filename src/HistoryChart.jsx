import React, { useMemo } from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import cola from "cytoscape-cola";

cytoscape.use(cola);

export default function HistoryChart({ nodes, links }) {
  console.log("history chart");

  const graphData = useMemo(() => {
    // const { nodes, links } = props;
    if (nodes.length === 0 || links.length === 0) {
      console.log("node or link is none");
      return null;
    }

    const nodedata = nodes.map(({ data }) => {
      return {
        data: {
          id: data.id,
          label: data.id,
          type: "node",
        },
      };
    });

    const linkdata = links.map(({ data }) => {
      return {
        data: {
          target: data.target,
          source: data.source,
        },
      };
    });
    // objectの重複をなくす
    const edges = Array.from(
      new Map(
        linkdata.map((item) => {
          const key = item.data.target + item.data.source;
          return [key, item];
        })
      ).values()
    );

    return {
      nodes: nodedata,
      edges,
    };
  }, [nodes, links]);

  if (graphData === null) {
    return (
      <div>
        <p>loading</p>
      </div>
    );
  }

  const width = "800px";
  const height = "600px";
  const graphWidth = "80vw";
  const graphHeight = "80vh";

  // const graphData = { nodes: nodes, edges: links };

  const layout = {
    name: "cola",
    animate: true,
    // refresh: 1, // number of ticks per frame; higher is faster but more jerky
    maxSimulationTime: 3000, // max length in ms to run the layout6    ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
    fit: true, // on every layout reposition of nodes, fit the viewport
    padding: 30, // padding around the simulation
    // boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    // nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

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
    unconstrIter: 30, // unconstrained initial layout iterations
    userConstIter: 20, // initial layout iterations with user-specified constraints
    allConstIter: 20, // initial layout iterations with all constraints including non-overlap
  };

  const styleSheet = [
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
      selector: "node[type='device']",
      style: {
        shape: "rectangle",
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        // "line-color": "#6774cb",
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
      },
    },
  ];

  return (
    <div>
      <p>以下に描画</p>

      <div style={{ width: width, height: height }}>
        <CytoscapeComponent
          elements={CytoscapeComponent.normalizeElements(graphData)}
          // pan={{ x: 200, y: 200 }}
          style={{ width: graphWidth, height: graphHeight }}
          zoomingEnabled={true}
          maxZoom={1.5}
          minZoom={0.3}
          autounselectify={false}
          boxSelectionEnabled={true}
          layout={layout}
          stylesheet={styleSheet}
          cy={(cy) => {
            // myCyRef.current = cy;
            console.log("EVT", cy);

            cy.on("tap", "node", (evt) => {
              var node = evt.target;
              console.log("EVT", evt);
              console.log("TARGET", node.data());
              console.log("TARGET TYPE", typeof node[0]);
            });
          }}
          // abc={console.log("myCyRef", myCyRef)}
        />
      </div>
    </div>
  );
}
