import React, { useEffect, useState } from "react";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'

import Carnival from '../assets/carnival.svg';
import TicketPlain from '../assets/ticket_plain.svg';
import FishSubmit from '../assets/fish_submit(2).svg';

import '../styles/MailingList.css';

function MailingList() {
  const [emailAddress, setEmailAddress] = useState("");

  const handleSubmit = (event) => {
    // console.log('submit called')
    event.preventDefault();
    axios.post("/mailing-list/subscribe", { 'emailAddress': emailAddress }).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const handleChange = (event) => {
    setEmailAddress(event.target.value);
  };

  const fishHover = () => {
    let submitFish = document.getElementById("submitFish");
    if (submitFish) {
      // submitFish.style.filter = 'brightness(0.8)';
      submitFish.style.transform = 'scale(1.1)';
    }
  }
  const textHover = () => {
    let submitTxt = document.getElementById('submitTxt');
    if (submitTxt) {
      // submitTxt.style.transform = 'scale(1.1)';
    }
  }
  const resetFishStyles = () => {
    let submitFish = document.getElementById("submitFish");
    if (submitFish) {
      submitFish.style.filter = '';
      submitFish.style.transform = '';
    }
    let submitTxt = document.getElementById('submitTxt');
    if (submitTxt) {
      // submitTxt.style.transform = '';
    }
  }

  return (
    <div className='mailingListContainer'>
      {/* <FishTicket /> */}
      <div className='fish-ticket'>
        <img id='ticketImg' src={TicketPlain} alt='Ticket' />
        <form noValidate onSubmit={handleSubmit} id='form'>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={emailAddress}
            placeholder="youremail@example.com"
            onChange={handleChange}
          />
        </form>
        <div className='textContainer'>
           <div className='text'>Join our mailing list for updates!</div>
        </div>
        <div className='submitFishContainer'>
          {/* <div id='submitBtn'> */}
            <img id='submitFish' src={FishSubmit} alt='Fish Submit' onClick={handleSubmit} onMouseEnter={textHover} onMouseLeave={resetFishStyles}/>
            <div id="submitTxt" onMouseEnter={fishHover} >SUBMIT</div>
          {/* </div> */}
        </div>
        
        {/* <div className='btnContainer'>
          <Button onClick={handleSubmit} type="submit" className='submitBtn' variant="contained" color="primary">
              {" "}
              Submit{" "}
          </Button>
        </div> */}
      </div>
      <img id='carnival' src={Carnival} alt='Carnival' />
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
