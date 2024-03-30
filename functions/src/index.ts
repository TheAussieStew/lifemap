/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from "firebase-functions/logger";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { setGlobalOptions } from "firebase-functions/v2/options";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const appSecret = "Q3rV5UXb8C6ostOsYvzYWw8KGWjrDUWtWNHrsyinSULbOQQ1JQzwBllViSYB3oBp"


admin.initializeApp();
setGlobalOptions({maxInstances: 10})

export const generateAuthenticationToken = functions.https.onCall(async (data, context) => {
    var jwt = require('jsonwebtoken');
    // Check if the user is authenticated
    //   if (!context.auth) {
    //     throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to use this function.');
    //   }

    // Omitting allowedDocumentNames field allows all users to access all documents
    // https://tiptap.dev/docs/editor/collaboration/authenticate#allowing-full-access-to-every-document
    const payload = {};

    // Sign the JWT with the custom claims and your secret
    const token = jwt.sign(payload, appSecret);

    // Return the token
    return { token };
});

export const helloWorld = functions.runWith({maxInstances: 10}).https.onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});
