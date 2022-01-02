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

    res.json({ emailAddresses: validEmailAddresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.getFilteredEmails = async (req, res) => {
  try {
    const { authToken } = req.query;
    if (authToken != process.env.ADMIN_AUTH_TOKEN) {
      res.status(400).json({ error: "invalid admin auth token" });
      return;
    }

    const snapshot = await db.collection("hackers").get();
    const emailAddresses = snapshot.docs.map((doc) => [
      doc.data().emailAddress,
      doc.data().status,
      doc.data().role,
    ]);

    const hackerEmailAddresses = emailAddresses.filter(email => email[2] === "hacker");

    const completeApplications = [];
    for (const email of hackerEmailAddresses) {
      if (email[1] === "complete") {
        completeApplications.push(email[0]);
      }
    }
    const completeApplicationCount = completeApplications.length

    const incompleteApplications = [];
    for (const email of hackerEmailAddresses) {
      if (email[1] === "incomplete") {
        incompleteApplications.push(email[0]);
      }
    }
    const incompleteApplicationsCount = incompleteApplications.length

    res.json({
      completeApplications: completeApplications,
      incompleteApplications: incompleteApplications,
      completeApplicationCount: completeApplicationCount,
      incompleteApplicationsCount: incompleteApplicationsCount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};
exports.checkToken = async (req, res) => {
  try {
    const token = req.body.token
    res.json({
      correctToken: token === process.env.ADMIN_AUTH_TOKEN ? true : false
    })
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong${err}` })
  }
}

/*
  body : {
    token:
  }
*/
exports.getApplicantsToReview = async (req, res) => {
  // returns array of {name, email, uid, accepted}

}

const appFields = [
  "gender",
  "ethnicity",
  "phoneNumber",
  "tshirtSize",
  "shippingAddressLine1",
  "shippingAddressLine2",
  "city",
  "state",
  "zipCode",
  "country",
  "website",
  "github",
  "linkedin",
  "resumeLink",
  "saveAppTimeStamps",
  "studyLevel",
  "gradYear",
  "universityName",
  "major",
  "beenToHackathon",
  "beenToSBHacks",
  "hearAboutSBHacks",
  "essay_answer1",
  "essay_answer2",
  "mlhCodeAgree",
  "privacyAgree",
  "mlhCommAgree",
  "accepted" // string, accepted, rejected, notReviewed
];
// get applicant info given uid and token
/*
body: {
  uid :
  token
}

return json
 */

// save review into user database
/*
  body: {
    uid
    token
    status
  }
*/