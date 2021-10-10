import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const Application = () => {
    const [phoneN, setPhoneN] = useState('');
    const [lvlStudy, setLvlStudy] = useState('');
    const [school, setSchool] = useState('');
    const [gradYr, setGradYr] = useState('');
    const [major, setMajor] = useState('');
    const [tShrtSize, , setTShrtSize] = useState('');
    const [resume, setResume] = useState(undefined);
    const [resumeURL, setResumeUrl] = useState('');
    const [gender, setGender] = useState('');
    const [ethnicity, setEthnicity] = useState('');
    const [didHackathon, setDidHackathon] = useState(false);
    const [attendSbHacks, setAttendSbHacks] = useState(false);
    const [hearSbHacks, setHearSbHacks] = useState('');

    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');

    const [gitHub, setGitHub] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const [pWebsite, setPWebsite] = useState('');

    const [frq1, setFrq1] = useState('');
    const [frq2, setFrq2] = useState('');

    const [agrMLH, setAgrMLH] = useState(false);
    const [agrEmail, , setAgrEmail] = useState(false);
    const [shareInfo, setShareInfo] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                axios.get("/userdb/getAppFields", { params: { uid: user.uid } })
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch(err => {
                        console.log("Error in getting user data: " + err);
                    })
                // ...
            } else {
                // User is signed out
                // ...
            }
        });

    })
    const uploadResume = (e) => {
        e.preventDefault();
        const auth = getAuth();
        const resumeName = auth.currentUser.uid + "_resume";
        const storage = getStorage();
        const storageRef = ref(storage, resumeName);

        // 'file' comes from the Blob or File API
        console.log(resume);
        const file = resume;
        uploadBytes(storageRef, file).then((snapshot) => {
            const storage = getStorage();
            getDownloadURL(storageRef)
                .then((url) => {
                    // url is resume link string
                    // call API to update resume link here
                    setResumeUrl(url);
                })
                .catch((error) => {
                    // Handle any errors
                });
            console.log("Uploaded a blob or file!");
        });
    };

    const saveApp = (e) => {
        e.preventDefault();
    }

    const update = (e, set) => {
        e.preventDefault();
        set(e.target.value);
    };

    return (
        <div>
            <h1>SB Hacks VIII Hacker Application</h1>
            <form onSubmit={saveApp}>
                <h2>General Info</h2>
                <input type='text' placeholder="Phone Number" value={phoneN} onChange={(e) => update(e, setPhoneN)} required={true} />
                <input type='text' placeholder="Level of Study" value={lvlStudy} onChange={(e) => update(e, setLvlStudy)} required={true} />
                <input type='text' placeholder="School" value={school} onChange={(e) => update(e, setSchool)} required={true} />
                <input type='text' placeholder="Expected Graduation Year" value={gradYr} onChange={(e) => update(e, setGradYr)} required={true} />
                <input type='text' placeholder="Major/Field of Study" value={major} onChange={(e) => update(e, setMajor)} required={true} />
                <input type='text' placeholder="T-Shirt Size" value={tShrtSize} onChange={(e) => update(e, setTShrtSize)} required={true} />
                <input type="file" onChange={(e) => setResume(e.target.files[0])} />
                <button onClick={(e) => uploadResume(e)}>Submit Resume</button>
                <input type='text' placeholder="Gender"  value={gender} onChange={(e) => update(e, setGender)} />
                <input type='text' placeholder="Ethnicity" value={ethnicity} onChange={(e) => update(e, setEthnicity)} />
                <input type='text' placeholder="have you participated in a hackathon before"  value={didHackathon} onChange={(e) => update(e, setDidHackathon)} />
                <input type='text' placeholder="Have you attended SB Hacks"  value={attendSbHacks} onChange={(e) => update(e, setAttendSbHacks)} />
                <input type='text' placeholder="How did you hear about SB Hacks"  value={hearSbHacks} onChange={(e) => update(e,setHearSbHacks )} />

                <h2>Shipping Address</h2>
                <input type='text' placeholder="Address Line 1"  value={address1} onChange={(e) => update(e, setAddress1)} required={true}/>
                <input type='text' placeholder="Address Line 2"  value={address2} onChange={(e) => update(e, setAddress2)} />
                <input type='text' placeholder="State"  value={state} onChange={(e) => update(e, setState)} />
                <input type='text' placeholder="Country"  value={country} onChange={(e) => update(e, setCountry)} required={true}/>

                <h2>Additional Links</h2>
                <input type='text' placeholder="GitHub"  value={gitHub} onChange={(e) => update(e, setGitHub)} />
                <input type='text' placeholder="LinkedIn"  value={linkedIn} onChange={(e) => update(e, setLinkedIn)} />
                <input type='text' placeholder="Personal Website/Portfolio"  value={pWebsite} onChange={(e) => update(e, setPWebsite)} />

                <h2>Free Response</h2>
                <label for="frq1">Tell us about your favorite project and the challenges you overcame (180 words max)</label>
                <input id="frq1" type='textfield' placeholder="This is the answer to a free response question"  value={frq1} onChange={(e) => update(e, setFrq1)} />
                <label for="frq2">How would you defend yourself during a zombie apocalypse with only items in your backpack that you brought to SB Hacks? (180 words max) (180 words max)</label>
                <input id="frq2" type='textfield' placeholder="This is the answer to a free response question"  value={frq2} onChange={(e) => update(e, setFrq2)} />

                <input type="checkbox" id="agreeMLH" value={agrMLH} onChange={(e) => update(e, setAgrMLH)} />
                <label for="agreeMLH">I have read and agree to the MLH Code of Conduct</label>
                <input type="checkbox" id="agrEmail" value={agrEmail} onChange={(e) => update(e, setAgrEmail)} />
                <label for="agrEMail">I authorize MLH to send me pre- and post-event informaitonal emails, which contian free credit and opportunites from their partners.</label>
                <input type="checkbox" id="shareInfo" value={shareInfo} onChange={(e) => update(e, setShareInfo)} />
                <label for="shareInfo">I authorize you to share my application/registration information with Major League Hacking for event adminstration, ranking, and MLH adminsitraation in line with the MLH Privacy Policy. I further agree to the terms of both the MLH COntest Terms and Conditions and the MLH Privacy Policy.</label>

                <input type="submit" value="Save"/>
            </form>
        </div>
    )
}

export default Application;