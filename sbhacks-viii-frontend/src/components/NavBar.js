import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';

import "../styles/NavBar.scss";

const NavBar = () => {
    const landingPageLink = 'https://sbhacks.com/';
    const landing = '#landing'; //'#landing';
    const intro = '#intro'; // '#intro';
    const faq = ''; //'#faq';
    const team = ''; //'#team';
    const sponsors = ''; //'#sponsors';
    const mentors = ''; //
    const volunteer = ''; // 'volunteer';
    const pastSite = ''; // 'https://sbhacksvii.com';

    const toggleMobNavBar = () => {
        console.log('toggle mobile navbar')
        let x = document.getElementById("navLinks");
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
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

            <div className="mobNavBar">
                {/* <!-- Navigation links (hidden by default) --> */}
                <div id="navLinks">
                    <a href={`${landing}`}>SB HACKS IIX</a>
                    <a href={`${intro}`}>INTRO</a>
                    <a href={`${faq}`}>FAQ</a>
                    <a href={`${team}`}>TEAM</a>
                    <a href={`${sponsors}`}>SPONSORS</a>
                    <Link href={`${landingPageLink}${mentors}`}>MENTOR</Link>
                    <Link href={`${landingPageLink}${volunteer}`}>VOLUNTEER</Link>
                    <Link href={`${landingPageLink}${pastSite}`}>SB HACKS V</Link>
                </div>
                {/* <!-- "Hamburger menu" / "Bar icon" to toggle the navigation links --> */}
                <a href="javascript:void(0);" className="icon" onClick={toggleMobNavBar}>
                    <div className="fa fa-bars" id="burgerIcon" ></div>
                    <div className="fa fa-bars" id="burgerIcon" ></div>
                    <div className="fa fa-bars" id="burgerIcon" ></div>
                </a>
            </div>

            <div id="navBar">
                <ul>
                    <li><Link className='last' href={`${landingPageLink}${pastSite}`}>SB HACKS VII</Link></li>
                    <li><Link href={`${landingPageLink}${volunteer}`}>VOLUNTEER</Link></li>
                    <li><Link href={`${landingPageLink}${mentors}`}>MENTOR</Link></li>
                    <li><a href={`${sponsors}`}>SPONSORS</a></li>
                    <li><a href={`${team}`}>TEAM</a></li>
                    <li><a href={`${faq}`}>FAQ</a></li>
                    <li><a href={`${intro}`}>INTRO</a></li>
                    <li><a href={`${landing}`}>SB HACKS IIX</a></li>
                </ul>
            </div>

        </div>
    );
}

export default NavBar;