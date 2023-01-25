import React, { useEffect, useMemo, useRef, useState } from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import cola from "cytoscape-cola";

// TODO: グローバル変数でいいの？
const defaultLayout = {
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
  unconstrIter: 5, // unconstrained initial layout iterations
  userConstIter: 5, // initial layout iterations with user-specified constraints
  allConstIter: 5, // initial layout iterations with all constraints including non-overlap
};

cytoscape.use(cola);

export default function HistoryChart({ nodes, links, family }) {
  const cyRef = useRef(null);

  const { graphData } = useMemo(() => {
    // const { nodes, links } = props;
    if (nodes.length === 0 || links.length === 0) {
      return { graphData: null };
    }

    const nodeBodyData = nodes.map(({ data }) => {
      return {
        data: {
          id: data.id,
          label: data.title,
          type: "node",
          url: data.url,
        },
      };
    });

    const nodeGhostData = nodes.map(({ data }) => {
      return {
        data: {
          id: `ghost-${data.id}`,
          label: "ghost",
          type: "ghost",
        },
        // locked: true,
      };
    });

    const nodedata = nodeBodyData.concat(nodeGhostData);
    // const nodedata = nodeBodyData;
    console.log("link", links);
    console.log("family", family);

    const linkdata = links.map(({ data }) => {
      if (data.back) {
        return {
          data: {
            target: data.source,
            // source: `ghost-${data.target}`,
            source: data.target,
            isBack: data.isBack,
          },
        };
      }
      return {
        data: {
          target: data.target,
          source: data.source,
          isBack: data.isBack,
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

    const graphData = {
      nodes: nodedata,
      edges,
    };

    return { graphData };
  }, [nodes, links]);

  useEffect(() => {
    const cy = cyRef.current;
    if (cy === null) {
      return;
    }

    const layout = defaultLayout;

    if (family.length === 0) {
      cy.layout(layout).run();
      return;
    }

    // const verticalArrays = family.map(({ data: { parent, children } }) => {
    //   const childrenNode = children.map((id, index) => {
    //     return { node: cy.$id(id), offset: 50 * index };
    //   });
    //   return childrenNode.map((node) => {
    //     return [{ node: cy.$id(parent), offset: 0 }, node];
    //   });
    // });

    // const vertical = verticalArrays.reduce(
    //   (data, current) => current.concat(data),
    //   []
    // );

    const constraintVerticalArrays = family.map(
      ({ data: { parent, children } }) => {
        return children.map((id) => {
          return {
            axis: "y",
            left: cy.$id(parent),
            right: cy.$id(id),
            gap: 75,
          };
        });
      }
    );
    const constraintVertical = constraintVerticalArrays.reduce(
      (data, current) => current.concat(data)
    );

    const constraintHorizontalArrays = family.map(({ data: { children } }) => {
      if (children.length <= 1) {
        return;
      }

      const constraints = children.map((id, index) => {
        if (index === children.length - 1) {
          return;
        }

        return {
          axis: "x",
          left: cy.$id(id),
          right: cy.$id(children[index + 1]),
          gap: 75,
        };
      });

      return constraints.filter((item) => item);
    });

    const constraintorizontal = constraintHorizontalArrays
      .filter((item) => item)
      .reduce((data, current) => current.concat(data), []);
    console.log("reduce", constraintorizontal);

    const constraints = constraintVertical.concat(constraintorizontal);
    console.log("concat", constraints);

    // layout.alignment = { vertical: rootVerticalAlignment };
    layout.gapInequalities = constraints;

    const bodyNodes = cy.filter("node[type='node']");
    bodyNodes.forEach((node) => {
      cy.$id(`ghost-${node.data().id}`).position("x", node.position("x"));
    });

    cy.layout(layout).run();
  }, [graphData]);

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

  const layout = defaultLayout;

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
      selector: "node[type='ghost']",
      style: {
        shape: "rectangle",
        // disply: none,
        opacity: 0,
        // visibility: "hidden",
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
        "curve-style": "unbundled-bezier",
      },
    },
    {
      selector: "edge[?isBack]",
      style: {
        width: 3,
        "line-color": "#6774cb",
        // "line-color": "#AAD8FF",
        "target-arrow-color": "#ff74cb",
        "target-arrow-shape": "triangle",
        "source-arrow-shape": "triangle",
        "curve-style": "unbundled-bezier",
      },
    },
  ];

  // console.log(CytoscapeComponent.normalizeElements(graphData));

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
            console.log("EVT", cy);
            cyRef.current = cy;
            // console.log("EVT", cy);

            cy.on("tap", "node", (evt) => {
              var node = evt.target;
              console.log("EVT", evt);
              console.log("TARGET", node.data().position());
              console.log("TARGET TYPE", typeof node[0]);
              console.log("TARGET URL", node.data().url);
              // chrome.tabs.create({ url: node.data().url });
            });
          }}
          // abc={console.log("myCyRef", myCyRef)}
        />
      </div>
    </div>
  );
}
