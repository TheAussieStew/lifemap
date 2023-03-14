import React from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { QiC, QiId, QiT, ShenT } from "../core/Model";

const qi1 = new QiC()
qi1.type = "ContextCreatedQi"

// Handles storing and syncing information from a single qi to the database
export const QiStoreContext = React.createContext<QiT>(qi1);

export const QiStore = (props: { qiId: QiId, userId: string, children: JSX.Element}) => {
  // Initialise an empty ydoc to fill later with data from IndexedDB
  const qi2 = new QiC()
  qi2.type = "StoreCreatedQi"

  const roomName = props.qiId

  // Sync the contents of the room with the empty ydoc
  new IndexeddbPersistence("000000", qi2.information)

  return (
    <QiStoreContext.Provider value={qi2}>
      {props.children}
    </QiStoreContext.Provider>
  );
}

export const QiStoreUsage = () => {
  let qi: QiT | ShenT = React.useContext(QiStoreContext);
}
