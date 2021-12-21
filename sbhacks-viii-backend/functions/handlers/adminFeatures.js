const { admin, db } = require("../utils/admin");

require("dotenv").config();

import Schools from "../consts/Schools";
import Genders from "../consts/Genders";
import Majors from "../consts/Majors";
import ShirtSizes from "../consts/ShirtSizes";
import EthnicityOptions from "../consts/EthnicityOptions";
import LevelOfStudyOptions from "../consts/LevelOfStudy";
import GradYearOptions from "../consts/GradYearOptions";

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
    const { authToken, filters_dict } = req.query;
    // filters should be a dictionary of key, value
    // key: application field
    // value: list of acceptable values
    let filters = filters_dict;
    if (filters === undefined) {
      filters = {};
    }

    if (authToken != process.env.ADMIN_AUTH_TOKEN) {
      res.status(400).json({ error: "invalid admin auth token" });
      return;
    }

    const snapshot = await db.collection("hackers").get();
    let emailAddresses = snapshot.docs.map((doc) => doc.data());

    for (const key in Object.keys(filters)) {
      emailAddresses = emailAddresses.filter(
        (email) => email.key in filters.key
      );
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

exports.getFilterOptions = async (req, res) => {
  try {
    const { authToken } = req.query;

    if (authToken != process.env.ADMIN_AUTH_TOKEN) {
      res.status(400).json({ error: "invalid admin auth token" });
      return;
    }

    res.json({
      filterOptions: [
        {
          name: "Level of Study",
          key: "studyLevel",
          options: LevelOfStudyOptions,
        }, 
        {
          name: "School",
          key: "universityName",
          options: Schools,
        },
        {
          name: "Graduation Year",
          key: "gradYear",
          options: GradYearOptions,
        },
        {
          name: "Major",
          key: "major",
          options: Majors,
        },
        {
          name: "T-shirt Size",
          key: "tshirtSize",
          options: ShirtSizes,
        },
        {
          name: "Gender",
          key: "gender",
          options: Genders,
        },
        {
          name: "Ethnicity",
          key: "ethnicity",
          options: EthnicityOptions,
        },
        {
          name: "Hear about SB Hacks",
          key: "hearAboutSBHacks",
          options: ["Email", "Website", "Social Media", "Friend/Colleague", "Workshop", "Other"],
        },
        {
          name: "Attended SB Hacks",
          key: "beenToSBHacks",
          options: ["Yes", "No"],
        },
        {
          name: "Attended Hackathon",
          key: "beenToHackathon",
          options: ["Yes", "No"],
        },
        {
          name: "Application Status",
          key: "status",
          options: ["complete", "incomplete"],
        }
      ]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}` });
  }
}