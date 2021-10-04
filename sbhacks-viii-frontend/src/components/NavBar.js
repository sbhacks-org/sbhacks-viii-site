import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import "../styles/NavBar.scss";

import Close from "../assets/images/close_icon.png";
import HamburgerIcon from "../assets/images/hamburger_menu_icon.png";

const NavBar = () => {
    const landingPageLink = 'https://sbhacks.com/';
    const landing = '#landing'; //'#landing';
    const intro = '#intro'; // '#intro';
    const devpost = 'https://sb-hacks-vii.devpost.com/';

    const faq = '#faq';
    const team = ''; //'#team';
    const sponsors = '#sponsors';
    const mentors = ''; //
    const volunteer = ''; // 'volunteer';
    const pastSite = ''; // 'https://sbhacksvii.com';

    const [open, setOpen] = useState(false);

    const toggleMobNavBar = () => {
        console.log('toggle mobile navbar')
        let navLinks = document.getElementById("navLinks");
        if (navLinks.style.display === "block") {
            navLinks.style.display = "none";
            setOpen(false);
        } else {
            navLinks.style.display = "block";
            setOpen(true)
        }
    }
    // const checkIfMobile = () => {
    //     if (window.innerWidth <= '768px') {
    //         toggleMobNavBar();
    //     }
    // }

    // useEffect(() => {
    //     window.addEventListener('resize', checkIfMobile);
    //     return () => window.removeEventListener('resize', checkIfMobile)
    // }, []);

    // SHOULD Replace A Tags that are links with <Link/>
    return (
        <div id='navBarContainer'>

            <div className="mobNavBar" style={{backgroundColor: (open) ? 'var(--mobile-background-color)': 'inherit'}}>
                {/* <!-- Navigation links (hidden by default) --> */}
                <div id="navLinks">
                    <a href={`${landing}`}>SB Hacks VIII</a>
                    <a href={`${intro}`}>About Us</a>
                    <a href={`${sponsors}`}>Sponsors</a>
                    <a href={`${faq}`}>FAQ</a>
                    {/* <a href={`${team}`}>TEAM</a> */}
                    <a href={`${devpost}`} target="_blank" rel="noopener noreferrer">Devpost</a>
                    {/* <Link href={`${landingPageLink}${volunteer}`}>VOLUNTEER</Link>
                    <Link href={`${landingPageLink}${pastSite}`}>SB HACKS VII</Link> */}
                </div>
                {/* <!-- "Hamburger menu" / "Bar icon" to toggle the navigation links --> */}
                <a href="javascript:void(0);" className="icon" onClick={toggleMobNavBar}>
                    {
                        open ?
                            <img className='mobileIcon' src={Close}/> :
                            <img className='mobileIcon' src={HamburgerIcon}/>
                    }
                    
                </a>
            </div>

            <div id="navBar">
                <ul>
                    {/* <li><Link className='last' href={`${landingPageLink}${pastSite}`}>SB HACKS VII</Link></li>
                    <li><Link href={`${landingPageLink}${volunteer}`}>VOLUNTEER</Link></li>
                    <li><Link href={`${landingPageLink}${mentors}`}>MENTOR</Link></li> */}
                    <li><a className='last' href={`${devpost}`} target="_blank" rel="noopener noreferrer">Devpost</a></li>
                    <li><a href={`${sponsors}`}>Sponsors</a></li>
                    {/* <li><a href={`${team}`}>TEAM</a></li> */}
                    <li><a href={`${faq}`}>FAQ</a></li>
                    <li><a href={`${intro}`}>About Us</a></li>
                    <li><a href={`${landing}`}>SB Hacks VIII</a></li>
                </ul>
            </div>

        </div>
    );
}

export default NavBar;