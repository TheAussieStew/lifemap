import React from "react";
import * as Y from 'yjs'
import { IndexeddbPersistence } from "y-indexeddb";
import { generateUniqueID } from '../utils/utils'

// Handles storing and syncing information from a single qi to the database
export const QiStore = (props: {children: any}) => {
  const ydoc = new Y.Doc()
  // A unique ID per document
  // const yDocumentName = generateUniqueID()
  // console.debug(yDocumentName)

  const roomName = props.roomName
  // Sync the contents of the room with the empty ydoc
  new IndexeddbPersistence(roomName, ydoc)

  const yarray = ydoc.getArray('equations')
  // Insert a single equation, I'm confused, will this be rendered automatically by TipTap if it uses this custom data structure?
  yarray.insert(0, [new Y.Text("1+1")]);
    const QiStoreContent = React.createContext<QiT>(DefaultQi());

    let qi: QiT | ShenT = React.useContext(QiStoreContent);

    return (
        <QiStoreContent.Provider value={qi}>
          {props.children}
        </QiStoreContent.Provider>
      );
}
