import { Box, Card } from "@material-ui/core";
import { MuuriComponent, useDrag } from "muuri-react";
import React from "react";
// These imports shouldnt be here in this file, just for testing
import { Graph, Qi, GraphObj, GraphOps } from "../core/LifeGraphModel";

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

// Lens Grid - how different lenses are arranged
type LensGrid = unknown;

// Lens - a composition of all optical elements
type Lens = Style[] & Filter[] & Optic;

// Style - visualise saliency and entropy
type Style = unknown;

// Filter - an overlay of information
type Filter = Clear | Censored | RoseTinted | QiField;
type Clear = { type: "Clear" };
type Censored = { type: "Censored" };
type RoseTinted = { type: "RoseTinted" };
type QiField = { type: "QiField" };

// Optic - viewing information as a certain structure
// it should be like: JSX[GraphNode] a wrapper around graph node, leave for future
type Optical = (q: Qi) => JSX.Element;
const NestedList: Optical = (q: Qi) => {
  return (<div></div>);
}
type Optic =
  | List // 1.5D but 1D on phones
  | Code // 1.5D
  | Masonry // 2D
  | GraphStructure // 2D or 3D
  | Table // 2D
  | SpaceTime // 2D or 3D or even 4D?
  | LightCone
  | Calendar
  | Embed; 
type Code = unknown;
type List = ListNumber | ListPoints | ListChecks; // should be collapsable
type ListNumber = unknown;
type ListPoints = unknown;
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

type Visualise = (q: Qi) => JSX.Element;
const Cardify: Visualise = (q: Qi) => {
  return (
      <Card style={{ textAlign: "left", marginLeft: 3 * 15 }}>
        {"• " + q.meaning}
      </Card>
  );
};