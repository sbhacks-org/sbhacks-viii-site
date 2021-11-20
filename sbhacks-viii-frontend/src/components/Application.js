import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/Application.scss";

import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Background from "../assets/backgrounds/tileable_background.jpg";
import Back from "../assets/images/back_arrow.png";

import { flatMap } from "lodash";
import { Link, useHistory } from "react-router-dom";
import Schools from "../consts/Schools";
import Genders from "../consts/Genders";
import Majors from "../consts/Majors";
import ShirtSizes from "../consts/ShirtSizes";
import EthnicityOptions from "../consts/EthnicityOptions";
import LevelOfStudyOptions from "../consts/LevelOfStudy";
import GradYearOptions from "../consts/GradYearOptions";

import Autocomplete from '@mui/material/Autocomplete';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';


const useStyles = makeStyles((theme) => ({
  container: {
    backgroundImage: `url(${Background})`,
    height: "fit-content",
  },
  centerContainer: {
    paddingTop: "7%",
    paddingBottom: "7%",
  },
  backArrow: {
    position: "absolute",
    [theme.breakpoints.up("xl")]: {
        left: "85px",
    },
    [theme.breakpoints.between("md", "lg")]: {
        left: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "0vw",
        visibility: "hidden",
      },
  },
  formContainer: {
    // paddingTop: "20px",
    padding: "35px",
    margin: "0 auto",
    color: "#365877",
    [theme.breakpoints.up("xl")]: {
      width: "800px",
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
    },
    background: "#EEFFFF",
    borderRadius: "50px",
  },
  formControl: {
    width: "65%",
    margin: "auto",
  },
  formControlFrq: {
    margin: "auto",
    width: "75%",
  },
  frqLabel: {
    fontWeight: "bold",
  },
  frqContainer: {
    backgroundColor: "#C6E9F4",
    borderRadius: "30px",
    padding: "0px 30px 30px 30px",
  },
  charCount: {
    position: "absolute",
    right: "10px",
    bottom: "10px",
    fotnSize: "15px",
  },
  saveBtn: {
    border: "none",
    textAlign: "center",
    padding: "15px 32px",
    display: "inline-block",
    color: "white",
    background: "#2FA0DF",
    borderRadius: "75px",
    fontSize: "36px",
    width: "40%",
    fontFamily: "NexaBold",
    "&:hover": {
      background: "#5FC5FF",
      cursor: "pointer",
    },
    margin: "auto",
    marginBottom: "40px",
    marginTop: "20px",
  },
    mcLabel: {
        textAlign: "left",
        paddingTop:"32px"
    }
}));
const inputProps = {
  style: {
    textAlign: "left",
    fontFamily: "NexaBold",
    fontSize: "16px",
    color: "#365877",
  },
};
const InputLabelProps = { style: {} };

const Application = () => {
  const classes = useStyles();

  const [appFields, setAppFields] = useState(undefined);

  const [phoneN, setPhoneN] = useState("");
  const [lvlStudy, setLvlStudy] = useState("");
  const [school, setSchool] = useState("");
  const [gradYr, setGradYr] = useState("");
  const [major, setMajor] = useState("");
  const [tShrtSize, setTShrtSize] = useState("");
  const [resume, setResume] = useState(undefined);
  const [resumeURL, setResumeUrl] = useState("");
  const [resumeUploadFlag, setResumeUploadFlag] = useState(false);
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [didHackathon, setDidHackathon] = useState("");
  const [attendSbHacks, setAttendSbHacks] = useState("");
  const [hearSbHacks, setHearSbHacks] = useState("");

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const [pWebsite, setPWebsite] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [linkedIn, setLinkedIn] = useState("");

  const [frq1, setFrq1] = useState("");
  const [frq2, setFrq2] = useState("");

  const [agrMLH, setAgrMLH] = useState(false);
  const [agrEmail, setAgrEmail] = useState(false);
  const [shareInfo, setShareInfo] = useState(false);

  // user data
  const [uid, setUid] = useState(undefined);
  const [emailAddress, setEmailAddress] = useState(undefined);
  const [fname, setFname] = useState(undefined);
  const [lname, setLname] = useState(undefined);

  const history = useHistory();
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        console.log(user);
        console.log(user.emailVerified);

        if (!user.emailVerified) {
          // email not verified so redirect to login
          history.push("/login");
        }
        // console.log(user.uid)
        setUid(user.uid);

        axios
          .get("/userdb/getAppFields", { params: { uid: user.uid } })
          .then(async (res) => {
            console.log(res.data);

            setAppFields(res.data);

            setPhoneN(res.data.phoneNumber);
            setLvlStudy(res.data.studyLevel);
            setSchool(res.data.universityName);
            setGradYr(res.data.gradYear);
            setMajor(res.data.major);
            setTShrtSize(res.data.tshirtSize);
            if (res.data.resumeLink != null && res.data.resumeLink.length > 0) {
              try {
                /* resume cant really be used i think
                                    I don't think im getting file properly*/
                // const resumeFile = await axios.get(res.data.resumeLink);
                const resumeFile = <img src={res.data.resumeLink} />;
                setResume(resumeFile);
                setResumeUrl(res.data.resumeLink);
                console.log("link to resume: " + res.data.resumeLink);
              } catch (err) {
                console.log("Error in getting resume: " + err);
              }
            }
            setGender(res.data.gender);
            setEthnicity(res.data.ethnicity);
            setDidHackathon(res.data.beenToHackathon);
            setAttendSbHacks(res.data.beenToSBHacks);
            setHearSbHacks(res.data.hearAboutSBHacks);

            setAddress1(res.data.shippingAddressLine1);
            setAddress2(res.data.shippingAddressLine2);
            setCity(res.data.city);
            setState(res.data.state);
            setZipCode(res.data.zipCode);
            setCountry(res.data.country);

            setGitHub(res.data.github);
            setLinkedIn(res.data.linkedin);
            setPWebsite(res.data.website);

            setFrq1(res.data.essay_answer1);
            setFrq2(res.data.essay_answer2);

            setAgrMLH(res.data.mlhCodeAgree);
            setAgrEmail(res.data.mlhCommAgree);
            setShareInfo(res.data.privacyAgree);

            // setUid(res.data.uid);
            setEmailAddress(res.data.emailAddress);
            setFname(res.data.fname);
            setLname(res.data.lname);
          })
          .catch((err) => {
            console.log("Error in getting user data: " + err);
          });
        // ...
      } else {
        history.push("/login");
      }
    });
    // */
  }, []);
  const uploadResume = async (e) => {
    if (e) e.preventDefault();
    const auth = getAuth();
    const resumeName = auth.currentUser.uid + "_resume";
    const storage = getStorage();
    const storageRef = ref(storage, resumeName);

    // 'file' comes from the Blob or File API
    console.log("resume var: " + resume);
    const file = resume;

    console.log(file.name.substring(file.name.length - 3));

    if (file.size >= 5000000) {
      alert("Resume not saved: please keep file size under 5MB");
      return;
    } else if (
      file.name.length < 3 ||
      file.name.substring(file.name.length - 3) !== "pdf"
    ) {
      alert("Resume not saved: please upload pdfs only");
      return;
    }

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log("download url: " + url);
    setResumeUrl(url); // is async but I cant await it so I must return url
    return url;
  };

  const saveApp = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);

    if (user != null) {
      const newAppFields = appFields === undefined ? {} : { ...appFields };
      newAppFields.emailAddress = emailAddress;
      newAppFields.fname = fname;
      newAppFields.lname = lname;
      newAppFields.gender = gender;
      newAppFields.ethnicity = ethnicity;
      newAppFields.phoneNumber = phoneN;
      newAppFields.studyLevel = lvlStudy;
      newAppFields.tshirtSize = tShrtSize;
      newAppFields.shippingAddressLine1 = address1;
      newAppFields.shippingAddressLine2 = address2;
      newAppFields.city = city;
      newAppFields.state = state;
      newAppFields.zipCode = zipCode;
      newAppFields.country = country;
      if (resumeUploadFlag) {
        newAppFields.resumeLink = await uploadResume();
      }
      newAppFields.website = pWebsite;
      newAppFields.github = gitHub;
      newAppFields.linkedin = linkedIn;
      newAppFields.gradYear = gradYr;
      newAppFields.universityName = school;
      newAppFields.major = major;
      newAppFields.beenToHackathon = didHackathon;
      newAppFields.beenToSBHacks = attendSbHacks;
      newAppFields.hearAboutSBHacks = hearSbHacks;
      newAppFields.essay_answer1 = frq1;
      newAppFields.essay_answer2 = frq2;
      newAppFields.mlhCodeAgree = agrMLH;
      newAppFields.privacyAgree = shareInfo;
      newAppFields.mlhCommAgree = agrEmail;

      setAppFields(newAppFields);
      // console.log(uid)
      axios
        .post("/userdb/saveApp", { uid: uid, update_info: newAppFields })
        .then((res) => {
          console.log("Successfully saved data!");
          console.log(res.data);

          history.push("/dashboard");
        })
        .catch((err) => {
          console.log("Error when saving application data: " + err);
          console.log(err.response.data.error);

          history.push("/dashboard");
        });
    }
  };

    const update = (e, set) => {
        e.preventDefault();
        if (typeof e.target.value == "string") {
            if (e.target.value.length > 1200) return;
        }
        set(e.target.value);
    };

    /* Make required fields not required to save app. They are only required for status to be complete */
    return (
        <div id="hackerApp" className={classes.container}>
            <div className={classes.centerContainer}>
                <img className={`${classes.backArrow} clickable`} src={Back} onClick={() => history.push('/dashboard')}/>
                <div className={classes.formContainer}>
                    <h1 className={classes.title}>SB Hacks VIII Hacker Application</h1>
                    <form onSubmit={saveApp}>
                        <h2>General Info</h2>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Phone Number *"
                                type="text"
                                value={phoneN}
                                onChange={(e) => update(e, setPhoneN)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl>
                        {/* <FormControl className={classes.formControl}>
                            <TextField
                                label="Level of Study *"
                                type="text"
                                value={lvlStudy}
                                onChange={(e) => update(e, setLvlStudy)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl> */}
                        <FormControl className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>Level of Study *</FormLabel>
                                <RadioGroup
                                    aria-label="Level of Study"
                                    defaultValue={lvlStudy}
                                    name="Level of Study"
                                    value={lvlStudy}
                                    onChange={(e, newVal) => {
                                        setLvlStudy(newVal);
                                    }}
                                >
                                    {LevelOfStudyOptions.map((val, id) => {
                                        return <FormControlLabel value={val} control={<Radio />} label={val} />
                                    })}
                                </RadioGroup>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="school-dropdown"
                                freeSolo
                                value={school}
                                options={Schools}
                                onChange={(e, newSchool) => {
                                    setSchool(newSchool);
                                }}
                                renderInput={(params) => <TextField {...params} label="School *" />}
                            />
                        </FormControl>
                        {/* <FormControl className={classes.formControl}>
                            <TextField
                                label="Expected Graduation Year *"
                                type="text"
                                value={gradYr}
                                onChange={(e) => update(e, setGradYr)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl> */}
                        <FormControl className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>Expected Graduation Year *</FormLabel>
                                <RadioGroup
                                    aria-label="Expected Graduation Year"
                                    defaultValue={gradYr}
                                    name="Expected Graduation Year"
                                    value={gradYr}
                                    onChange={(e, newVal) => {
                                        setGradYr(newVal);
                                    }}
                                >
                                    {GradYearOptions.map((val, id) => {
                                        return <FormControlLabel value={val} control={<Radio />} label={val} />
                                    })}
                                </RadioGroup>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="school-dropdown"
                                freeSolo
                                value={major}
                                options={Majors}
                                onChange={(e, newMajor) => {
                                    setMajor(newMajor);
                                }}
                                renderInput={(params) => <TextField {...params} label="Major *" />}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>T-Shirt Size *</FormLabel>
                                <RadioGroup
                                    aria-label="TShirtSize"
                                    defaultValue={tShrtSize}
                                    name="TShirtSIze"
                                    value={tShrtSize}
                                    onChange={(e, newVal) => {
                                        setTShrtSize(newVal);
                                    }}
                                >
                                    {ShirtSizes.map((val, id) => {
                                        return <FormControlLabel value={val} control={<Radio />} label={val} />
                                    })}
                                </RadioGroup>
                        </FormControl>

                        <FormControl
                            className={classes.formControl}
                            style={{ marginTop: "16px", textAlign: "left" }}
                        >
                            <Typography
                                style={{
                                    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                                    fontSize: "1rem",
                                    fontWeight: 400,
                                    color: "#6d7575",
                                }}
                            >
                                Resume *
                            </Typography>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file.size >= 5000000) {
                                        alert("Resume not saved: please keep file size under 5MB")
                                    } else if (file.name.substring(file.name.length - 3) !== "pdf") {
                                        alert("Resume not saved: please upload pdfs only")
                                    } else {
                                        setResume(e.target.files[0]); setResumeUploadFlag(true)
                                    }
                                }
                                }
                            />
                        </FormControl>

                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>Gender</FormLabel>
                            <RadioGroup
                                aria-label="gender"
                                defaultValue={gender}
                                name="genders"
                                value={gender}
                                onChange={(e, newGender) => {
                                    setGender(newGender);
                                }}
                            >
                                {Genders.map((val, id) => {
                                    return <FormControlLabel value={val} control={<Radio />} label={val} />
                                })}
                            </RadioGroup>
                            {/* <TextField
                                label="Gender"
                                type="text"
                                value={gender}
                                onChange={(e) => update(e, setGender)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            /> */}
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>Ethnicity</FormLabel>
                                <RadioGroup
                                    aria-label="Ethnicity"
                                    defaultValue={ethnicity}
                                    name="Ethnicity"
                                    value={ethnicity}
                                    onChange={(e, newVal) => {
                                        setEthnicity(newVal);
                                    }}
                                >
                                    {EthnicityOptions.map((val, id) => {
                                        return <FormControlLabel value={val} control={<Radio />} label={val} />
                                    })}
                                </RadioGroup>
                        </FormControl>
                        {/* <FormControl className={classes.formControl}>
                            <TextField
                                label="Ethnicity"
                                type="text"
                                value={ethnicity}
                                onChange={(e) => update(e, setEthnicity)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl> */}
                        {/* <FormControl className={classes.formControl}>
                            <TextField
                                label="Have you participated in a hackathon before?"
                                type="text"
                                value={didHackathon}
                                onChange={(e) => update(e, setDidHackathon)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl> */}
                        <FormControl className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>Have you participated in a hackathon before?</FormLabel>
                                <RadioGroup
                                    aria-label="Have you participated in a hackathon before?"
                                    defaultValue={didHackathon}
                                    name="Have you participated in a hackathon before?"
                                    value={didHackathon}
                                    onChange={(e, newVal) => {
                                        setDidHackathon(newVal);
                                    }}
                                >
                                    {["Yes", "No"].map((val, id) => {
                                        return <FormControlLabel value={val} control={<Radio />} label={val} />
                                    })}
                                </RadioGroup>
                        </FormControl>
                        {/* <FormControl className={classes.formControl}>
                            <TextField
                                label="Have you attended SB Hacks?"
                                type="text"
                                value={attendSbHacks}
                                onChange={(e) => update(e, setAttendSbHacks)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl> */}
                        <FormControl className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>Have you attended SB Hacks?</FormLabel>
                                <RadioGroup
                                    aria-label="Have you attended SB Hacks?"
                                    defaultValue={attendSbHacks}
                                    name="Have you attended SB Hacks?"
                                    value={attendSbHacks}
                                    onChange={(e, newVal) => {
                                        setAttendSbHacks(newVal);
                                    }}
                                >
                                    {["Yes", "No"].map((val, id) => {
                                        return <FormControlLabel value={val} control={<Radio />} label={val} />
                                    })}
                                </RadioGroup>
                        </FormControl>
                        {/* <FormControl className={classes.formControl}>
                            <TextField
                                label="How did you hear about SB Hacks?"
                                type="text"
                                value={hearSbHacks}
                                onChange={(e) => update(e, setHearSbHacks)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl> */}
                        <FormControl className={classes.formControl}>
                            <FormLabel component="legend" className={classes.mcLabel}>How did you hear about SB Hacks?</FormLabel>
                                <RadioGroup
                                    aria-label="How did you hear about SB Hacks?"
                                    defaultValue={hearSbHacks}
                                    name="How did you hear about SB Hacks?"
                                    value={hearSbHacks}
                                    onChange={(e, newVal) => {
                                        setHearSbHacks(newVal);
                                    }}
                                >
                                    {["Email", "Website", "Social Media", "Friend/Colleague", "Workshop", "Other"].map((val, id) => {
                                        return <FormControlLabel value={val} control={<Radio />} label={val} />
                                    })}
                                </RadioGroup>
                        </FormControl>
                        <h2>Shipping Address</h2>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Address Line 1 *"
                                type="text"
                                value={address1}
                                onChange={(e) => update(e, setAddress1)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Address Line 2"
                                type="text"
                                value={address2}
                                onChange={(e) => update(e, setAddress2)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="City *"
                                type="text"
                                value={city}
                                onChange={(e) => update(e, setCity)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="State *"
                                type="text"
                                value={state}
                                onChange={(e) => update(e, setState)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Zip Code *"
                                type="text"
                                value={zipCode}
                                onChange={(e) => update(e, setZipCode)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Country *"
                                type="text"
                                value={country}
                                onChange={(e) => update(e, setCountry)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl>

                        <h2>Additional Links</h2>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="GitHub"
                                type="text"
                                value={gitHub}
                                onChange={(e) => update(e, setGitHub)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="LinkedIn"
                                type="text"
                                value={linkedIn}
                                onChange={(e) => update(e, setLinkedIn)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Personal Website/Portfolio"
                                type="text"
                                value={pWebsite}
                                onChange={(e) => update(e, setPWebsite)}
                                inputProps={inputProps}
                                InputLabelProps={InputLabelProps}
                                size="small"
                                margin="normal"
                                fullWidth
                            // required
                            />
                        </FormControl>

                        <h2>Free Response</h2>

                        <FormControl className={classes.formControlFrq}>
                            <Typography variant="subtitle1" className={classes.frqLabel}>
                                Tell us about your favorite project and the challenges you
                                overcame (1200 characters max)
                            </Typography>
                            <div className={classes.frqContainer}>
                                <TextField
                                    label="Enter your response"
                                    type="text"
                                    multiline
                                    rows={8}
                                    value={frq1}
                                    onChange={(e) => update(e, setFrq1)}
                                    inputProps={inputProps}
                                    InputLabelProps={InputLabelProps}
                                    // size="small"
                                    margin="normal"
                                    fullWidth
                                // required
                                />
                                <div className={classes.charCount}>{frq1 ? frq1.length : 0}/1200</div>
                            </div>
                        </FormControl>
                        <br />
                        <br />
                        <FormControl className={classes.formControlFrq}>
                            <Typography variant="subtitle1" className={classes.frqLabel}>
                                How would you defend yourself during a zombie apocalypse with
                                only items in your backpack that you brought to SB Hacks? (1200
                                characters max)
                            </Typography>
                            <div className={classes.frqContainer}>
                                <TextField
                                    label="Enter your response"
                                    type="text"
                                    multiline
                                    rows={8}
                                    value={frq2}
                                    onChange={(e) => update(e, setFrq2)}
                                    inputProps={inputProps}
                                    InputLabelProps={InputLabelProps}
                                    // size="small"
                                    margin="normal"
                                    fullWidth
                                // required
                                />
                                <div className={classes.charCount}>{frq2 ? frq2.length : 0}/1200</div>
                            </div>
                        </FormControl>
                        <br />
                        <br />
                        <FormControlLabel
                            className={classes.formControlFrq}
                            label="I have read and agree to the MLH Code of Conduct *"
                            control={
                                <Checkbox
                                    checked={agrMLH}
                                    onChange={(e) => setAgrMLH(e.target.checked)}
                                />
                            }
                        />
                        <br />
                        <br />
                        <FormControlLabel
                            className={classes.formControlFrq}
                            label="I authorize MLH to send me pre- and post-event informaitonal emails, which contain free credit and opportunites from their partners. *"
                            control={
                                <Checkbox
                                    checked={agrEmail}
                                    onChange={(e) => setAgrEmail(e.target.checked)}
                                />
                            }
                        />
                        <br />
                        <br />
                        <FormControlLabel
                            className={classes.formControlFrq}
                            label="I authorize you to share my application/registration information
              with Major League Hacking for event adminstration, ranking, and
              MLH administration in line with the MLH Privacy Policy. I further
              agree to the terms of both the MLH Contest Terms and Conditions
              and the MLH Privacy Policy. *"
              control={
                <Checkbox
                  checked={shareInfo}
                  onChange={(e) => setShareInfo(e.target.checked)}
                />
              }
            />
            <br />
            <br />
            <br />
            <br />
            <Typography variant="subtitle2" className={classes.frqLabel}>
              You can edit and save your application as many times as you wish
              before the deadline. It will be automatically submitted for review
              past the deadline.
            </Typography>
            <br/>
            <Typography variant="subtitle2" className={classes.frqLabel}>
              *Questions marked with an asterisk are required for a complete application.
            </Typography>
            <input className={classes.saveBtn} type="submit" value="SAVE" />
            <Typography variant="subtitle2" className={classes.frqLabel}>
              Encountering problems? Email us at{" "}
              <a href="mailto:team@sbhacks.com">team@sbhacks.com</a>!
            </Typography>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Application;
