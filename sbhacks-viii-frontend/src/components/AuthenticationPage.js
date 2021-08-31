import React, { useEffect, useState } from "react";

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";

const AuthenticationPage = (props) => {
    useEffect(() => { }, []);
    const [showLogin, setShowLogin] = useState(true);
    const [email, setEmail] = useState('');

    // might be helpful: https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
    }, []);

    const loginSubmit = (e, email, password) => {
        e.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("Successful sign in");
                console.log(user);

                // TO DO: Update last signed in time through backend
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " | " + errorMessage);
            });
    };

    const registerSubmit = (e, email, password) => {
        e.preventDefault();
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("registered");
                console.log(user);
                // ...
                sendEmailVerification(auth.currentUser).then(() => {
                    // Email verification sent!
                    // ...
                    console.log('verificaiton email sent');
                });

                console.log(user.uid)   // use this for identifying user in backend

                // TO DO: add to db 
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " | " + errorMessage);
                // ..
            });
    };
    const resetPassword = (e, email) => {
        e.preventDefault();
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                // ..
                console.log('password email reset sent')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " | " + errorMessage);
                // ..
            });
    }

    const update = (e, set) => {
        e.preventDefault();
        set(e.target.value);
    }

    return (
        <div>
            <button
                onClick={() => {
                    setShowLogin(true);
                }}
            >
                Login
            </button>
            <button
                onClick={() => {
                    setShowLogin(false);
                }}
            >
                Register
            </button>
            {showLogin ? (
                <AuthenticationForm handlesubmit={loginSubmit} submitTxt="Login" />
            ) : (
                <AuthenticationForm
                    handlesubmit={registerSubmit}
                    submitTxt="Register"
                />
            )}
            <form>
                <input type="email" value={email} onChange={(e) => update(e, setEmail)} />
                <button onClick={(e) => resetPassword(e, email)}>Reset Password</button>
            </form>
        </div>
    );
};

export default AuthenticationPage;

export const AuthenticationForm = (props) => {
    const handleSubmit = props.handlesubmit;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const update = (e, set) => {
        e.preventDefault();
        set(e.target.value);
    };

    return (
        <form onSubmit={(e) => handleSubmit(e, email, password)}>
            <input type="email" value={email} onChange={(e) => update(e, setEmail)} />
            <input
                type="password"
                value={password}
                onChange={(e) => update(e, setPassword)}
            />

            <button>{props.submitTxt}</button>
        </form>
    );
};
