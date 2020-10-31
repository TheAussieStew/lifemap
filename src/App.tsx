import React from "react";
import "./App.css";
import { ForceGraph2D } from "react-force-graph";
import data from "./kongweilifemap.json";

function App() {
  return (
    <ForceGraph2D
      graphData={data}
      nodeLabel="id"
      nodeAutoColorBy="group"
      linkDirectionalParticles="value"
      linkDirectionalParticleSpeed={0.01}
    />
  );
}

export default App;
