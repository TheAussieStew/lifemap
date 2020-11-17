import React from "react";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import "./App.css";
import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphMethods$2,
} from "react-force-graph";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import data from "./kongweilifemap.json";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import "firebase/database";
import { useEffect, useRef } from "react";

var firebaseConfig = {
  apiKey: "AIzaSyCqulAS9_9MHrnn0ly8zQpQR3QDBSFl5Oo",
  authDomain: "lifemap-31c67.firebaseapp.com",
  databaseURL: "https://lifemap-31c67.firebaseio.com",
  projectId: "lifemap-31c67",
  storageBucket: "lifemap-31c67.appspot.com",
  messagingSenderId: "908420793581",
  appId: "1:908420793581:web:43079e2e62752ab77038e4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.database();

type NodeObject$3 = object & {
  id?: string | number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

const kongweiUserId: number = 1;

// TODO: Really need to figure out typing for the graph
let initialGraph = {
  nodes: [
    { id: "Life", group: 0 },
  ],
  links: [],
};
let initialLinkedGraph = {
  nodes: [
    { id: "Life", group: 0 },
    { id: "Topic", group: 1 },
  ],
  links: [{ source: "Life", target: "Topic", curvature: 0.6, index: 0 }],
};
let initialAnchor: number = 0;

let useDatabase = true;
let resetDatabaseToLocal = false;

// Post issue here https://github.com/vasturiano/react-force-graph/issues/234

const Main = () => {
  const [graphData, setGraphData] = React.useState<any>(initialGraph);
  const [anchorX, setAnchorX] = React.useState(initialAnchor);
  const [anchorY, setAnchorY] = React.useState(initialAnchor);
  const [selectedNodes, setSelectedNodeArray] = React.useState<NodeObject$3[]>([]);
  const [textValue, setTextValue] = React.useState("");
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const fgRef = useRef<ForceGraphMethods$2 | undefined>(undefined);

  var graphDataRef = firebase
    .database()
    .ref("users/" + kongweiUserId + "/graphData");

  useEffect(() => {
    if (resetDatabaseToLocal) {
      useDatabase = false;
      writeGraphData(kongweiUserId, JSON.parse(JSON.stringify(graphData)));
    }

    if (useDatabase) {
      graphDataRef.on("value", (snapshot) => {
        console.log("initial graph data before load from server", graphData);
        console.log("graph data from firebase", snapshot.val());
        if ("links" in snapshot.val()) {
          setGraphData(snapshot.val());
        }
        else {
          setGraphData(initialGraph);
        }
        console.log("graph data after load", graphData);
      });
    }

    window.addEventListener("resize", updateDimensions);

    if (null !== fgRef.current && undefined !== fgRef.current) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0,
        0,
        0
      );
      bloomPass.strength = 4;
      bloomPass.radius = 0.9;
      bloomPass.threshold = 0.1;
      fgRef.current.postProcessingComposer().addPass(bloomPass);
    }

    // cleanup this component
    return () => {
      if (useDatabase) graphDataRef.off();
      window.removeEventListener("resize", updateDimensions);
      console.log("listener dismounted");
    };
  }, []);

  const pushSelectedNodeArray = (node: NodeObject$3) => {
    let newSelectedNodeArray = selectedNodes;
    if (newSelectedNodeArray.push(node) > 2) {
      newSelectedNodeArray.shift(); // a queue
    }
    setSelectedNodeArray(newSelectedNodeArray);
  }

  const updateNodeId = (oldId: string, newId: string) => {
    for (var i = 0; i < graphData.nodes.length; i++) {
      if (graphData.nodes[i].id === oldId) {
        graphData.nodes[i].id = newId;
        return;
      }
    }
  };

  const deleteNode = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("before delete node", graphData);
    let id = selectedNodes.slice(-1)[0].id;
    let newNodeData = graphData.nodes.filter((elem: any) => {
      if (elem.id === id || elem.target === id) {
        return;
      }
      return elem;
    });
    let newLinkData = graphData.links.filter((elem: any) => {
      if (elem.source.id === id || elem.target.id === id) {
        return;
      }
      return elem;
    });
    let newGraphData = {nodes: newNodeData, links: newLinkData};
    setGraphData(newGraphData);
    console.log("after delete node", graphData);
  };

  const addNode = (id: string) => {
    graphData.nodes.push({ id: id, group: 1 });
    setGraphData(graphData);
  };

  const addLink = (nodeSource: NodeObject$3, nodeTarget: NodeObject$3) => {
    setGraphData({
      nodes: [...graphData.nodes],
      links: [
        ...graphData.links,
        {
          source: nodeSource.id ? nodeSource.id.toString() : "",
          target: nodeTarget.id ? nodeTarget.id.toString() : "",
          value: 1,
          curvature: 0.6,
        },
      ],
    });
  };

  const addChild = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const randomString = Math.random().toString(36).slice(2);
    setGraphData({
      // TODO: Figure out how to have the correct colour
      // TODO: Maybe have a pass function that auto assigns groups, and have cool colours
      nodes: [...graphData.nodes, { id: randomString, group: 1 }],
      links: [
        ...graphData.links,
        {
          source: selectedNodes[selectedNodes.length - 1].id ? selectedNodes[selectedNodes.length - 1].id!.toString() : "",
          target: randomString,
          value: 1,
          curvature: 0.6,
        },
      ],
    });
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (selectedNodes.length === 2) {
      addLink(selectedNodes[0], selectedNodes[1]);
    }
  }

  const handleNodeClick = (node: NodeObject$3, event: MouseEvent) => {
    setAnchorX(event.x);
    setAnchorY(event.y);
    setTextValue(node.id ? node.id.toString() : "");
    pushSelectedNodeArray(node);
    // setSelectedNode(node);
    console.log("current graph data", graphData);
  };

  const handleClose = () => {
    setAnchorX(0);
    setAnchorY(0);
    console.log("raw graph data being written", graphData);
    console.log(
      "parsed and stringified data",
      JSON.parse(JSON.stringify(graphData))
    );
    writeGraphData(kongweiUserId, JSON.parse(JSON.stringify(graphData)));
  };

  const replacer = (key: any, value: any) => {
    // Filtering out properties
    if (!resetDatabaseToLocal) {
      if (key === "source" || key === "target") {
        if (typeof value === "string") {
          return value;
        } else {
          return value.id;
        }
      }
    }
    return value;
  };

  const convertGraphDataToSimple = (graphData: any) => {
    return JSON.parse(JSON.stringify(graphData, replacer));
  };

  // TODO: need to represent graph data as a type
  const writeGraphData = (userId: number, graphData: any) => {
    console.log("data being uploaded", convertGraphDataToSimple(graphData));
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        username: userId,
        graphData: convertGraphDataToSimple(graphData),
      });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
    updateNodeId(
      selectedNodes.slice(-1)[0].id ? selectedNodes.slice(-1)[0].id!.toString() : "",
      event.target.value
    );
  };

  const open = Boolean(anchorX && anchorY);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Fab
        color="secondary"
        aria-label="edit"
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
        }}
      >
        <EditIcon />
      </Fab>
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
        <div style={{ flexDirection: "column", display: "flex", margin: 25 }}>
          <TextField
            id="outlined-multiline-static"
            label="Details"
            multiline
            rows={6}
            variant="outlined"
            onChange={handleTextChange}
            style={{ width: 300 }}
            value={textValue}
          />
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              marginTop: 15,
              justifyContent: "flex-end"
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLinkClick}
              style={{borderRadius: 40, textTransform: 'none', marginRight: 10}}
            >
              Link
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={addChild}
              style={{borderRadius: 40, textTransform: 'none', marginRight: 10}}
            >
              Add child
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={deleteNode}
              style={{borderRadius: 40, textTransform: 'none'}}
            >
              Delete
            </Button>
          </div>
        </div>
      </Popover>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeResolution={6}
        linkCurvature="curvature"
        nodeAutoColorBy="group"
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={2}
        linkWidth={0.5}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};

export default Main;
