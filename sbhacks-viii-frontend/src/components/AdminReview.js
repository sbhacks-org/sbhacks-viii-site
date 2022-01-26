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
    // {
    //   fname: "A",
    //   lname: "L",
    //   uid: "XXXX",
    //   // accepted: "false",
    //   rating: 7,
    //   open: false,
    //   status: "complete",
    // }, {
    //   fname: "B",
    //   lname: "L",
    //   uid: "XXX1",
    //   rating: 5,
    //   // accepted: "true",
    //   open: false,
    //   status: "incomplete",
    // }, {
    //   fname: "C",
    //   lname: "L",
    //   uid: "XXX2",
    //   rating: 6,
    //   // accepted: "false",
    //   open: false,
    //   status: "complete",
    // }, {
    //   fname: "D",
    //   lname: "L",
    //   uid: "XXX3",
    //   rating: 8,
    //   // accepted: "review",
    //   open: false,
    //   status: "incomplete",
    // }
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
    status: "incomplete",
    // accepted: "n/a",
    rating: -1
  });
  const [rating, setRating] = useState(-1);
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
        rating: applicants[i].rating,
        status: applicants[i].status,
        // accepted: applicants[i].accepted,
        open: applicants[i].uid == uid ? !applicants[i].open : false
      }
      if (uid == applicants[i].uid) {
        setRating(applicants[i].rating);
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
        // accepted: applicants[i].accepted,
        rating: applicants[i].rating,
        status: applicants[i].status,
        open: false
      }
      apps.push(curr);
    }
    setRating(-1);
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

  const changeStatus = (uid, rating, index) => {
    console.log(index)
    axios
      .post("/admin/review/updateHackerStatus", { token: token, uid: uid, rating: rating })
      .then(async (res) => {
        console.log("success");
        applicants[index].rating = res.data.rating;
        closeApp();
      })
      .catch((err) => {
        console.log("Error in authenitcation " + err);
      });
  }

  const submitRating = (e, index) => {
    e.preventDefault();
    changeStatus(currAppUid, rating, index);
  }

  const zeroTo10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className=''>
      {
        admin &&
        <div>
          <div className="numApplicants">
            <div>{applicants.length} Applicants</div>
          </div>
          {
            applicants.map((app, index) => {
              return (
                <div className="adminReview">
                  <div className="row">

                    <p>{`${index}. ${app.fname} ${app.lname}`}</p>
                    {
                      app.rating == -1 ?
                        <div>
                          Not rated yet
                        </div>
                        :
                        <div className="rating">
                          {app.rating} / 10
                        </div>
                    }
                    <div className={`${app.status==="complete" ? "greenText" : "redText"}`}>
                      {app.status}
                    </div>
                    <button className="appReviewBtn" onClick={() => {
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
                      <form onSubmit={(e) => submitRating(e, index)}>
                        <div className="rate">
                          <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value={-1}>Not rated yet</option>
                            {
                              zeroTo10.map((val) => {
                                return <option value={val}>{val}</option>
                              })
                            }
                          </select>
                        </div>
                        <input type="submit" value="Submit Rating"/>
                      </form>
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
              <input type="password" value={token} onChange={(e) => setToken(e.target.value)} />
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
      {
        props.question == "resumeLink" ?
          <div>
            <div className="question">
              {props.question}
            </div>
            <div answer="answer">
              {(props.answer !== null && props.answer != undefined) ? <a className="resumeLink" target="_blank" rel="noopener noreferrer" href={props.answer}> Open Resume in New Window</a> : <></>}
              {(props.answer !== null && props.answer != undefined) ? <embed src={props.answer} width="600px" height="800px" /> : "Not answered"}
            </div>
          </div>
          :
          <><div className="question">
            {props.question}
          </div>
            <div answer="answer">
              {(props.answer !== null && props.answer != undefined) ? props.answer : "Not answered"}
            </div>
          </>
      }

    </div>
  )
}