import React from "react";
import { ShenContext, Store } from "./core/Store";
import { Bubble } from "./view/Bubble";

const Main = () => {
  return (
    <Store>
      <Bubble q={React.useContext(ShenContext)} />
    </Store>
  )
};

export default Main;
