import React from "react";
import { stringify } from "flatted";
import { Tiptap } from "../core/Tiptap";


// Optic - viewing Qi in a certain way
export type Optic =
  | Logging
  | Bubble
  | GraphOptic // 2D or 3D
type GraphOptic = Graph2D | Graph3D;
type Bubble = (q: QiT | ShenT) => JSX.Element[];
type Graph2D = (props: { q: QiT | ShenT }) => JSX.Element;
type Graph3D = (props: { q: QiT | ShenT }) => JSX.Element;

export type Logging = (props: { q: QiT | ShenT }) => JSX.Element;
export const LoggingCorrect: Logging = (props: {q: QiT | ShenT}) => {
  //TODO: Figure out how to manage circular data structures, on edit too
  return (
    <>
      <Tiptap
        content={`<pre><code class="language-javascript">${stringify(
          props.q,
          null,
          4
        )}</code></pre>`}
      />
    </>
  );
};
const ExampleLogging = () => <LoggingCorrect q={ExampleShen()} />;