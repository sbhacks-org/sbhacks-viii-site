const {admin, db} = require("../utils/admin");
const {validateEmail, sendTestEmail, sendEmail} = require("../utils/mailingListUtils");
const uuid = require("uuid");
require("dotenv").config();

exports.mailingListSubscribe = async (req, res) => {
  try {
    const emailAddress = req.body.emailAddress;
    if (!validateEmail(emailAddress)) {
      res.status(400).json({error: `"${emailAddress}" is an invalid email`});
      return;
    }

    const doc = await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .get();
    if (doc.exists) {
      res
          .status(400)
          .json({error: `"${emailAddress}" is already subscribed`});
      return;
    }

    try {
      const mailOptions = { // edit here email to send new subscribers
        from: process.env.EMAIL_USERNAME,
        to: emailAddress,
        subject: "SB Hacks VIII Mailing List",
        text: "thanks for subscribing to our mailing list!",
      };
      sendEmail(mailOptions);
    } catch (err) {
      res.status(400).json({error: `could not send email to ${emailAddress}: ${err}`});
      return;
    }

    const subscriber = {
      "date-time-subscribed": admin.firestore.Timestamp.now(),
      "token": uuid.v4(),
    };
    await db
        .collection("mailing-list-subscribers")
        .doc(emailAddress)
        .set(subscriber);
    res.json(subscriber);
  } catch (err) {
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
