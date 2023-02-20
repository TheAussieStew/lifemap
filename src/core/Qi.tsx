import React from "react";
import { QiStore } from "../backend/QiStore";
import { QiView } from "../view/QiView";

export const Qi = (props: { qi: QiIdT; userId: string }) => {
  return (
    // This store is not visual, it is purely to feed information
    <QiStore qiId={props.qi} userId={props.userId}>
      <QiView qi={React.useContext(QiStoreContent)} />
    </QiStore>
  );
};
