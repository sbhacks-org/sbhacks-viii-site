import React, { useEffect, useState } from "react";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'

import Carnival from '../assets/carnival.svg';
import TicketPlain from '../assets/ticket_blank.svg';
import FishSubmit from '../assets/fish_submit(2).svg';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";

import '../styles/MailingList.css';

function MailingList() {
  const [emailAddress, setEmailAddress] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [submitStatus, setSubmitStatus] = useState("Join our mailing list for updates!");
  const [isMobile, setIsMobile] = useState(false);

  const history = useHistory();

  let validRedirect;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          validRedirect = true;
        }
        else {
          validRedirect = false;
        }
      } else {
        validRedirect = false
      }
    });
  }, []);

  const checkIfMobile = () => {
    if (window.innerWidth <= 768) setIsMobile(true);
    else setIsMobile(false);
  }
  useEffect(() => {
    checkIfMobile();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  })

  const handleSubmit = (event) => {
    console.log('submit called')
    if (!buttonEnabled) return;
    setButtonEnabled(false);
    setEmailAddress("");
    event.preventDefault();
    axios.post("/mailing-list/subscribe", { 'emailAddress': emailAddress }).then((res) => {
      console.log(res);
      setSubmitStatus("You've been subscribed. Check your email to confirm.");
      setButtonEnabled(true);
    })
      .catch((err) => {
        console.log(err);
        if (err.response !== undefined) {
          setSubmitStatus("error: " + err.response.data.error);
        } else {
          setSubmitStatus("error: uncaught error (likely network)");
        }
        setButtonEnabled(true);
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
        <div className='textContainer'>
          <div className='eventDate2 clickable' onClick={() => { if (validRedirect) history.push('/dashboard'); else history.push('/login') }} >
              <div className='text2' > APPLY HERE </div>
            </div>
          </div>
          
        {
          isMobile && 
          <div className='eventTitleContainer'>
            <div className='text'>SB Hacks VIII</div>
          </div>
        }
        <div className='eventDateContainer'>
          <div className='eventDate'>
            <div className='text small'>January 28-30, 2022</div>
            <div className='text large'>Corwin Pavilion, UCSB</div>
          </div>
        </div>
      </div>
      {/* <div className='eventDateContainer'>
        <div className='eventDate'>
          <div className='text'>January 14-16, 2022</div>
          <div className='text'>Corwin Pavilion, UCSB</div>
        </div>
      </div> */}
      <img id='carnival' src={Carnival} alt='Carnival' />
    </div>
  );
}

export default MailingList;