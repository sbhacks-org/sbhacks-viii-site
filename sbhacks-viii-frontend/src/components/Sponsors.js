import React from "react";
import { makeStyles, Grid, Typography } from "@material-ui/core";

import landmark from "../assets/images/landmark.svg"; // with import
import firebase from "../assets/images/sponsors/firebase.png";
import logmein from "../assets/images/sponsors/logmein.png";

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
    fontSize: 54,
  },
  text: {
    paddingTop: 30,
    lineHeight: "250%",
    fontFamily: "NexaLight",
    fontSize: 24,
  },
  tier1Logo: {
    width: "75%",
  },
  tier2Logo: {
    width: "100%",
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
    <div className={classes.root}>
      <Typography
        variant="h4"
        color="textPrimary"
        className={classes.textPrimary}
      >
        {/* <img src={landmark} className={classes.landmark} /> */}
        Sponsors
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
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier1Logo} />
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
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
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
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={3} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
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
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
          </a>
        </Grid>
        <Grid item xs={2} className={classes.logoContainer}>
          <a target="_blank" href="https://www.logmein.com/">
            <img src={logmein} className={classes.tier2Logo} />
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
