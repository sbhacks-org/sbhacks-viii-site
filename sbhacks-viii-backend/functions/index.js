const functions = require("firebase-functions");

const {
  mailingListSubscribe,
  // mailingListConfirm,
} = require("./handlers/mailingList");

const app = require("express")();
const cors = require("cors");
app.use(cors());

app.post("/mailing-list/subscribe", mailingListSubscribe);
// app.post("/mailing-list/confirm", mailingListConfirm);

exports.api = functions.https.onRequest(app);
