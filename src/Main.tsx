import React from "react";
import "./App.css";
import { Header, Demo } from "./view/Muuri";
import "./style.css";
import localGraph from "./assets/kongweilifemap.json";
import { useEffect, useRef } from "react";
import { MuuriComponent } from "muuri-react";
import { Graph, GraphObj, GraphOps, Qi } from "./core/LifeGraphModel";
import { initialisedGraph } from "./core/Initialiser";
import { RenderedListPoints } from "./view/View";
import { db } from "./backend/database";

const Main = () => {
  const [graphData, setGraphData] = React.useState<Graph>();

  // load graph from local
  setGraphData(GraphOps.parse(localGraph));



  // Item component.
  const TextViewQi: Qi = { id: 0, information: "Text View" };
  const GraphViewQi: Qi = { id: 1, information: "Graph View" };
  const panes = [GraphViewQi, TextViewQi];
  const [items, setItems] = React.useState(panes);
  const children = items.map((props) => <Item key={props.id} {...props} />);

  return (
    <div>
      <MuuriComponent dragEnabled>{children}</MuuriComponent>
    </div>
  );
};

export default Main;
