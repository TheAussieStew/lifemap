import { Card } from "@material-ui/core";
import React, { useContext, useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import { AlwaysMatch, Journal, JournalT, QiCorrect, QiT, ShenT } from "../core/LifeGraphModel";
import { type } from "os";
import { observer, useObserver } from "mobx-react-lite";
import { action } from "mobx";
import { GraphContext } from "../utils/Testing";

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
  q: QiT,
  journal?: JournalT,
  type?: TreeType
) => JSX.Element[]; // should be collapsable
export type TreeType =
  | "Empty"
  | "Triangles"
  | "Points"
  | "Numbers"
  | "Points"
  | "Checkboxes";
//@ts-ignore
export const TreeCorrect = observer((
) => {
  let decorator: string = "";
  decorator = "•";
  const divs: JSX.Element[] = [];
  let seen = new Set<QiT>();
  const result = useContext(GraphContext); // See the Timer definition above.
  let q = result.siblings[0];
  const recurse = (
    divs: JSX.Element[],
    q1: QiT,
    depth: number,
    seen: Set<QiT>
  ) => {
    const onEnterPress = action((ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === "Enter") {
        console.log("Enter Pressed");
        QiCorrect.createSibling(q1);
        ev.preventDefault();
      }
    });
    const onTextChange = action(
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        QiCorrect.changeQi(q1, event.target.value);
      }
    );
    divs.push(
      <div style={{ marginLeft: 10 + (depth * 15), marginBottom: -10}}>
        {decorator + " "}
        <InputBase
          onKeyPress={onEnterPress}
          onChange={onTextChange}
          defaultValue={q1.meaning}
          inputProps={{ "aria-label": "naked" }}
        />
      </div>
    );
    seen.add(q1);
    for (let sibling of q1.siblings) {
      if (!seen.has(sibling)) recurse(divs, sibling, depth + 1, seen);
    }
  };
  result.siblings.map((q: QiT) => recurse(divs, q, 0, seen));
  return divs;
});

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