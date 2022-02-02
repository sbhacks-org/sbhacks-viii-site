const { admin, db } = require("../utils/admin");

const { validateEmail } = require("../utils/mailingListUtils");

require("dotenv").config();

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
];

const reqAppFields = [
  "phoneNumber",
  "tshirtSize",
  "shippingAddressLine1",
  "city",
  "state",
  "zipCode",
  "country",
  "resumeLink",
  "studyLevel",
  "gradYear",
  "universityName",
  "major",
  "mlhCodeAgree",
  "privacyAgree",
  "mlhCommAgree",
];

exports.register = async (req, res) => {
  try {
    console.log("Adding hacker to db...");
    const emailAddress = req.body.emailAddress;
    const uid = req.body.uid;
    const fname = req.body.fname;
    const lname = req.body.lname;

    if (emailAddress === "" || uid === "" || fname === "" || lname === "") {
      res.status(400).json({
        error: "empty fields",
      });
      return;
    }

    if (!validateEmail(emailAddress)) {
      res.status(400).json({
        error: `${emailAddress} is an invalid email`,
      });
      return;
    }

    const doc = await db.collection("hackers").doc(uid).get();
    if (doc.exists) {
      res.status(400).json({ error: `${emailAddress} is already subscribed` });
      return;
    }

    const hacker_info = {
      uid: uid,
      emailAddress: emailAddress,
      fname: fname,
      lname: lname,
      gender: null,
      ethnicity: null,
      phoneNumber: null,
      tshirtSize: null,
      shippingAddressLine1: null,
      shippingAddressLine2: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
      resumeLink: null,
      website: null,
      github: null,
      linkedin: null,
      studyLevel: null,
      gradYear: null,
      universityName: null,
      major: null,
      beenToHackathon: null,
      beenToSBHacks: null,
      hearAboutSBHacks: null,
      essay_answer1: null,
      essay_answer2: null,
      mlhCodeAgree: false,
      privacyAgree: false,
      mlhCommAgree: false,
      role: "hacker",
      status: "incomplete",
      lastLoggedInTimeStamp: admin.firestore.Timestamp.now(),
      registeredTimeStamp: admin.firestore.Timestamp.now(),
      openAppTimeStamps: [],
      saveAppTimeStamps: [],
      completedAppTimeStamps: [],
      rating: null,
    };

    await db.collection("hackers").doc(uid).set(hacker_info);
    console.log("Added to database...");
    res.json(hacker_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Updating hacker login in db...");
    const emailAddress = req.body.emailAddress;
    const uid = req.body.uid;

    const doc = await db.collection("hackers").doc(uid).get();
    if (!doc.exists) {
      res.status(400).json({ error: "user does not exist" });
      return;
    }

    const update_info = {
      lastLoggedInTimeStamp: admin.firestore.Timestamp.now(),
    };

    await db.collection("hackers").doc(uid).update(update_info);
    console.log("Updated in database...");
    res.json(update_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.saveApp = async (req, res) => {
  try {
    console.log("Saving hacker info to db...");
    const update_info = req.body.update_info;
    const uid = req.body.uid;

    const doc = await db.collection("hackers").doc(uid).get();
    if (!doc.exists) {
      res.status(400).json({ error: "user does not exist" });
      return;
    }

    const update_fields = Object.keys(update_info);
    for (let key of appFields) {
      if (!update_fields.includes(key)) {
        res.status(400).json({ error: `missing field ${key}` });
        return;
      }
    }

    for (let key of update_fields) {
      if (!appFields.includes(key)) {
        res.status(400).json({ error: `extra field ${key}` });
        return;
      }
    }

    const hacker_info = (await db.collection("hackers").doc(uid).get()).data();
    console.log("Got info from database...");
    console.log(hacker_info);

    hacker_info.saveAppTimeStamps.push(admin.firestore.Timestamp.now());
    update_info.saveAppTimeStamps = hacker_info.saveAppTimeStamps;

    // add timestamp to completedAppTimes for when all required fields are completed
    let completeAppFlag = true;
    for (let key of reqAppFields) {
      if (
        update_info[key] === null ||
        update_info[key] === "" ||
        !update_info[key]
      ) {
        console.log(key);
        completeAppFlag = false;
      }
    }

    if (completeAppFlag) {
      hacker_info.completedAppTimeStamps.push(admin.firestore.Timestamp.now());
      update_info.completedAppTimeStamps = hacker_info.completedAppTimeStamps;
      update_info.status = "complete";
    } else {
      update_info.status = "incomplete";
    }

    await db.collection("hackers").doc(uid).update(update_info);

    console.log("Saved info to database...");
    res.json(update_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.getAppFields = async (req, res) => {
  try {
    console.log("Getting hacker info from db...");
    // console.log(req.body)
    // req.body = JSON.parse(req.body);
    // console.log(req.query)
    const uid = req.query.uid;
    // console.log(typeof(uid) + ", " + uid)

    const doc = await db.collection("hackers").doc(uid).get();
    if (!doc.exists) {
      res.status(400).json({ error: "user does not exist" });
      return;
    }

    const hacker_info = (await db.collection("hackers").doc(uid).get()).data();
    console.log("Got info from database...");
    let ret_hacker_info = {};
    for (let key of appFields) {
      ret_hacker_info[key] = hacker_info[key];
    }
    res.json(ret_hacker_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.openApp = async (req, res) => {
  try {
    console.log("Getting hacker info from db...");
    const uid = req.body.uid;

    const doc = await db.collection("hackers").doc(uid).get();
    if (!doc.exists) {
      res.status(400).json({ error: "user does not exist" });
      return;
    }

    const hacker_info = (await db.collection("hackers").doc(uid).get()).data();
    console.log("Got info from database...");

    hacker_info.openAppTimeStamps.push(admin.firestore.Timestamp.now());

    await db.collection("hackers").doc(uid).update(hacker_info);

    console.log("Updated hacker info open app timestamp");
    res.json(hacker_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.getDashFields = async (req, res) => {
  try {
    console.log("Getting hacker info from db...");
    // console.log(req.body)
    // req.body = JSON.parse(req.body);
    // console.log(req.query)
    const uid = req.query.uid;
    // console.log(typeof(uid) + ", " + uid)

    const doc = await db.collection("hackers").doc(uid).get();
    if (!doc.exists) {
      res.status(400).json({ error: "user does not exist" });
      return;
    }

    const hacker_info = (await db.collection("hackers").doc(uid).get()).data();
    console.log("Got info from database...");
    let ret_hacker_info = {
      status: hacker_info.status,
      fname: hacker_info.fname,
      lname: hacker_info.lname,
      rating: hacker_info.rating,
    };
    res.json(ret_hacker_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};
