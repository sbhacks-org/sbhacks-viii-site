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
        accepted: "false"
      },{
        name: "B",
        uid: "XXXX",
        accepted: "true"
      },{
        name: "C",
        uid: "XXXX",
        accepted: "false"
      },{
        name: "D",
        uid: "XXXX",
        accepted: "review"
      }
  ]);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState("");

  const history = useHistory();
  let validRedirect;

  useEffect(() => {
    getHackers();
  }, []);

  const handleSubmit = () => {
    axios
        .get("/checkToken", { params: { token: token } })
        .then(async (res) => {
            setAdmin(res.data.sucess)
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

  const openApp = () => {
   
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
                        <button onClick={()=>openApp(app.name, app.uid)}>
                            VIEW
                        </button>
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