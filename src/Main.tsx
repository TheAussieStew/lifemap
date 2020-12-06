import React from "react";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import "./App.css";
/* Utils & components */
import { Header, Demo } from "./components/Muuri";
import "./style.css";
import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphMethods$2,
} from "react-force-graph";
import data from "./assets/kongweilifemap.json";
import firebase from "firebase";
import "firebase/database";
import { useEffect, useRef } from "react";
import { MuuriComponent, useDrag } from "muuri-react";
import { Box, Card } from "@material-ui/core";
import { lgm } from "./core/LifeGraphModel";

var firebaseConfig = {
  apiKey: "AIzaSyCqulAS9_9MHrnn0ly8zQpQR3QDBSFl5Oo",
  authDomain: "lifemap-31c67.firebaseapp.com",
  databaseURL: "https://lifemap-31c67.firebaseio.com",
  projectId: "lifemap-31c67",
  storageBucket: "lifemap-31c67.appspot.com",
  messagingSenderId: "908420793581",
  appId: "1:908420793581:web:43079e2e62752ab77038e4",
};

const kongweiUserId: number = 1;

let useDatabase = false;
let resetDatabaseToLocal = true;

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

// TODO: Really need to figure out typing for the graph
let initialGraph = {
  nodes: [{ id: "Life", group: 0 }],
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

const Main = () => {
  const [graphData, setGraphData] = React.useState<any>(data);
  const [selectedNodes, setSelectedNodes] = React.useState<NodeObject$3[]>([]);
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
        } else {
          setGraphData(initialGraph);
        }
        console.log("graph data after load", graphData);
      });
    }

    window.addEventListener("resize", updateDimensions);

    if (null !== fgRef.current && undefined !== fgRef.current) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        4,
        0.9,
        0.1
      );
      fgRef.current.postProcessingComposer().addPass(bloomPass);
    }

    return () => {
      if (useDatabase) graphDataRef.off();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const pushSelectedNodes = (node: NodeObject$3) => {
    let newSelectedNodes = selectedNodes;
    if (newSelectedNodes.push(node) > 2) {
      newSelectedNodes.shift(); // a queue
    }
    setSelectedNodes(newSelectedNodes);
  };

  const deleteLink = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let id = selectedNodes.slice(-1)[0].id;
    let newNodeData = graphData.nodes;
    let newLinkData = graphData.links.filter((elem: any) => {
      if (elem.source.id === id || elem.target.id === id) {
        return;
      }
      return elem;
    });
    let newGraphData = { nodes: newNodeData, links: newLinkData };
    setGraphData(newGraphData);
  };

  const deleteNode = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
    let newGraphData = { nodes: newNodeData, links: newLinkData };
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
          source: selectedNodes[selectedNodes.length - 1].id
            ? selectedNodes[selectedNodes.length - 1].id!.toString()
            : "",
          target: randomString,
          value: 1,
          curvature: 0.6,
        },
      ],
    });
  };

  const handleLinkClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (selectedNodes.length === 2) {
      addLink(selectedNodes[0], selectedNodes[1]);
    }
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

  const initialisedForceGraph3D = (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      nodeLabel="id"
      nodeResolution={7}
      width={600}
      height={600}
      linkCurvature="curvature"
      nodeAutoColorBy="group"
      linkDirectionalParticles="value"
      linkDirectionalParticleSpeed={0.005}
      linkDirectionalParticleWidth={2}
      linkWidth={0.5}
      onNodeClick={() => {}}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(node.id ? node.id.toString() : "");
        // sprite.color = node.color;
        sprite.textHeight = 2;
        sprite.position.set(0, -8, 0);
        sprite.color = "#000000";
        sprite.strokeWidth = 0.5;
        sprite.strokeColor = "#888888";
        sprite.padding = 1;
        return sprite;
      }}
      nodeThreeObjectExtend={true}
    />
  );

  const Item = (qi: lgm.Qi) => {
    const isDragging = useDrag();
    const shadowHeight = isDragging ? 20 : 1;
    const cardTitle = isDragging ? "Release me!" : qi.information;

    return (
      // Outer Grid Element, used by Muuri for positioning
      <Box
        style={{
          transition: "box-shadow 0.2s",
          width: "40vw",
          height: "90vh",
          margin: "10px",
          cursor: "grab",
          position: "absolute",
          zIndex: 1,
        }}
        boxShadow={shadowHeight}
        className={"item"}
      >
        {/* Inner Grid Element, used by Muuri for animation */}
        <div className="item-content">
          {/* Custom content here */}
          {cardTitle}
          {qi.information === "Graph View" ? (
            initialisedForceGraph3D
          ) : (
            <Card style={{marginTop: 20}} >{JSON.stringify(data).slice(0, 200)}</Card>
             
          )}
        </div>
      </Box>
    );
  };

  // Item component.
  const TextViewQi: lgm.Qi = {id: 0, information: "Text View"};
  const GraphViewQi: lgm.Qi = {id: 1, information: "Graph View"};
  const panes = [GraphViewQi, TextViewQi];
  const [items, setItems] = React.useState(panes);
  const children = items.map((props) => <Item key={props.id} {...props} />);

  return (
    <div>
      <MuuriComponent dragEnabled>{children}</MuuriComponent>
    </div>
  );
};;

export default Main;
