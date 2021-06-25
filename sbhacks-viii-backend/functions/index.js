const functions = require("firebase-functions");

const { db } = require("./utils/admin");

const {
    mailingListSubscribe
} = require("./handlers/mailingList");

const app = require("express")();
const cors = require("cors");
app.use(cors());

app.post("/mailing-list/subscribe", mailingListSubscribe);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


exports.api = functions.https.onRequest(app);
