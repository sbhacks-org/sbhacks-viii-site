const functions = require("firebase-functions");

const {
  mailingListSubscribe,
  mailingListUnsubscribe,
} = require("./handlers/mailingList");

const app = require("express")();
const cors = require("cors");
app.use(cors());

app.post("/mailing-list/subscribe", mailingListSubscribe);
app.get("/mailing-list/unsubscribe", mailingListUnsubscribe);

exports.api = functions.https.onRequest(app);
