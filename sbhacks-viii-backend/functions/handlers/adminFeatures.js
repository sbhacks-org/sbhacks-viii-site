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
  try {
    const token = req.body.token
    if (token === process.env.ADMIN_AUTH_TOKEN) {
      const snapshot = await db.collection("hackers").get();


      const hackersInfo = snapshot.docs.map((doc) => {
        return {
          uid: doc.id,
          emailAddress: doc.data().emailAddress,
          fname: doc.data().fname,
          lname: doc.data().lname,
          accepted: (doc.data().accepted === undefined || doc.data().accepted === null) ? "notReviewed" : doc.data().accepted,
          saveAppTimeStamps: doc.data().saveAppTimeStamps
        }
      });

      hackersInfo.sort((hacker1, hacker2) => {
        return hacker1.saveAppTimeStamps[hacker1.saveAppTimeStamps.length - 1] - hacker2.saveAppTimeStamps[hacker2.saveAppTimeStamps.length - 1];
      });
      res.json({
        hackersInfo : hackersInfo
      })
    }
    else {
      res.status(401).json({error: `Not an admin`})
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong${err}` })
  }
}

const appFields = [
  "gender",
  "ethnicity",
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
exports.getApplicantReviewInfo = async (req, res) => {
  try {
    const token = req.body.token
    const uid = req.body.uid
    if (token === process.env.ADMIN_AUTH_TOKEN) {
      const doc = await db.collection("hackers").doc(uid).get();
      if (!doc.exists) {
        res.status(400).json({ error: "user does not exist" });
        return;
      }

      const hacker_info = doc.data();
      console.log("Got info from database...");
      let ret_hacker_info = {};
      for (let key of appFields) {
        ret_hacker_info[key] = hacker_info[key];
      }
      res.json(ret_hacker_info);
    }
    else {
      res.status(401).json({error: `Not an admin`})
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong${err}` })
  }
}

// save review into user database
/*
  body: {
    uid
    token
    status
  }
*/
exports.updateHackerStatus = (req, res) => {
  try {
    const token = req.body.token;
    const uid = req.body.uid;
    const status = req.body.status;

    if (token === process.env.ADMIN_AUTH_TOKEN) {
      const doc = await db.collection("hackers").doc(uid).get();
      if (!doc.exists) {
        res.status(400).json({ error: "user does not exist" });
        return;
      }
      const hacker_info = doc.data();
      update_info = hacker_info;
      update_info.accepted = status;

      await db.collection("hackers").doc(uid).update(update_info);
      console.log("updated hacker status")
      res.json(update_info);
    }
    else {
      res.status(401).json({error: `Not an admin`})
    }
  }
  catch(err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong${err}` })
  }
}