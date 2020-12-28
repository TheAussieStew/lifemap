import { Box, Card } from "@material-ui/core";
import { MuuriComponent, useDrag } from "muuri-react";
import React from "react";
// These imports shouldnt be here in this file, just for testing
import { Graph, GraphObj, GraphOps } from "../core/LifeGraphModel";
import { Tree, TreeOps } from "./ViewModel";

export const Muuri = (t: Tree) => {
   const isDragging = useDrag();
   const shadowHeight = isDragging ? 20 : 1;
   return (
      <MuuriComponent dragEnabled>{children}</MuuriComponent>
   );
 };

export const MuuriItem = (qi: Qi) => {
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
           <Card style={{ margin: 20 }}>
             <RenderedListPoints />
           </Card>
         )}
       </div>
     </Box>
   );
 };

// View
type ViewModel = {
  portal: Portal;
};
type ViewOperations = {
};

// still need this?
type Portal = (Portal | View)[];

export const ViewOps = {
  renderView: (v: View) => {
      // stack lenses
      let customStyle: React.CSSProperties = {};
      switch (v.lens.type) {
        case "Censored":
          customStyle.backgroundColor = "#000000";
          break;
        case "Clear":
          break;
        case "RoseTinted":
          break;
        case "QiField": // this appears to need information from qi
          break;
      }
      v.comp.props = {style: customStyle};
      return v.comp;
  },
};

type View = {
  lens: Lens; // how do you write functions which are composable? yes, after composing they should be the same type
  comp: JSX.Element;
};
export class ViewObj implements View {
  lens: Lens; 
  comp: JSX.Element;

  constructor(lens: Lens, comp: JSX.Element) {
    this.lens = lens;
    this.comp = comp;
  }
}

// Lens - different ways of viewing information
type Lens = Clear | Censored | RoseTinted | QiField;
type Clear = { type: "Clear" };
type Censored = { type: "Censored" };
type RoseTinted = { type: "RoseTinted" };
type QiField = { type: "QiField" };

// Structure - configurations of information
type Structure =
  | Code // 1.5D
  | List // 1.5D but 1D on phones
  | Masonry // 2D
  | GraphStructure // 2D or 3D
  | Table // 2D
  | SpaceTime // 2D or 3D or even 4D?
  | LightCone
  | Calendar
  | Embed; 
type Code = unknown;
type List = ListNumber | ListPoints | ListChecks; // should be collapsable
export type ListNumber = (t: Tree) => JSX.Element;
export type ListPoints = (t: Tree) => JSX.Element;
type ListChecks = unknown;
type Masonry = unknown; // either evenly sized or unevenly sized grid that's packed together
type GraphStructure = Graph2D | Graph3D;
type Graph2D = unknown;
type Graph3D = unknown;
type Table = unknown;
type Kanban = Table; // Maybe this is the same as lightcone? (done, doing, to do, stuck?)
type SpaceTime = unknown; // what is this? same/diff to timeline? how to implement 4D?
type LightCone = unknown; // evolution of timeline
type Calendar = unknown; // what is this even
type Embed = unknown;
type Math = unknown; // should this be at Qi level?

// Issues with card duplication, recursive maybe not the best for this..
export const RenderedListPoints: ListPoints = (t: Tree) => {
  let divElems: JSX.Element[] = [];
  for (let miniTree of t.children) {
    divElems.push(RenderedListPoints(miniTree));
  }
  let elem = (
    <Card style={{}}>
      <Card style={{ textAlign: "left", marginLeft: t.rootDist * 15 }}>
        {"• " + t.qi.meaning}
      </Card>
      {divElems}
    </Card>
  );
  return elem;
};
