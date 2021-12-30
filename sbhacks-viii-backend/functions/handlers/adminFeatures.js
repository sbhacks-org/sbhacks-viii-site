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
      if(key in filters) {
        emailAddresses = emailAddresses.filter(
          (email) => filters[key].includes(email[key])
        );
      }
    }

    const filteredEmails = emailAddresses.map((hacker) => hacker.emailAddress);

    res.json({
      filteredEmails: filteredEmails,
      filteredEmailsCSV: filteredEmails.join(", "),
      filters: filters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `something went wrong: ${err}`});
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
