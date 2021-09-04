const { admin, db } = require("../utils/admin");
require("dotenv").config();

exports.getMailingListAddresses = async (req, res) => {
  try {
    const { authToken } = req.query;
    if (authToken != process.env.ADMIN_AUTH_TOKEN) {
      res.status(400).json({ error: "invalid admin auth token" });
      return;
    }

    const snapshot = await db.collection("mailing-list-subscribers").get();
    const emailAddresses = snapshot.docs.map((doc) => [
      doc.id,
      doc.data().confirmed,
    ]);

    let validEmailAddresses = [];
    for (let email of emailAddresses) {
      if (email[1]) {
        validEmailAddresses.push(email[0]);
      }
    }

    console.log(validEmailAddresses);

    res.json({ emailAddresses: validEmailAddresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};
