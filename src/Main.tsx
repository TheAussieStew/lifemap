import React from "react";
import { ShenContext, Store } from "./core/Store";
import { AlphaBubble, Bubble } from "./view/Bubble";

const Main = () => {
  return (
    <Store>
      <AlphaBubble q={React.useContext(ShenContext)} />
    </Store>
  );
};

export default Main;
