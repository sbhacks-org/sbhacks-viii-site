const { admin, db } = require("../utils/admin");
require("dotenv").config();

exports.register = (req, res) => {
  try {
    console.log("Adding hacker to db...");
    const emailAddress = req.body.emailAddress;
    const uid = req.body.uid;

    const hacker_info = {
      uid: uid,
      emailAddress: emailAddress,
      fname: null,
      lname: null,
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
    };

    await db.collection("hackers").doc(uid).set(hacker_info);
    console.log("Added to database...");
    res.json(hacker_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.login = (req, res) => {
  try {
    console.log("Updating hacker login in db...");
    const emailAddress = req.body.emailAddress;
    const uid = req.body.uid;

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

exports.saveApp = (req, res) => {
  try {
    console.log("Saving hacker info to db...");
    const update_info = req.body.update_info;
    const uid = req.body.uid;

    const hacker_info = await db.collection("hackers").doc(uid).get().data();
    console.log("Got info from database...");

    hacker_info.saveAppTimeStamps.push(admin.firestore.Timestamp.now());
    update_info.saveAppTimeStamps = hacker_info.saveAppTimeStamps;

    await db.collection("hackers").doc(uid).update(update_info);
    console.log("Saved info to database...");
    res.json(update_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.getAppFields = (req, res) => {
  try {
    console.log("Getting hacker info from db...");
    const uid = req.body.uid;

    const hacker_info = await db.collection("hackers").doc(uid).get().data();
    console.log("Got info from database...");
    res.json(hacker_info);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.openApp = (req, res) => {
  try {
    console.log("Getting hacker info from db...");
    const uid = req.body.uid;

    const hacker_info = await db.collection("hackers").doc(uid).get().data();
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
