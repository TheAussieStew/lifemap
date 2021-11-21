import React from "react";
import { ShenContext, Store } from "./core/Store";
import { Bubble } from "./view/Bubble";

const Main = () => {
  return (
    <Store>
      <ShenContext.Consumer>
        {(shen) => {
        console.log("shen from consumer", shen)
        return <Bubble q={shen} />}
        }
      </ShenContext.Consumer>
    </Store>
  );
};

export default Main;
