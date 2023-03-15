import React from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { QiC, QiId, QiT, ShenT } from "../core/Model";

// Handles storing and syncing information from a single qi to the database
export const QiStoreContext = React.createContext<QiT>(new QiC());

export const QiStore = (props: { qiId: QiId, userId: string, children: JSX.Element}) => {
  // Initialise an empty ydoc to fill later with data from IndexedDB
  const qi = new QiC()
  qi.type = "StoreCreatedQi"

  const roomName = props.qiId

  // Sync the contents of the room with the empty ydoc
  new IndexeddbPersistence(roomName, qi.information)

  return (
    <QiStoreContext.Provider value={qi}>
      {props.children}
    </QiStoreContext.Provider>
  );
}