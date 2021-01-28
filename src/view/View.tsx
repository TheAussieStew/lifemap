import { Card } from "@material-ui/core";
import React, { useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import { AlwaysMatch, Journal, QiCorrect, QiT } from "../core/LifeGraphModel";
import { type } from "os";

// Lens Grid - how different lenses are arranged
type LensGrid = unknown;

// Loupe - switching between different lenses
type Loupe = { lenses: Lens[]; selectedLens: Lens };

// Lens - a composition of all optical elements
type Lens = Distortion[] & Filter[] & Optic;

// Distortion - visualise saliency (font styling) and entropy
type Distortion = unknown;

// Filter - an overlay of information
type Filter = Clear | Censored | RoseTinted | QiField;
type Clear = { type: "Clear" };
type Censored = { type: "Censored" };
type RoseTinted = { type: "RoseTinted" };
type QiField = { type: "QiField" };

// Optic - viewing information as a certain structure
// it should be like: JSX[GraphNode] a wrapper around graph node, leave for future
type Optic =
  | Tree // 1.5D but 1D on phones
  | Code // 1.5D
  | Masonry // 2D
  | GraphOptic // 2D or 3D
  | Table // 2D
  | SpaceTime // 2D or 3D or even 4D?
  | LightCone
  | Calendar
  | Embed;
type Code = unknown;
export type Tree = (
  bag: QiT,
  journal: Journal,
  type: TreeType
) => JSX.Element[]; // should be collapsable
export type TreeType =
  | "Empty"
  | "Triangles"
  | "Points"
  | "Numbers"
  | "Points"
  | "Checkboxes";
export const TreeCorrect: Tree = (
  bag: QiT,
  journal: Journal,
  type: TreeType
) => {
  const [bagState, setBagState] = useState<QiT>(bag);
  const [bagItems, setBagItems] = useState<QiT[]>([bag]);
  for (let sibling of bag.siblings) {
    bagItems.push(sibling)
    setBagItems(bagItems);
  }
  let decorator: string = "";
  if (type === "Points") {
    decorator = "•";
  } else {
    decorator = "-";
  }
  return bagItems.map((item: QiT) => {
    const depth = journal.get(item)!.distToPrev;
    const onEnterPress = (ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === "Enter") {
        let {q1, sibling} = QiCorrect.createSibling(item);
        journal.set(item, {distToPrev: depth + 1});
        ev.preventDefault();
        bagItems.slice(0, bagItems.indexOf(item))
        + sibling + bagItems.slice(bagItems.indexOf(item), bagItems.lastIndexOf)
        setBagItems()
      }
    };
    <div style={{ marginLeft: depth * 15 }}>
      {decorator + " "}
      <InputBase
        onKeyPress={onEnterPress}
        defaultValue={item.meaning}
        inputProps={{ "aria-label": "naked" }}
      />
    </div>;
  });
};

type Masonry = unknown; // either evenly sized or unevenly sized grid that's packed together
type GraphOptic = Graph2D | Graph3D;
type Graph2D = unknown;
type Graph3D = unknown;
type Table = unknown;
type Kanban = Table; // Maybe this is the same as lightcone? (done, doing, to do, stuck?)
type SpaceTime = unknown; // what is this? same/diff to timeline? how to implement 4D?
type LightCone = unknown; // evolution of timeline
type Calendar = unknown; // what is this even
type Embed = unknown;
type Math = unknown; // should this be at Qi level?