const { admin, db } = require("../utils/admin");
const { FilterOptions } = require("../consts/FilterOptions");

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

    const validEmailAddresses = [];
    for (let email of emailAddresses) {
      if (email[1]) {
        validEmailAddresses.push(email[0]);
      }
    }

    res.json({
      emailAddresses: validEmailAddresses,
      emailAddressesCSV: validEmailAddresses.join(", "),
    });
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
      doc.data().universityName,
    ]);

    const hackerEmailAddresses = emailAddresses.filter(
      (email) => email[2] === "hacker"
    );

    const completeApplications = [];
    for (const email of hackerEmailAddresses) {
      if (email[1] === "complete") {
        completeApplications.push(email[0]);
      }
    }
    const completeApplicationCount = completeApplications.length;

    const incompleteApplications = [];
    for (const email of hackerEmailAddresses) {
      if (email[1] === "incomplete") {
        incompleteApplications.push(email[0]);
      }
    }
    const incompleteApplicationsCount = incompleteApplications.length;

    const completeApplicationsBySchool = {};
    for (const email of hackerEmailAddresses) {
      if (email[1] !== "complete") {
        continue;
      }
      if (email[3] in completeApplicationsBySchool) {
        completeApplicationsBySchool[email[3]].push(email[0]);
      } else {
        completeApplicationsBySchool[email[3]] = [email[0]];
      }
    }

    const completeApplicationsBySchoolCounts = {};
    for (const [school, emails] of Object.entries(
      completeApplicationsBySchool
    )) {
      completeApplicationsBySchoolCounts[school] = emails.length;
    }

    const incompleteApplicationsBySchool = {};
    for (const email of hackerEmailAddresses) {
      if (email[1] !== "incomplete") {
        continue;
      }
      if (email[3] in incompleteApplicationsBySchool) {
        incompleteApplicationsBySchool[email[3]].push(email[0]);
      } else {
        incompleteApplicationsBySchool[email[3]] = [email[0]];
      }
    }

    const incompleteApplicationsBySchoolCounts = {};
    for (const [school, emails] of Object.entries(
      incompleteApplicationsBySchool
    )) {
      incompleteApplicationsBySchoolCounts[school] = emails.length;
    }

    res.json({
      completeApplications: completeApplications,
      incompleteApplications: incompleteApplications,
      completeApplicationCount: completeApplicationCount,
      incompleteApplicationsCount: incompleteApplicationsCount,
      completeApplicationsBySchool: completeApplicationsBySchool,
      incompleteApplicationsBySchool: incompleteApplicationsBySchool,
      completeApplicationsBySchoolCounts: completeApplicationsBySchoolCounts,
      incompleteApplicationsBySchoolCounts:
        incompleteApplicationsBySchoolCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.getFilteredEmails2 = async (req, res) => {
  try {
    // const authToken = req.body.authToken;
    // const filters_dict = req.body.filters_dict;
    // filters should be a dictionary of key, value
    // key: application field
    // value: list of acceptable values

    const body = req.body;

    if (body.authToken != process.env.ADMIN_AUTH_TOKEN) {
      res.status(400).json({ error: "invalid admin auth token" });
      return;
    }

    let filters = body;
    delete filters['authToken'];
    if (filters === undefined) {
      filters = {};
    }

    const snapshot = await db.collection("hackers").get();
    let emailAddresses = snapshot.docs.map((doc) => doc.data());

    for (const key of Object.keys(filters)) {
      if (key in filters) {
        emailAddresses = emailAddresses.filter(
          (email) => filters[key].includes(email[key])
        );
      }
    }

    const filteredEmails = emailAddresses.map((hacker) => hacker.emailAddress);

    res.json({
      filteredEmails: filteredEmails,
      filteredEmailsCSV: filteredEmails.join(", "),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

const refreshFilterOptionsForField = async (field) => {
  try {
    // Get options
    const field_options = (
      await db.collection("filters").doc(field).get()
    ).data();
    field_options.options = [];
    // set new options
    await db
      .collection("hackers")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.docs.forEach((doc) => {
          // if the field option is new, add it to the options array
          if (
            !field_options.options.includes(doc.data()[field]) &&
            doc.data()[field] != null &&
            doc.data()[field].trim() != ""
          ) {
            field_options.options.push(doc.data()[field]);
          }
        });
      });
    // set new timestamp
    field_options.lastUpdated = admin.firestore.Timestamp.now();
    // Update database
    await db.collection("filters").doc(field).update(field_options);
  } catch (err) {
    console.error(err);
  }
};

exports.refreshLocationFilterOptions = async (req, res) => {
  try {
    const { authToken } = req.query;

    if (authToken != process.env.ADMIN_AUTH_TOKEN) {
      res.status(400).json({ error: "invalid admin auth token" });
      return;
    }

    await Promise.all(
      ["city", "state", "country"].map(async (field) => {
        await refreshFilterOptionsForField(field);
      })
    );

    res.json({
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.getFilterOptions = async (req, res) => {
  try {
    const { authToken } = req.query;

    if (authToken != process.env.ADMIN_AUTH_TOKEN) {
      res.status(400).json({ error: "invalid admin auth token" });
      return;
    }

    let locations_options = {};

    await Promise.all(
      ["city", "state", "country"].map(async (field) => {
        // Get options
        let field_options = (
          await db.collection("filters").doc(field).get()
        ).data();
        // check if options were updated in database within 6 hours
        if (
          field_options.lastUpdated.toDate() <
          new Date(Date.now() - 6 * 60 * 60 * 1000)
        ) {
          await refreshFilterOptionsForField(field);
          // Get new options
          field_options = (
            await db.collection("filters").doc(field).get()
          ).data();
        }
        locations_options[field] = field_options.options;
      })
    );

    res.json({
      locations_options,
      ...FilterOptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
};

exports.checkToken = async (req, res) => {
  try {
    const token = req.query.token
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
    const token = req.query.token
    if (token === process.env.ADMIN_AUTH_TOKEN) {
      const snapshot = await db.collection("hackers").get();

      let completed = 0;
      let rated = 0;
      const hackersInfo = snapshot.docs.map((doc) => {
        if (doc.data().status === "complete") completed++;
        if (doc.data().rating) {
          if (doc.data().rating >= 0) {
            rated++;
          }
        }
        return {
          uid: doc.id,
          emailAddress: doc.data().emailAddress,
          fname: doc.data().fname,
          lname: doc.data().lname,
          rating: (doc.data().rating === undefined || doc.data().rating === null) ? -1 : doc.data().rating,
          // accepted: (doc.data().accepted === undefined || doc.data().accepted === null) ? "review" : doc.data().accepted,
          status: doc.data().status,
          saveAppTimeStamps: doc.data().saveAppTimeStamps,
          open: false,
        }
      });

      hackersInfo.sort((hacker1, hacker2) => {
        return hacker1.saveAppTimeStamps[hacker1.saveAppTimeStamps.length - 1] - hacker2.saveAppTimeStamps[hacker2.saveAppTimeStamps.length - 1];
      });

      // put complete apps in the front and put incomplete apps in the back
      hackersInfoComplete = [];
      hackersInfoIncomplete = [];
      for (let index = 0; index < hackersInfo.length; index++) {
        if (hackersInfo[index].status === "complete") {
          hackersInfoComplete.push(hackersInfo[index]);
        }
        else {
          hackersInfoIncomplete.push(hackersInfo[index]);
        }
      }
      sortByRating = (hacker1, hacker2) => {
        if ((hacker1.rating === null || hacker1.rating === undefined) && (hacker2.rating === undefined || hacker2.rating === null)) {
          return 1;
        }
        else if ((hacker1.rating === null || hacker1.rating === undefined) && hacker2.rating) {
          return -1 * hacker2.rating;
        }
        else if ((hacker2.rating === null || hacker2.rating === undefined) && hacker1.rating) {
          return hacker1.rating;
        }
        else {
          return hacker2.rating - hacker1.rating;
        }
      }
      hackersInfoComplete.sort(sortByRating);
      hackersInfoIncomplete.sort(sortByRating);
      for (let i = 0; i < hackersInfo.length; i++) {
        if (i < completed) {
          hackersInfo[i] = hackersInfoComplete[i];
        }
        else {
          hackersInfo[i] = hackersInfoIncomplete[i - completed];
        }

      }



      res.json({
        hackersInfo: hackersInfo,
        completed: completed,
        rated: rated
      })
    }
    else {
      res.status(401).json({ error: `Not an admin` })
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong${err}` })
  }
}

const appFields = [
  "fname",
  "lname",
  "emailAddress",
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
  "status", // complete or incomplete
  // "accepted" // string, true, false, review
  "rating", // 0-10, -1 for not rated
];
// get applicant info given uid and token
/*
query: {
  uid :
  token
}
return json
 */
exports.getApplicantReviewInfo = async (req, res) => {
  try {
    const token = req.query.token
    const uid = req.query.uid
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
      res.status(401).json({ error: `Not an admin` })
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
exports.updateHackerStatus = async (req, res) => {
  try {
    console.log(req);
    const token = req.body.token;
    const uid = req.body.uid;
    const status = req.body.status;
    const rating = req.body.rating;

    const submitTime = Date.now();

    console.log(token)
    console.log(process.env.ADMIN_AUTH_TOKEN)
    if (token === process.env.ADMIN_AUTH_TOKEN) {
      const doc = await db.collection("hackers").doc(uid).get();
      if (!doc.exists) {
        res.status(400).json({ error: "user does not exist" });
        return;
      }
      const hacker_info = doc.data();
      update_info = hacker_info;
      // update_info.accepted = status;

      let priorityDeadline = new Date('February 1, 2022 16:00:00'); // 8AM feb 1 PST is 4PM feb 1 UTC
      if (submitTime >= priorityDeadline.getTime()) {
        update_info.nonPriority = true;
      }
      else {
        update_info.nonPriority = false;
      }
      update_info.rating = rating;

      await db.collection("hackers").doc(uid).update(update_info);
      console.log("updated hacker status")
      console.log(update_info);
      res.json(update_info);
    }
    else {
      res.status(401).json({ error: `Not an admin` })
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong${err}` })
  }
}

exports.getSchoolStats = async (req, res) => {
  try {
    const token = req.query.token
    if (token === process.env.ADMIN_AUTH_TOKEN) {

      schoolsCount = {};
      numApplicants = 0;

      const snapshot = await db.collection("hackers").get();

      snapshot.docs.map((doc) => {
        if (doc.data().status === "complete") {
          schoolName = doc.data().universityName;
          if (schoolsCount[schoolName]) {
            schoolsCount[schoolName] = schoolsCount[schoolName] + 1;
            numApplicants++;
          }
          else {
            schoolsCount[schoolName] = 1;
            numApplicants++;
          }
        }

      })

      console.log("University Name* Count")
      for (let school of Object.keys(schoolsCount)) {
        console.log(school + "* " + schoolsCount[school])
      }

      res.json({schoolsCount : schoolsCount, numApplicants: numApplicants});

    }
    else {
      res.status(401).json({ error: `Not an admin` })
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong in getting school stats${err}` })
  }
}

exports.getYearStats = async (req, res) => {
  try {
    const token = req.query.token
    if (token === process.env.ADMIN_AUTH_TOKEN) {

      yearCount = {};
      numApplicants = 0;

      const snapshot = await db.collection("hackers").get();

      snapshot.docs.map((doc) => {
        if (doc.data().status === "complete") {
          year = doc.data().studyLevel;
          if (year === "Bachelors") {
            gradYr = doc.data().gradYear;
            if (gradYr == "2022") {
              year = "Seniors"
            }
            else if (gradYr == "2023") {
              year = "Juniors"
            }
            else if (gradYr == "2024") {
              year = "Sophomores"
            }
            else if (gradYr == "2025") {
              year = "Freshmen"
            }
            else if (gradYr == "2021") {
              year = "Graduated < 1 Year"
            }
            else {
              year = "Other"
            }
            // console.log(doc.data().gradYear +", " + year)
          }
          if (yearCount[year]) {
            yearCount[year] = yearCount[year] + 1;
            numApplicants++;
          }
          else {
            yearCount[year] = 1;
            numApplicants++;
          }
        }

      })

      console.log("Study Level* Count")
      for (let year of Object.keys(yearCount)) {
        console.log(year + "* " + yearCount[year])
      }

      res.json({yearCount : yearCount, numApplicants: numApplicants});

    }
    else {
      res.status(401).json({ error: `Not an admin` })
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong in getting study level stats${err}` })
  }
}

exports.getGenderStats = async (req, res) => {
  try {
    const token = req.query.token
    if (token === process.env.ADMIN_AUTH_TOKEN) {

      gendersCount = {};
      numApplicants = 0;

      const snapshot = await db.collection("hackers").get();

      snapshot.docs.map((doc) => {
        if (doc.data().status === "complete") {
          gender = doc.data().gender;
          if (gendersCount[gender]) {
            gendersCount[gender] = gendersCount[gender] + 1;
            numApplicants++;
          }
          else {
            gendersCount[gender] = 1;
            numApplicants++;
          }
        }

      })

      console.log("University Name* Count")
      for (let gender of Object.keys(gendersCount)) {
        console.log(gender + "* " + gendersCount[gender])
      }

      res.json({gendersCount : gendersCount, numApplicants: numApplicants});

    }
    else {
      res.status(401).json({ error: `Not an admin` })
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong in getting gender stats${err}` })
  }
}

exports.getEthnicityStats = async (req, res) => {
  try {
    const token = req.query.token
    if (token === process.env.ADMIN_AUTH_TOKEN) {

      ethnicityCount = {};
      numApplicants = 0;

      const snapshot = await db.collection("hackers").get();

      snapshot.docs.map((doc) => {
        if (doc.data().status === "complete") {
          ethnicity = doc.data().ethnicity;
          if (ethnicityCount[ethnicity]) {
            ethnicityCount[ethnicity] = ethnicityCount[ethnicity] + 1;
            numApplicants++;
          }
          else {
            ethnicityCount[ethnicity] = 1;
            numApplicants++;
          }
        }

      })

      console.log("University Name* Count")
      for (let ethnicity of Object.keys(ethnicityCount)) {
        console.log(ethnicity + "* " + ethnicityCount[ethnicity])
      }

      res.json({ethnicityCount : ethnicityCount, numApplicants: numApplicants});

    }
    else {
      res.status(401).json({ error: `Not an admin` })
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: `Something went wrong in getting gender stats${err}` })
  }
}