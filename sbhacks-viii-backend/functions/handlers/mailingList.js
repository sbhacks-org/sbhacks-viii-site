const {admin, db} = require("../utils/admin");
const {validateEmail, sendEmail, sendTestEmail, confirmTemplateHTML} = require("../utils/mailingListUtils");
const handlebars = require("handlebars");
const uuid = require("uuid");
require("dotenv").config();

exports.mailingListSubscribe = async (req, res) => {
  try {
    console.log("Subscribing...");
    const emailAddress = req.body.emailAddress;
    if (!validateEmail(emailAddress)) {
      res.status(400).json({
        error:
          emailAddress === "" ?
            "email cannot be empty" :
            `${emailAddress} is an invalid email`,
      });
      return;
    }
    console.log("Validated email.");

    const doc = await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .get();
    if (doc.exists) {
      res.status(400).json({error: `${emailAddress} is already subscribed`});
      return;
    }
    console.log("Validated doesn't exist.");

    const token = uuid.v4();

    const confirmationURL = `${process.env.SITE_URL}\
/confirm?emailAddress=${emailAddress}&token=${token}`;

    const unsubscribeURL = `${process.env.SITE_URL}\
/unsubscribe?emailAddress=${emailAddress}&token=${token}`;

    const templateVars = {
      confirmationURL: confirmationURL,
      unsubscribeURL: unsubscribeURL,
    };

    const htmlToSend = handlebars.compile(confirmTemplateHTML)(templateVars);

    const mailOptions = {
      // edit here email to send new subscribers
      from: process.env.EMAIL_ALIAS,
      to: emailAddress,
      subject: "SB Hacks VIII Mailing List - Please Confirm",
      html: htmlToSend
    };

    const subscriber = {
      "date-time-subscribed": admin.firestore.Timestamp.now(),
      "token": token,
      "confirmed": false,
    };
    console.log("Adding to database...");
    await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .set(subscriber);
    console.log("Added to database...");
    res.json(subscriber);

    console.log("Sending email...");
    sendEmail(mailOptions);
    // sendTestEmail();
    console.log("Email sent...");
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({error: `something went wrong: ${err}`});
  }
};

exports.mailingListUnsubscribe = async (req, res) => {
  try {
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
  }
};

exports.mailingListConfirm = async (req, res) => {
  try {
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
  }
};
