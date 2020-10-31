import React from "react";
import "./App.css";
import { ForceGraph2D } from "react-force-graph";
import data from "./miserables.json";

function App() {
  return (
    <ForceGraph2D
      graphData={data}
      nodeLabel="id"
      nodeAutoColorBy="group"
      linkDirectionalParticles="value"
      linkDirectionalParticleSpeed={0.001}
    />
  );
}

export default App;
