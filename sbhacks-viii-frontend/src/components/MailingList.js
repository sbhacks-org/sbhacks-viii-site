import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'

import Carnival from '../assets/carnival.svg';
import TicketPlain from '../assets/ticket_plain.svg';
import FishSubmit from '../assets/fish_submit.svg';

import '../styles/MailingList.css';

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

  const FishTicket = () => {
    return (
      <div className='fish-ticket'>
        <img id='ticketImg' src={TicketPlain} alt='Ticket'/>
        <img id='submitFish' src={FishSubmit} alt='Fish Submit'/>
      </div>
    );
  }
  return (
    <div className='mailingListContainer'>
      <img id='carnival' src={Carnival} alt='Carnival'/>
      <FishTicket />
      {/* <form noValidate onSubmit={handleSubmit}>
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
      </form> */}
    </div>
  );
}

export default MailingList;
