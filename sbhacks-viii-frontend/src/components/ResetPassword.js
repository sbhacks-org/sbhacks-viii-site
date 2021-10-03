import React, { useState } from 'react';
import {
    getAuth,
    sendPasswordResetEmail,
} from "firebase/auth";
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');

    const resetPassword = (e, email) => {
        e.preventDefault();
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                // ..
                console.log("password email reset sent");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " | " + errorMessage);
                // ..
            });
    };
    const update = (e, set) => {
        e.preventDefault();
        set(e.target.value);
    };


    return (
        <div>
            <form>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => update(e, setEmail)}
                />
                <button onClick={(e) => resetPassword(e, email)}>Reset Password</button>
            </form>
            <Link to='login'>Login</Link>
        </div>
    )
}

export default ResetPassword;