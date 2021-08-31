const functions = require("firebase-functions");

const {
  mailingListSubscribe,
  mailingListUnsubscribe,
  mailingListConfirm,
} = require("./handlers/mailingList");

const {
  getMailingListAddresses,
} = require("./handlers/adminFeatures");

const {
  register,
  login,
  saveApp,
  getAppFields,
} = require("./handlers/userdb");

const app = require("express")();

const cors = require("cors")({origin: true});
app.use(cors);

app.post("/mailing-list/subscribe", mailingListSubscribe);
app.get("/mailing-list/unsubscribe", mailingListUnsubscribe);
app.get("/mailing-list/confirm", mailingListConfirm);

app.get("/admin/mailingListAddresses", getMailingListAddresses);

app.post("/userdb/register", register);
app.post("/userdb/login", login);
app.post("/userdb/saveApp", saveApp);
app.get("/userdb/getAppFields", getAppFields);

exports.api = functions.https.onRequest(app);

