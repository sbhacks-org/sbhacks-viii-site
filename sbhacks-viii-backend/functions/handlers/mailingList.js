const {admin, db} = require("../utils/admin");
const {validateEmail, sendEmail} = require("../utils/mailingListUtils");
const uuid = require("uuid");
require("dotenv").config();
const cors = require("cors")({origin: true});

exports.mailingListSubscribe = (req, res) => {
  cors(req, res, async () =>
  {try {
    const emailAddress = req.body.emailAddress;
    if (!validateEmail(emailAddress)) {
      res.status(400).json({error: emailAddress === "" ? "email cannot be empty" : `${emailAddress} is an invalid email`});
      return;
    }

    const doc = await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .get();
    if (doc.exists) {
      res
          .status(400)
          .json({error: `${emailAddress} is already subscribed`});
      return;
    }

    const token = uuid.v4();

    const confirmationURL = `${process.env.SITE_URL}\
/confirm?emailAddress=${emailAddress}&token=${token}`;

    const unsubscribeURL = `${process.env.SITE_URL}\
/unsubscribe?emailAddress=${emailAddress}&token=${token}`;

    const mailOptions = {
      // edit here email to send new subscribers
      from: process.env.EMAIL_ALIAS,
      to: emailAddress,
      subject: "SB Hacks VIII Mailing List - Please Confirm",
      text: `thanks for subscribing to our mailing list!\n\
Please confirm: ${confirmationURL}\n\
To unsubscribe: ${unsubscribeURL}`,
    };

    const subscriber = {
      "date-time-subscribed": admin.firestore.Timestamp.now(),
      "token": token,
      "confirmed": false,
    };
    await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .set(subscriber);
    res.json(subscriber);

    sendEmail(mailOptions);
  } catch (err) {
    res.status(500).json({error: `something went wrong: ${err}`});
  }});
};

exports.mailingListUnsubscribe = (req, res) => {
  cors(req, res, async () =>
  {try {
    const {emailAddress, token} = req.query;

    const doc = await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .get();
    if (!doc.exists) {
      res.status(400).json({error: `"${emailAddress}" is not subscribed`});
      return;
    }

    const docData = doc.data();
    if (docData.token !== token) {
      res.status(400).json({error: "mismatched token"});
      return;
    }

    const deleteRes = await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .delete();
    console.log(deleteRes);
    res.json({success: `${emailAddress} has been unsubscribed`});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: `something went wrong: ${err}`});
  }});
};

exports.mailingListConfirm = (req, res) => {
  cors(req, res, async () =>
  {try {
    const {emailAddress, token} = req.query;

    const doc = await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .get();
    if (!doc.exists) {
      res.status(400).json({error: `"${emailAddress}" is not subscribed`});
      return;
    }

    const docData = doc.data();
    if (docData.token !== token) {
      res.status(400).json({error: "mismatched token"});
      return;
    }

    const confirmRes = await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .update({confirmed: true});
    console.log(confirmRes);
    res.json({success: `${emailAddress} has been confirmed`});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: `something went wrong: ${err}`});
  }});
};
