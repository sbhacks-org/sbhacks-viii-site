import React from "react";
import { makeStyles, Grid, Typography } from "@material-ui/core";

import landmark from "../assets/images/landmark.svg"; // with import
import otter from "../assets/images/otter_balloon_cart.svg";

const useStyles = makeStyles((theme) => ({
  landmark: {
    width: 18,
    paddingRight: 20,
  },
  otter: {
    [theme.breakpoints.up("md")]: {
      width: "30vw",
    },
    [theme.breakpoints.down("sm")]: {
      width: "60vw",
    },
  },
  root: {
    flexGrow: 1,
    backgroundColor: "#043563",
    paddingTop: 20,
    paddingBottom: 20,
  },
  textContainer: {
    textAlign: "left",
    paddingLeft: 20,
  },
  textPrimary: {
    fontFamily: "NexaBold",
    fontSize: 34,
  },
  text: {
    paddingTop: 30,
    lineHeight: "250%",
    fontFamily: "NexaBold",
    fontSize: 16,
  },
  otterContainer: {
    [theme.breakpoints.up("md")]: {
      textAlign: "left",
    },
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
}));

const About = () => {
  const classes = useStyles();

  return (
    <div id="intro" className={classes.root}>
      <Grid container justifyContent="center" alignItems="center" spacing={0}>
        <Grid item md={12} lg={7} style={{ padding: 40 }}>
          <div className={classes.textContainer}>
            <Typography
              variant="h4"
              color="textPrimary"
              className={classes.textPrimary}
            >
              <img src={landmark} className={classes.landmark} />
              About Us
            </Typography>

            <Typography
              variant="body1"
              className={classes.text}
              color="textSecondary"
            >
              SB Hacks is a 400-person, 36-hour annual hackathon hosted at the
              University of California, Santa Barbara. This year, SB Hacks will
              be held virtually, so you can participate from the comfort of your
              home. This event aims to expose college students to the technology
              industry and provide the necessary resources to get hands-on
              experience in coding. Whether you are a first-time coder or a
              seasoned hacker, we encourage you to enter SB Hacks with
              enthusiasm and curiosity. Our hope is that you challenge yourself
              with a fun project, learn something new along the way, and feel
              proud of what you have accomplished at the end of it all.
            </Typography>
          </div>
        </Grid>
        <Grid item md={12} lg={5} style={{ width: "100%" }}>
          <div className={classes.otterContainer}>
            <img src={otter} className={classes.otter} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default About;
