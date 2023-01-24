import React from "react";
import { ShenContext, Store } from "./core/Store";
import { Group } from "./view/Group";

const Main = () => {
  return (
    <Store>
      <Group q={React.useContext(ShenContext)} />
    </Store>
  );
};

export default Main;
