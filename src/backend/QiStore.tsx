import React from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { QiC, QiId, QiT } from "../core/Model";

// Handles storing and syncing information from a single qi to the database
export const QiStoreContext = React.createContext<QiT>(new QiC());

export const QiStore = (props: { qiId: QiId, userId: string, children: JSX.Element}) => {
  // Initialise an empty ydoc to fill later with data from IndexedDB
  const qi = new QiC()

  const roomName = props.qiId

  const appId = 'dy9wzo9x'

  // Persist the document using the cloud provider
  new TiptapCollabProvider({ 
    appId: appId,// get this at collab.tiptap.dev
    name: roomName, // e.g. a uuid uuidv4();
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODQxNDQ5MDAsIm5iZiI6MTY4NDE0NDkwMCwiZXhwIjoxNjg0MjMxMzAwLCJpc3MiOiJodHRwczovL2NvbGxhYi50aXB0YXAuZGV2IiwiYXVkIjoia29uZ3dlaUBldXNheWJpYS5jb20ifQ.bUsMJ8W_T15zk0PWdiBddMeVLNyppDlI6g7Vr3dIA3s', // see "Authentication" below
    document: qi.information
  });

  //  Persist the document locally
  new IndexeddbPersistence(roomName, qi.information)

  return (
    <QiStoreContext.Provider value={qi}>
      {props.children}
    </QiStoreContext.Provider>
  );
}