import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import NavBar from "./NavBar";
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

import {
  makeStyles,
  Box,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Snackbar
} from "@material-ui/core";
import CopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";

import FilterOption from "./FilterOption";

import Background from "../assets/backgrounds/tileable_background.jpg";

const useStyles = makeStyles((theme) => ({
  fullWidthBox: {
    width: "100%",
    minHeight: "56px",
    color: "white",
  },
  floatLeft: {
    float: "left",
    fontSize: "1.1em",
  },
  floatRight: {
    float: "right"
  },
  button: {
    margin: "0 5px",
    backgroundColor: "#2FA0DF",
    color: "white",
    "&:hover": {
      backgroundColor: "#5FC5FF"
    }
  },
  resultContainer: {
    margin: "60px 0",
  },
  filteredEmailsWrapper: {
    backgroundColor: "#EEFFFF",
    padding: "60px 36px 72px 36px",
    borderRadius: "4px",
    color: "#365877"
  },
  mainContainer: {
    padding: "48px 24px 60px 24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: `url(${Background})`
  },
  backdrop: {
    zIndex: "100"
  },
  tokenContainer: {
    backgroundColor: "#EEFFFF",
    padding: "60px 36px 72px 36px",
    borderRadius: "4px",
    color: "#365877",
    width: "320px",
    transform: "translateY(-50%)"
  },
  submitButton: {
    width: "67%",
    marginTop: "10px",
    backgroundColor: "#2FA0DF",
    color: "white",
    "&:hover": {
      backgroundColor: "#5FC5FF"
    }
  }
}));

const ReportsMicroservice = () => {
  const classes = useStyles();

  const [authToken, setAuthToken] = useState("");
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  const [filteredEmails, setFilteredEmails] = useState([]);
  const [emailsCSV, setEmailsCSV] = useState("");

  const [tokenError, setTokenError] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);
  const [refreshStatus, setRefreshStatus] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const authenticate = (e) => {
    e.preventDefault();
    // console.log(authToken);

    setIsLoading(true);

    const params = { params: { authToken: authToken } };
    axios.get("/admin/getFilterOptions", params).then((res) => {
      // console.log(res.data);

      let initFilters = {};
      for (const [key, value] of Object.entries(res.data)) {
        if (Array.isArray(value)) {
          const valueSet = new Set(value);
          initFilters[key] = [...valueSet];
        }
        else {
          for (const [filter, options] of Object.entries(value)) {
            const valueSet = new Set(options);
            initFilters[filter] = [...valueSet];
          }
        }
      }
      setFilters(initFilters);

      setIsAuthSuccess(true);
      setIsLoading(false);
    }).catch(
      (err) => {
        console.log(`Error in getting filter options: ${err}`)
        setTokenError(true);
        setIsLoading(false);
      }
    );
  }

  const updateSelectedOptions = (filter, optionStates) => {
    setSelectedOptions({...selectedOptions, [filter]: optionStates});
  };

  const submitFilters = (e) => {
    e.preventDefault();

    setIsLoading(true);

    // console.log(selectedOptions);
    let body = {};
    for (const [key, value] of Object.entries(selectedOptions)) {
      if (value.length == 0 || value.length == filters[key].length) {
        continue;
      }
      body[key] = value;
    }

    // console.log(body);
    body.authToken = authToken;
    axios.post("/admin/getFilteredEmails2", body).then((res) => {
      // console.log(res.data);
      setFilteredEmails(res.data.filteredEmails);
      setEmailsCSV(res.data.filteredEmailsCSV);
      setIsLoading(false);
    }).catch(
      (err) => {
        console.log(`Error in getting filtered emails: ${err}`)
        setIsLoading(false);
      }
    );
  }

  const refreshLocations = () => {
    setIsLoading(true);

    const params = { params: { authToken: authToken } };
    axios.get("/admin/refreshLocationFilterOptions", params).then((res) => {
      axios.get("/admin/getFilterOptions", params).then((res) => {
        setFilters({...filters}, {...res.data.locations_options});
        setIsLoading(false);
        setRefreshStatus("Successfully updated location filters options");
      }).catch((err) => {
        setRefreshStatus(`Error in getting location filters after refresh: ${err}`)
        setIsLoading(false);
      });
    }).catch(
      (err) => {
        setRefreshStatus(`Error in refreshing location filter options: ${err}`)
        setIsLoading(false);
      }
    );
  }

  const copyToClipboard = (copyContent) => {
    navigator.clipboard.writeText(copyContent).then(() => {
      setCopyStatus("Successfully copied to clipboard");
    }, (err) => {
      setCopyStatus("Cannot copy to clipboard");
    });
  }

  const downloadCSV = (csvStr, filename) => {
    const blob = new Blob([csvStr], {type: "text/csv;charset=urf-8;"});
    
    let hiddenLink = document.createElement("a");
    const url = URL.createObjectURL(blob);
    hiddenLink.setAttribute("href", url);
    hiddenLink.setAttribute("download", filename);
    hiddenLink.style.visibility = "hidden";
    document.body.appendChild(hiddenLink);
    hiddenLink.click();
    document.body.removeChild(hiddenLink);
  }

  return (
    <Box className={classes.mainContainer}>
      {!isAuthSuccess ? 
        (
          <>
            <Container className={classes.tokenContainer}>
              <form onSubmit={authenticate}>
                <FormControl>
                  <TextField
                    label="Password"
                    type="password"
                    size="small"
                    onChange={(e) => {setAuthToken(e.target.value)}}
                    required
                  />
                </FormControl>
                <Button 
                  variant="contained" 
                  type="submit" 
                  className={classes.submitButton}
                >
                  SUBMIT
                </Button>
              </form>
            </Container>
            <Snackbar 
              open={tokenError}
              autoHideDuration={3000}
              onClose={() => setTokenError(false)}
              message="Incorrect password"
            />
          </>
        ) : (
          <>
            <Container>
              <Box className={classes.fullWidthBox}>
                <Typography
                  variant="h1"
                  className={classes.floatLeft}
                >
                  Filters
                </Typography>
                <Box className={classes.floatRight}>
                  <Button variant="contained" onClick={refreshLocations}>Refresh location filters</Button>
                  <Button variant="contained" onClick={submitFilters} className={classes.button}>FILTER</Button>
                </Box>
              </Box>
              <form>
                {Object.keys(filters).map((filter) => (
                  <FilterOption 
                    key={filter}
                    filterName={filter}
                    options={filters[filter]}
                    selectedOptions={selectedOptions[filter]}
                    selectedOptionsHandler={updateSelectedOptions}
                  />
                ))}
              </form>
            </Container>

            {(emailsCSV && emailsCSV.length > 0) && (
              <Container className={classes.resultContainer}>
                <Box className={classes.fullWidthBox}>
                  <Typography 
                    variant="h1"
                    className={classes.floatLeft}
                  >
                    {`Filtered Emails (${filteredEmails.length})`}
                  </Typography>
                  <Box className={classes.floatRight}>
                    <Button 
                      variant="contained" 
                      onClick={() => copyToClipboard(emailsCSV)}
                      className={classes.button}
                    >
                      <CopyIcon />
                    </Button>
                    <Button 
                      variant="contained"
                      onClick={() => downloadCSV(emailsCSV, "SBHacksVIII_filtered_emails")}
                      className={classes.button}
                    >
                      <DownloadIcon />
                    </Button>
                  </Box>
                </Box>
                <Container className={classes.filteredEmailsWrapper}>
                  {emailsCSV}
                </Container>
              </Container>
            )}
            <Snackbar
              open={copyStatus !== null}
              autoHideDuration={3000}
              onClose={() => setCopyStatus(null)}
              message={copyStatus}
            />
            <Snackbar
              open={refreshStatus !== null}
              autoHideDuration={3000}
              onClose={() => setRefreshStatus(null)}
              message={refreshStatus}
            />
            <Backdrop
              open={isLoading}
              onClick={() => setIsLoading(false)}
              className={classes.backdrop}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        )

      }

    </Box>
  );
};

export default ReportsMicroservice;
