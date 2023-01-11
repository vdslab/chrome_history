import React from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import cola from "cytoscape-cola";

cytoscape.use(cola);

export default function HistoryChart() {
  return (
    <div>
      <p>以下に描画</p>
    </div>
  );
}
