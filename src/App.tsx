import React, { useCallback } from "react";
import "./App.css";
import { ForceGraph2D } from "react-force-graph";
import data from "./kongweilifemap.json";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

type NodeObject$3 = object & {
  id?: string | number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

const App = () => {
  let initialAnchor: number = 0;
  let initialNode: NodeObject$3 = {
    id: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    fx: 0,
    fy: 0
  };
  const [anchorX, setAnchorX] = React.useState(initialAnchor);
  const [anchorY, setAnchorY] = React.useState(initialAnchor);
  const [selectedNode, setSelectedNode] = React.useState(initialNode);
  const [textValue, setTextValue] = React.useState("");

  const updatedData = data;

  const updateId = (oldId: string, newId: string) => {
    for (var i = 0; i < updatedData.nodes.length; i++) {
      if (updatedData.nodes[i].id === oldId) {
        updatedData.nodes[i].id = newId;
        return;
      }
    }
  };

  const handleClick = (node: NodeObject$3, event: MouseEvent) => {
    setAnchorX(event.x);
    setAnchorY(event.y);
    setTextValue(node.id ? node.id.toString() : "");
    setSelectedNode(node);
  };

  const handleClose = () => {
    setAnchorX(0);
    setAnchorY(0);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
    updateId(
      selectedNode.id ? selectedNode.id.toString() : "",
      event.target.value
    );
  };

  const open = Boolean(anchorX && anchorY);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchorY, left: anchorX }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <TextField
          id="outlined-multiline-static"
          label="Details"
          multiline
          rows={6}
          variant="outlined"
          onChange={handleTextChange}
          style={{ margin: 24 }}
          value={textValue}
        />
      </Popover>
      <ForceGraph2D
        graphData={updatedData}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={5}
        onNodeClick={handleClick}
      />
    </div>
  );
};

export default App;
