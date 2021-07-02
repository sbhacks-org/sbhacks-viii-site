import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'

function MailingList() {
  const [emailAddress, setEmailAddress] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("/mailing-list/subscribe", {'emailAddress': emailAddress}).then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
  };

  const handleChange = (event) => {
    setEmailAddress(event.target.value);
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        value={emailAddress}
        placeholder="example@gmail.com"
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" color="primary">
        {" "}
        Submit{" "}
      </Button>
    </form>
  );
}

export default MailingList;
