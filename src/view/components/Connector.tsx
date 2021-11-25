import { motion } from "framer-motion";
import { action, autorun, toJS } from "mobx";
import { Observer, observer, useLocalObservable } from "mobx-react-lite";
import React from "react";

const Connector = observer(
  (props: {
    elementAAnchor: { x: number; y: number };
    elementBAnchor: { x: number; y: number };
  }) => {
    return (
      <motion.svg width="100%" height={1000}>
        <motion.path
          d={`M${props.elementAAnchor.x},${props.elementAAnchor.y},${props.elementBAnchor.x},${props.elementBAnchor.y}`}
          strokeWidth="3"
          stroke="black"
        />
        {/* <motion.line
        stroke-width="1px"
        stroke="#000000"
        x1={props.elementAAnchor.x}
        y1={props.elementAAnchor.y}
        x2={props.elementBAnchor.x}
        y2={props.elementBAnchor.y}
        id="mySVG"
      /> */}
      </motion.svg>
    );
  }
);

export const RefinedConnector = observer(
  (props: { elementAId: string; elementBId: string; tick: boolean }) => {
    let elementAAnchor = useLocalObservable(() => ({ x: 0, y: 0 }));
    let elementBAnchor = useLocalObservable(() => ({ x: 0, y: 0 }));

    const getBoundingClientRect = (id: string) => {
      return document.getElementById(id)?.getBoundingClientRect();
    };
    if (props.tick) {
      console.log("updating connector");
      let update = action(() => {
        let elemARect = getBoundingClientRect(props.elementAId);
        let elemBRect = getBoundingClientRect(props.elementBId);
        if (elemARect) {
          elementAAnchor.x = (elemARect.left + elemARect.right) / 2;
          elementAAnchor.y = (elemARect.top + elemARect.bottom) / 2;
          console.log("elemA coords", toJS(elementAAnchor));
        }
        if (elemBRect) {
          elementBAnchor.x = (elemBRect.left + elemBRect.right) / 2;
          elementBAnchor.y = (elemBRect.top + elemBRect.bottom) / 2;
          console.log("elemB coords", toJS(elementBAnchor));
        }
      });
      update()
    }

    return (
      <>
        <div style={{ position: "fixed", height: "100%", width: "100%", zIndex: 20 }}>
          <motion.svg width="100%" height={1000}>
            <motion.path
              d={`M${elementAAnchor.x},${elementAAnchor.y},${elementBAnchor.x},${elementBAnchor.y}`}
              strokeWidth="3"
              stroke="black"
            />
            {/* <motion.line
        stroke-width="1px"
        stroke="#000000"
        x1={props.elementAAnchor.x}
        y1={props.elementAAnchor.y}
        x2={props.elementBAnchor.x}
        y2={props.elementBAnchor.y}
        id="mySVG"
      /> */}
          </motion.svg>
        </div>
      </>
    );
  }
);

const ExampleConnector = () => {
  let elementAAnchor = useLocalObservable(() => ({ x: 0, y: 0 }));
  let elementBAnchor = useLocalObservable(() => ({ x: 100, y: 200 }));

  const getBoundingClientRect = (id: string) => {
    return document.getElementById(id)?.getBoundingClientRect();
  };
  const tick = action(() => {
    let elemARect = getBoundingClientRect("blue");
    let elemBRect = getBoundingClientRect("red");
    if (elemARect) {
      elementAAnchor.x = (elemARect.left + elemARect.right) / 2;
      elementAAnchor.y = (elemARect.top + elemARect.bottom) / 2;
    }
    if (elemBRect) {
      elementBAnchor.x = (elemBRect.left + elemBRect.right) / 2;
      elementBAnchor.y = (elemBRect.top + elemBRect.bottom) / 2;
    }
  });
  return (
    <>
      <div style={{ position: "fixed", height: "100%", width: "100%" }}>
        <motion.div
          drag
          onUpdate={() => {
            tick();
          }}
          id="blue"
          style={{
            borderRadius: 20,
            width: 100,
            height: 100,
            background: "blue",
          }}
        />
        <motion.div
          drag
          onUpdate={() => {
            tick();
          }}
          id="red"
          style={{
            borderRadius: 20,
            width: 100,
            height: 100,
            background: "red",
          }}
        />
      </div>
      <Connector
        elementAAnchor={elementAAnchor}
        elementBAnchor={elementBAnchor}
      />
    </>
  );
};

const Demo = () => {
  return (
    <>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
      <div
        id="div1"
        style={{
          width: 100,
          height: 100,
          top: 0,
          left: 0,
          background: "#e53935",
          position: "absolute",
        }}
      ></div>
      <div
        id="div2"
        style={{
          width: 100,
          height: 100,
          top: 0,
          left: 300,
          background: "#4527a0",
          position: "absolute",
        }}
      ></div>
      <svg>
        <line x1="50" y1="50" x2="350" y2="50" stroke="red" />
      </svg>
    </>
  );
};
