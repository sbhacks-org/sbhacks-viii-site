import React, { useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";


const AuthenticationPage = (props) => {

    useEffect(() => {

    }, []);
    const [showLogin, setShowLogin] = useState(true);

    const loginSubmit = (e, email, password) => {

        e.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('Successful sign in');
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " | " + errorMessage)
            });

    }

    const registerSubmit = (e) => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('registered')
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " | " + errorMessage)
                // ..
            });
    }

    return (
        <div>
            <button handleSubmit={loginSubmit} onClick={() => { setShowLogin(true) }}>Login</button>
            <button handleSubmit={registerSubmit} onClick={() => { setShowLogin(false) }}>Register</button>
            {showLogin ?
                <AuthenticationForm submitTxt='Login' />
                : <AuthenticationForm submitTxt='Register' />

            }
        </div>
    )
}

export default AuthenticationPage;

export const AuthenticationForm = (props) => {
    const handleSubmit = props.handleSubmit;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const update = (e, set) => {
        e.preventDefault();
        console.log(e);
        set(e.target.value);
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, email, password)}>

            <input type='email' value={email} onChange={(e) => update(e, setEmail)} />
            <input type='password' value={password} onChange={(e) => update(e, setPassword)} />

            <button>{props.submitTxt}</button>
        </form>

    )
}