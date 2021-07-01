import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation } from "react-router-dom";
import queryString from 'query-string'

function MailingList() {
  const [firstRender, setFirstRender] = useState(true);
  const [validValues, setvalidValues] = useState(false);
  const [resInfo, setResInfo] = useState("");

  const { search } = useLocation();
  const values = queryString.parse(search);

  useEffect(() => {
    setFirstRender(false);
    if(!('emailAddress' in values) || !('token' in values)) {
      setvalidValues(false);
      return;
    }
    else {
      setvalidValues(true);
      const {emailAddress, token} = values;
      axios.get("/mailing-list/unsubscribe", {
        params: {
          emailAddress: emailAddress,
          token: token
        }
      }).then((res) => {
        console.log(res);
        const success_message = `success ${res.status}: ${res.data.success}`
        console.log(success_message);
        setResInfo(success_message);
      })
      .catch((err) => {
        console.log(err);
        let error_message = 'something went really really wrong';
        if(err.response) {
          error_message = `error ${err.response.status}: ${err.response.data.error}`
        }
        console.log(error_message);
        setResInfo(error_message);
      });
    }    
  }, [])
  
  if(firstRender) {
    return (
      <div></div>
    )
  }

  if(!validValues) {
    return (
      <div>
      <div>error: either email address or token is missing</div>
      </div>
    );
  }

  return (
    <div>
      {resInfo}
    </div>
  )
}

export default MailingList;
