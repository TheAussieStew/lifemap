import React from "react";
import { QiId } from "../core/Model";
import { QiStore, QiStoreContext } from "../backend/QiStore";
import { QiView } from "../view/QiView";

export const Qi = (props: { qiId: QiId; userId: string }) => {
  return (
    // This store is not visual, it is purely to feed information
    // @ts-ignore
    <QiStore qiId={props.qiId} userId={props.userId}>
      {/* Use the qi in QiStore 
      This seemingly gets the wrong qi, the default value, rather than
      the store provided one
      */}
      <QiView qi={React.useContext(QiStoreContext)} />
    </QiStore>
  );
};
