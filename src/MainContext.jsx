import React, { createContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebase_app } from './FirebaseConfig';



export let userContext = createContext();

export default function MainContext({ children }) {




    let [userDtls, setUserDtls] = useState(localStorage.getItem("user_dtls") ? JSON.parse(localStorage.getItem("user_dtls")) : [])
    let [userToken, setUserToken] = useState(localStorage.getItem("user_token") ? localStorage.getItem("user_token") : null)


    useEffect(() => {
        localStorage.setItem("user_dtls", JSON.stringify(userDtls))
        localStorage.setItem("user_token", userToken)
    }, [userDtls, userToken])








    let [userScore, setUserScore] = useState([])

    // console.log(userScore)
    let handleScore = (qIndex, qStatus) => {
        let checkQuesIndex = userScore.filter((item, index) => item.indx == qIndex)
        if (checkQuesIndex.length > 0) {
            // already present
            toast.info("You have already answered the question.");
        } else {
            // new element inserted
            let scoreObj = {
                'indx': qIndex,
                'stus': qStatus
            }
            let updatedScore = [...userScore, scoreObj]
            setUserScore(updatedScore)
            if (qStatus == "incorrect") {
                toast.error("Wrong Answer");
            } else {
                toast.success("Correct Answer");
            }

        }

    }







    let userLogin = () => {

        const auth = getAuth(firebase_app);
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                setUserDtls(user)
                setUserToken(token)

            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });

    }








    let userObj = {
        userDtls,
        setUserDtls,
        userToken,
        setUserToken,
        userScore,
        setUserScore,
        handleScore,
        userLogin
    }




    return (
        <userContext.Provider value={userObj}>
            {children}
        </userContext.Provider>
    )
}