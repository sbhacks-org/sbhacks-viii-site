import React, { useEffect, useState } from "react";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";

import '../styles/MailingList.css';

function AdminReview() {

  const [applicants, setApplicants] = useState([
      {
        name: "A",
        uid: "XXXX",
        accepted: "false",
        open: false
      },{
        name: "B",
        uid: "XXX1",
        accepted: "true",
        open: false
      },{
        name: "C",
        uid: "XXX2",
        accepted: "false",
        open: false
      },{
        name: "D",
        uid: "XXX3",
        accepted: "review",
        open: false
      }
  ]);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [currentApp, setApp] = useState({
    gender: "n/a" ,
    ethnicity: "n/a" ,
    phoneNumber: "n/a" ,
    tshirtSize: "n/a" ,
    shippingAddressLine1: "n/a" ,
    shippingAddressLine2: "n/a" ,
    city: "n/a" ,
    state: "n/a" ,
    zipCode: "n/a" ,
    country: "n/a" ,
    website: "n/a" ,
    github: "n/a" ,
    linkedin: "n/a" ,
    resumeLink: "n/a" ,
    saveAppTimeStamps: "n/a" ,
    studyLevel: "n/a" ,
    gradYear: "n/a" ,
    universityName: "n/a" ,
    major: "n/a" ,
    beenToHackathon: "n/a" ,
    beenToSBHacks: "n/a" ,
    hearAboutSBHacks: "n/a" ,
    essay_answer1: "n/a" ,
    essay_answer2: "n/a" ,
    mlhCodeAgree: "n/a" ,
    privacyAgree: "n/a" ,
    mlhCommAgree: "n/a" ,
    accepted: "n/a" 
  });
  const history = useHistory();
  let validRedirect;

  useEffect(() => {
    //getHackers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(token);
    axios
        .get("/admin/review/checkToken", { params: { token: token.toString() } })
        .then(async (res) => {
            console.log(res.data.correctToken);
            setAdmin(res.data.correctToken == true)
        })
        .catch((err) => {
            console.log("Error in authenitcation " + err);
        });
  }

  const getHackers = () => {
    axios
        .get("/getApplicantsToReview", { params: { token: token } })
        .then(async (res) => {
            setApplicants(res.data)
        })
        .catch((err) => {
            console.log("Error in authenitcation " + err);
        });
  }

  const openApp = (uid) => {
    let apps = [];
    for(var i in applicants){
        const curr = {
            name: applicants[i].name,
            uid: applicants[i].uid,
            accepted: applicants[i].accepted,
            open: applicants[i].uid == uid ? !applicants[i].open : false
        }
        apps.push(curr);
    }
    setApplicants(apps);
    getHackerInfo(uid, token);

  }

  const getHackerInfo = (uid, token) =>{
    axios
        .get("/getApplicantReviewInfo", { params: { token: token, uid: uid } })
        .then(async (res) => {
            setApp(res.data)
        })
        .catch((err) => {
            console.log("Error in authenitcation " + err);
        });
  }

  const changeStatus = (uid, status) =>{
    axios
        .post("/getApplicantReviewInfo", { body: { token: token, uid: uid, status: status } })
        .then(async (res) => {
            console.log("success");
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
                applicants.map((app, key)=>{
                    return (<div>
                        <p>{app.name}</p>
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
                        <button onClick={()=>openApp(app.uid)}>
                            VIEW
                        </button>
                        {
                            app.open &&
                            <div>
                                <button onClick={()=>changeStatus(app.uid, "accept")}>
                                    accept
                                </button>
                                <button onClick={()=>changeStatus(app.uid, "deny")}>
                                    deny
                                </button>
                                <div>{currentApp.gender}</div>
                                <div>{currentApp.ethnicity}</div>
                                <div>{currentApp.phoneNumber} </div>
                                <div> {currentApp.tshirtSize}</div>
                                <div> {currentApp.shippingAddressLine1}</div>
                                <div> {currentApp.shippingAddressLine2}</div>
                                <div> {currentApp.city}</div>
                                <div>{currentApp.state} </div>
                                <div> {currentApp.zipCode}</div>
                                <div>{currentApp.country} </div>
                                <div> {currentApp.website}</div>
                                <div> {currentApp.github}</div>
                                <div> {currentApp.linkedin}</div>
                                <div> {currentApp.resumeLink}</div>
                                <div> {currentApp.saveAppTimeStamps}</div>
                                <div> {currentApp.studyLevel}</div>
                                <div> {currentApp.gradYear}</div>
                                <div> {currentApp.universityName}</div>
                                <div> {currentApp.major}</div>
                                <div> {currentApp.beenToHackathon}</div>
                                <div> {currentApp.beenToSBHacks}</div>
                                <div> {currentApp.hearAboutSBHacks}</div>
                                <div> {currentApp.essay_answer1}</div>
                                <div> {currentApp.essay_answer2}</div>
                                <div> {currentApp.mlhCodeAgree}</div>
                                <div> {currentApp.privacyAgree}</div>
                                <div> {currentApp.mlhCommAgree}</div>
                                <div> {currentApp.accepted}</div>
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