import React from "react";
import { makeStyles, Grid, Typography } from "@material-ui/core";

import landmark from "../assets/images/landmark.svg"; // with import
import asfb from "../assets/images/sponsors/asfb.png";
import firebase from "../assets/images/sponsors/firebase.png";
import logmein from "../assets/images/sponsors/logmein.png";
import gcp from "../assets/images/sponsors/gcp.png";
import invoca from "../assets/images/sponsors/invoca.png";
import alcon from "../assets/images/sponsors/alcon.png";
import amazon from "../assets/images/sponsors/amazon.png";
import appfolio from "../assets/images/sponsors/appfolio.png";
import payjunction from "../assets/images/sponsors/payjunction.png";
import lockheed from "../assets/images/sponsors/lockheed.png";
import coe from "../assets/images/sponsors/coe.png";
import ccs from "../assets/images/sponsors/ccs.png";
import balsamiq from "../assets/images/sponsors/balsamiq.png";
import osl from "../assets/images/sponsors/osl.png";
import comgrants from "../assets/images/sponsors/comgrants.png";
import synapse from "../assets/images/sponsors/synapse.png";
import hvmn from "../assets/images/sponsors/hvmn.png";
import zest from "../assets/images/sponsors/zest.png";
import yachak from "../assets/images/sponsors/yachak.png";
import stickermule from "../assets/images/sponsors/stickermule.png";
import pressedjuicery from "../assets/images/sponsors/pressedjuicery.png";

const useStyles = makeStyles((theme) => ({
  landmark: {
    width: 18,
    paddingRight: 20,
  },
  root: {
    flexGrow: 1,
    backgroundColor: "#043563",
    padding: "0 10%",
    paddingTop: "10vh",
    textAlign: "center",
  },
  textContainer: {
    textAlign: "left",
    paddingLeft: 20,
  },
  textPrimary: {
    fontFamily: "NexaBold",
    fontSize: 34,
    paddingBottom: 20,
  },
  text: {
    paddingTop: 30,
    lineHeight: "250%",
    fontFamily: "NexaLight",
    fontSize: 24,
  },
  tier1Logo: {
    width: "40%",
  },
  tier2Logo: {
    width: "75%",
  },
  logoContainer: {
    "&:hover": {
      opacity: 0.7,
    },
  },
  sponsorGrid: {
    justifyContent: "center",
  },
  link: {
    color: "#fab664",
    "&:hover": {
      opacity: 0.8,
    },
  },
}));

const Sponsors = () => {
  const classes = useStyles();

  return (
    <div id='sponsors' className={classes.root}>
      <Typography
        variant="h4"
        color="textPrimary"
        className={classes.textPrimary}
      >
        {/* <img src={landmark} className={classes.landmark} /> */}
        Past Sponsors
      </Typography>

      {/* Tier 1 */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={0}
        className={classes.sponsorGrid}
      >
        <Grid item xs={12} className={classes.logoContainer}>
          <a target="_blank" href="https://asfb.as.ucsb.edu/">
            <img src={asfb} className={classes.tier1Logo} />
          </a>
        </Grid>
      </Grid>

      {/* Tier 2 */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className={classes.sponsorGrid}
      >
        <Grid item xs={6} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={6} className={classes.logoContainer}>
          <a target="_blank" href="https://firebase.google.com/">
            <img src={firebase} className={classes.tier2Logo} />
          </a>
        </Grid>
      </Grid>

      {/* Tier 3 */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className={classes.sponsorGrid}
      >
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://cloud.google.com/">
            <img src={gcp} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.invoca.com/">
            <img src={invoca} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.alcon.com/">
            <img src={alcon} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.appfolio.com/">
            <img src={appfolio} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.amazon.jobs/sba-california/">
            <img src={amazon} className={classes.tier2Logo} />
          </a>
        </Grid>
        {/* <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid> */}
      </Grid>

      {/* Tier 4 */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className={classes.sponsorGrid}
      >
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.payjunction.com/payments/">
            <img src={payjunction} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a
            target="_blank"
            href="https://www.lockheedmartin.com/en-us/index.html"
          >
            <img src={lockheed} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://engineering.ucsb.edu/">
            <img src={coe} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://ccs.ucsb.edu/">
            <img src={ccs} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.balsamiq.com/">
            <img src={balsamiq} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="http://osl.sa.ucsb.edu/">
            <img src={osl} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a
            target="_blank"
            href="http://osl.sa.ucsb.edu/campus-organizations/finding-funding/community-grants"
          >
            <img src={comgrants} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="http://www.drinksynapse.com/">
            <img src={synapse} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://hvmn.com/">
            <img src={hvmn} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.zesttea.com/">
            <img src={zest} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://yachak.com/">
            <img src={yachak} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://pressedjuicery.com/">
            <img src={pressedjuicery} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="http://hackp.ac/mlh-stickermule-hackathons">
            <img src={stickermule} className={classes.tier2Logo} />
          </a>
        </Grid>
      </Grid>

      <Typography variant="h3" className={classes.text} color="textSecondary">
        Interested in sponsoring? Contact us at{" "}
        <a href="mailto:sponsors@sbhacks.com" className={classes.link}>
          sponsors@sbhacks.com
        </a>
      </Typography>
    </div>
  );
};

export default Sponsors;
