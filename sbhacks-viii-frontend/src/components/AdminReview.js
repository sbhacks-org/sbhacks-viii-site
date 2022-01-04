import React, { useEffect, useState } from "react";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";

import '../styles/MailingList.css';
import '../styles/AdminReview.css';

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
  "accepted" // string, true, false, review
];

function AdminReview() {

  const [applicants, setApplicants] = useState([
    {
      fname: "A",
      lname: "L",
      uid: "XXXX",
      accepted: "false",
      open: false
    }, {
      fname: "B",
      lname: "L",
      uid: "XXX1",
      accepted: "true",
      open: false
    }, {
      fname: "C",
      lname: "L",
      uid: "XXX2",
      accepted: "false",
      open: false
    }, {
      fname: "D",
      lname: "L",
      uid: "XXX3",
      accepted: "review",
      open: false
    }
  ]);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [currAppUid, setCurrUid] = useState("");
  const [currentApp, setApp] = useState({
    gender: "n/a",
    ethnicity: "n/a",
    phoneNumber: "n/a",
    tshirtSize: "n/a",
    shippingAddressLine1: "n/a",
    shippingAddressLine2: "n/a",
    city: "n/a",
    state: "n/a",
    zipCode: "n/a",
    country: "n/a",
    website: "n/a",
    github: "n/a",
    linkedin: "n/a",
    resumeLink: "n/a",
    saveAppTimeStamps: "n/a",
    studyLevel: "n/a",
    gradYear: "n/a",
    universityName: "n/a",
    major: "n/a",
    beenToHackathon: "n/a",
    beenToSBHacks: "n/a",
    hearAboutSBHacks: "n/a",
    essay_answer1: "n/a",
    essay_answer2: "n/a",
    mlhCodeAgree: "n/a",
    privacyAgree: "n/a",
    mlhCommAgree: "n/a",
    accepted: "n/a"
  });
  const history = useHistory();
  let validRedirect;

  useEffect(() => {
    if (admin) {
      getHackers();
    }
  }, [admin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(token);
    axios
      .get("/admin/review/checkToken", { params: { token: token } })
      .then(async (res) => {
        console.log(res.data);
        console.log(token);
        setAdmin(res.data.correctToken == true)
      })
      .catch((err) => {
        console.log("Error in authenitcation " + err);
      });
  }

  const getHackers = () => {
    console.log(token)
    axios
      .get("/admin/review/getApplicantsToReview", { params: { token: token } })
      .then(async (res) => {
        setApplicants(res.data.hackersInfo)
      })
      .catch((err) => {
        console.log("Error in authenitcation " + err);
      });
  }

  const openApp = (uid) => {
    let apps = [];
    setCurrUid(uid);
    for (var i in applicants) {
      const curr = {
        fname: applicants[i].fname,
        lname: applicants[i].lname,
        uid: applicants[i].uid,
        accepted: applicants[i].accepted,
        open: applicants[i].uid == uid ? !applicants[i].open : false
      }
      apps.push(curr);
    }
    setApplicants(apps);
    getHackerInfo(uid, token);

  }
  const closeApp = () => {
    let apps = [];
    setCurrUid("");
    for (var i in applicants) {
      const curr = {
        fname: applicants[i].fname,
        lname: applicants[i].lname,
        uid: applicants[i].uid,
        accepted: applicants[i].accepted,
        open: false
      }
      apps.push(curr);
    }
    setApplicants(apps);
  }

  const getHackerInfo = (uid, token) => {
    axios
      .get("/admin/review/getApplicantReviewInfo", { params: { token: token, uid: uid } })
      .then(async (res) => {
        console.log(res.data);
        setApp(res.data)
      })
      .catch((err) => {
        console.log("Error in authenitcation " + err);
      });
  }

  const changeStatus = (uid, status, index) => {
    axios
      .post("/admin/review/updateHackerStatus", { token: token, uid: uid, status: status })
      .then(async (res) => {
        console.log("success");
        applicants[index].accepted = res.data.accepted;
        closeApp();
      })
      .catch((err) => {
        console.log("Error in authenitcation " + err);
      });
  }

  return (
    <div className=''>
      {
        admin &&
        <div>
          {
            applicants.map((app, index) => {
              return (
                <div className="adminReview">
                  <div className="row">

                    <p>{`${index}. ${app.fname} ${app.lname}`}</p>
                    {
                      app.accepted.toString() == "true" &&
                      <p>&#9989;</p>
                    }
                    {
                      app.accepted.toString() == "false" &&
                      <p>&#10060;</p>
                    }
                    {
                      app.accepted.toString() == "review" &&
                      <p>IN REVIEW</p>
                    }
                    <button onClick={() => {
                      if (app.open)
                        closeApp(app.uid);
                      else
                        openApp(app.uid)
                    }}>
                      {app.open ? "CLOSE" : "VIEW"}
                    </button>
                  </div>
                  {
                    app.open &&
                    <div>
                      <div className="acceptOrDeny">
                        <button className="green" onClick={() => changeStatus(app.uid, "true", index)}>
                          accept
                        </button>
                        <button className="red" onClick={() => changeStatus(app.uid, "false", index)}>
                          deny
                        </button>
                      </div>
                      {
                        appFields.map((key) => {
                          if (key !== "saveAppTimeStamps") {
                            return <QuestionAndResponse question={key} answer={currentApp[key]} />
                          }
                        })
                      }
                    </div>
                  }
                </div>);
            })
          }
        </div>
      }
      {
        !admin &&
        <div>
          <h1>Enter Token</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <textarea value={token} onChange={(e) => setToken(e.target.value)} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      }
    </div>
  );
}

export default AdminReview;



export const QuestionAndResponse = (props) => {
  return (
    <div className="QuestionAndResponse">
      <div className="question">
        {props.question}
      </div>
      <div answer="answer">
        {(props.answer !== null && props.answer != undefined) ? props.answer : "Not answered"}
      </div>
    </div>
  )
}