import React, { useEffect, useMemo, useRef } from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import cola from "cytoscape-cola";
import { defaultLayout, styleSheet } from "../../chartGlobalConst";

cytoscape.use(cola);

export default function VisitsChart({ nodes, links, family }) {
  const cyRef = useRef(null);

  const { graphData } = useMemo(() => {
    if (nodes.length === 0) {
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
      };
    });

    const nodedata = nodeBodyData.concat(nodeGhostData);

    const linkdata = links.map(({ data }) => {
      if (data.isBack) {
        return {
          data: {
            target: data.source,
            source: `ghost-${data.target}`,
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
  }, [nodes, links, family]);

  useEffect(() => {
    const cy = cyRef.current;
    if (cy === null) {
      console.log("cy null");
      return;
    }

    const layout = { ...defaultLayout };
    const stopEvent = () => {
      cy.nodes().positions((node, i) => {
        node.ungrabify();

        if (node.data("type") == "ghost") {
          const ghostTarget = node.data("id").split("-")[1];

          return {
            x: cy.$id(ghostTarget).position("x"),
            y: cy.$id(ghostTarget).position("y"),
          };
        }

        return {
          x: node.position("x"),
          y: node.position("y"),
        };
      });
    };

    layout.stop = stopEvent;

    if (!family || family.length === 0) {
      console.log("family null");
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
    // layout.alignment = { vertical: rootVerticalAlignment };

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

    // const constraintHorizontalArrays = family.map(({ data: { children } }) => {
    //   if (children.length <= 1) {
    //     return;
    //   }

    //   const constraints = children.map((id, index) => {
    //     if (index === children.length - 1) {
    //       return;
    //     }

    //     return {
    //       axis: "x",
    //       left: cy.$id(id),
    //       right: cy.$id(children[index + 1]),
    //       gap: 75,
    //     };
    //   });

    //   return constraints.filter((item) => item);
    // });

    // const constraintorizontal = constraintHorizontalArrays
    //   .filter((item) => item)
    //   .reduce((data, current) => current.concat(data), []);

    const constraints = constraintVertical;
    // .concat(constraintorizontal);

    layout.gapInequalities = constraints;

    // const bodyNodes = cy.filter("node[type='node']");
    // bodyNodes.forEach((node) => {
    //   cy.$id(`ghost-${node.data().id}`).position("x", node.position("x"));
    // });

    cy.layout(layout).run();
  }, [graphData]);

  if (graphData === null) {
    return (
      <div>
        <p>no graphData</p>
      </div>
    );
  }

  const width = "800px";
  const height = "600px";
  const graphWidth = "100%";
  const graphHeight = "70vh";
  const layout = { ...defaultLayout };

  return (
    <div>
      <div>
        <CytoscapeComponent
          elements={CytoscapeComponent.normalizeElements(graphData)}
          // pan={{ x: 200, y: 200 }}
          style={{ width: graphWidth, height: graphHeight }}
          zoomingEnabled={true}
          maxZoom={1.5}
          minZoom={0.05}
          wheelSensitivity={0.5}
          autounselectify={false}
          boxSelectionEnabled={true}
          layout={layout}
          stylesheet={styleSheet}
          cy={(cy) => {
            // console.log("EVT", cy);
            cyRef.current = cy;

            // cy.on("tap", "node", (evt) => {
            // var node = evt.target;
            // console.log("EVT", evt);
            // console.log("TARGET", node.data().position());
            // console.log("TARGET TYPE", typeof node[0]);
            // console.log("TARGET URL", node.data().url);
            // chrome.tabs.create({ url: node.data().url });
            // });
          }}
        />
      </div>
    </div>
  );
}
