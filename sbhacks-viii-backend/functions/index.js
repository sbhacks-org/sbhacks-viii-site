const functions = require("firebase-functions");

const {
  mailingListSubscribe,
  mailingListUnsubscribe,
  mailingListConfirm,
} = require("./handlers/mailingList");

const {
  getMailingListAddresses,
} = require("./handlers/adminFeatures");

const app = require("express")();

const cors = require("cors")({origin: true});
app.use(cors);

app.post("/mailing-list/subscribe", mailingListSubscribe);
app.get("/mailing-list/unsubscribe", mailingListUnsubscribe);
app.get("/mailing-list/confirm", mailingListConfirm);

app.get("/admin/mailingListAddresses", getMailingListAddresses);

exports.api = functions.https.onRequest(app);

