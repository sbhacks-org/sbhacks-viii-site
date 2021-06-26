const { admin, db } = require("../utils/admin");
const { validateEmail } = require("../utils/mailingListUtils");
const uuid = require("uuid");

exports.mailingListSubscribe = async (req, res) => {
  const emailAddress = req.body.emailAddress;
  if (!validateEmail(emailAddress)) {
    res.status(400).json({ error: `"${emailAddress}" is an invalid email` });
    return;
  }

  const doc = await db
    .collection("mailing-list-subscribers")
    .doc(emailAddress)
    .get();
  if (doc.exists) {
    res.status(400).json({ error: `"${emailAddress}" is already subscribed` });
  }

  const subscriber = {
    "date-time-subscribed": admin.firestore.Timestamp.now(),
    token: uuid.v4(),
  };
  db.collection("mailing-list-subscribers")
    .doc(emailAddress)
    .set(subscriber)
    .then((doc) => {
      res.json(subscriber);
    })
    .catch((err) => {
      res.status(400).json({ error: `something went wrong: ${err}` });
    });
};
