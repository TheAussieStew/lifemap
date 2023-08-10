'use client'

import React from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { QiC, QiId, QiT } from "../core/Model";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../app/page";

// Handles storing and syncing information from a single qi to the database
export const QiStoreContext = React.createContext<QiT>(new QiC());

export const QiStore = (props: { qiId: QiId, userId: string, children: JSX.Element}) => {
  // Initialise an empty yDoc to fill with data from TipTap Collab (online) and IndexedDB (offline)
  const qi = new QiC()

  // Anyone accessing this particular "room" will be able to make changes to the doc
  // The room can also be understood to be the unique id of each qi
  const roomName = props.qiId

  const appId = 'dy9wzo9x'

  //  Sync the document locally
  new IndexeddbPersistence(roomName, qi.information)

  // Generate a JWT Auth Token to verify the user 
  let jwt = ""
  const generateAuthenticationToken = httpsCallable(functions, 'generateAuthenticationToken');
  generateAuthenticationToken().then((result) => {
    // Read result of the Cloud Function.
    console.log("result", result)
    const data: any = result.data;
    jwt = data.jwt;
    console.log("jwt", jwt)
  }).catch((error) => {
    console.error(error)
  });

  // Sync the document using the cloud provider
  new TiptapCollabProvider({ 
    appId: appId,// get this at collab.tiptap.dev
    name: roomName, // e.g. a uuid uuidv4();
    token: jwt,
    document: qi.information
  });

  console.log("roomName", roomName)

  return (
    <QiStoreContext.Provider value={qi}>
      {props.children}
    </QiStoreContext.Provider>
  );
}