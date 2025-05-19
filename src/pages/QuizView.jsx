import React, { useContext, useEffect, useState } from 'react'
import { FaGooglePlus } from "react-icons/fa";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebase_app } from '../FirebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { IoLogOutOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import { userContext } from '../MainContext';






export default function QuizView() {

    let { userDtls, setUserDtls, userToken, setUserToken, userScore, setUserScore, handleScore, userLogin } = useContext(userContext)





    let [allQuestion, setAllQuestion] = useState([])

    useEffect(() => {

        const db = getDatabase(firebase_app);
        const quizRef = ref(db, 'quiz/');

        onValue(quizRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(data); // return object contains all questions-answers object

            let finalQuestion = []

            for (let key in data) {
                // console.log(data[key])
                finalQuestion.push(data[key])
            }

            setAllQuestion(finalQuestion)

        });

    }, [])





    return (
        <div>

            <ToastContainer />

            <section className='min-h-[100vh] flex flex-col justify-start items-center gap-10 mt-10'>

                <div className='sticky top-0 p-5 bg-white border border-violet-600'>
                    {
                        userDtls
                            ?
                            <div>
                                <div className='flex justify-between items-center gap-10'>
                                    <h1 className='text-2xl'>
                                        Hello, {userDtls.displayName}
                                    </h1>
                                    <button
                                        className='text-2xl text-red-600 cursor-pointer'
                                        onClick={() => {
                                            setUserDtls(null)
                                            setUserToken('')
                                        }}
                                    >
                                        <IoLogOutOutline />
                                    </button>
                                </div>
                                <div>
                                    <h1 className='text-xl text-center'>
                                        Your score is: &nbsp;
                                        {
                                            userScore.filter(item => item.stus === "correct").length
                                        }
                                        &nbsp;||&nbsp;
                                        Out of: &nbsp;
                                        {
                                            allQuestion.length
                                        }
                                    </h1>
                                </div>
                            </div>
                            :
                            <button className='flex items-center justify-center gap-2
                                text-[18px] border rounded-md py-3 px-5 bg-blue-600 
                                font-bold text-white cursor-pointer'

                                onClick={userLogin}
                            >
                                <FaGooglePlus />
                                Login with Google
                            </button>
                    }
                </div>
                <div className='max-w-[700px] mx-auto'>
                    <h1 className='text-red-600 text-4xl text-center mb-5'>
                        Play Quiz
                    </h1>

                    {
                        userDtls
                            ?
                            <div>
                                {
                                    allQuestion.length >= 1
                                        ?
                                        allQuestion.map((questionItem, index) => {

                                            return (

                                                <QuestionItems ques={questionItem} index={index} key={index} handleScore={handleScore} />

                                            )

                                        })
                                        :
                                        <h1 className='text-red-600 text-2xl text-center'>
                                            No Question Uploaded Yet!!
                                        </h1>

                                }
                            </div>
                            :
                            <h1 className='text-2xl text-center font-semibold'>
                                Please login to attend quiz
                            </h1>
                    }

                </div>

            </section>

        </div>
    )
}



function QuestionItems({ ques, index, handleScore }) {

    let [cAns, setCAns] = useState('')
    let [originalAns, setOriginalAns] = useState('')

    let { question, option1, option2, option3, option4, correctAns } = ques

    let finalCorrAns = ''
    if (correctAns == 'A' || correctAns == 'a') {
        finalCorrAns = option1
    }
    if (correctAns == 'B' || correctAns == 'b') {
        finalCorrAns = option2
    }
    if (correctAns == 'C' || correctAns == 'c') {
        finalCorrAns = option3
    }
    if (correctAns == 'D' || correctAns == 'd') {
        finalCorrAns = option4
    }


    return (
        <div className='border w-full p-5 bg-stone-100 rounded-lg shadow-xl mb-5'>
            <h3 className='text-3xl font-bold mb-2'>
                {index + 1}. {question}
            </h3>

            <ul>
                <li
                    className={`border text-2xl p-2 mb-2 
                                text-white  
                                duration-200 cursor-pointer
                        
                        ${option1 == cAns
                            ?
                            'bg-green-500'
                            :
                            (cAns == 1)
                                ?
                                'bg-red-500'
                                :
                                (option1 == originalAns)
                                    ?
                                    'bg-green-500'
                                    :
                                    'bg-stone-700'
                        }

                        `}
                    onClick={(event) => {
                        let userAns = event.target.innerHTML.trim();
                        let ansStatus = ''
                        if (userAns == finalCorrAns) {
                            setCAns(userAns)
                            ansStatus = "correct"
                        } else {
                            setCAns(1)
                            ansStatus = "incorrect"
                        }

                        setOriginalAns(finalCorrAns)
                        handleScore(index, ansStatus)
                    }}
                >
                    {option1}
                </li>
                <li
                    className={`border text-2xl p-2 mb-2 
                                text-white  
                                duration-200 cursor-pointer
                        
                        ${option2 == cAns
                            ?
                            'bg-green-500'
                            :
                            (cAns == 2)
                                ?
                                'bg-red-500'
                                :
                                (option2 == originalAns)
                                    ?
                                    'bg-green-500'
                                    :
                                    'bg-stone-700'
                        }

                        `}
                    onClick={(event) => {
                        let userAns = event.target.innerHTML.trim();
                        let ansStatus = ''
                        if (userAns == finalCorrAns) {
                            setCAns(userAns)
                            ansStatus = "correct"
                        } else {
                            setCAns(2)
                            ansStatus = "incorrect"
                        }

                        setOriginalAns(finalCorrAns)
                        handleScore(index, ansStatus)
                    }}
                >
                    {option2}
                </li>
                <li
                    className={`border text-2xl p-2 mb-2 
                                text-white  
                                duration-200 cursor-pointer
                        
                        ${option3 == cAns
                            ?
                            'bg-green-500'
                            :
                            (cAns == 3)
                                ?
                                'bg-red-500'
                                :
                                (option3 == originalAns)
                                    ?
                                    'bg-green-500'
                                    :
                                    'bg-stone-700'
                        }

                        `}
                    onClick={(event) => {
                        let userAns = event.target.innerHTML.trim();
                        let ansStatus = ''
                        if (userAns == finalCorrAns) {
                            setCAns(userAns)
                            ansStatus = "correct"
                        } else {
                            setCAns(3)
                            ansStatus = "incorrect"
                        }

                        setOriginalAns(finalCorrAns)
                        handleScore(index, ansStatus)
                    }}
                >
                    {option3}
                </li>
                <li
                    className={`border text-2xl p-2 mb-2 
                                text-white  
                                duration-200 cursor-pointer
                        
                        ${option4 == cAns
                            ?
                            'bg-green-500'
                            :
                            (cAns == 4)
                                ?
                                'bg-red-500'
                                :
                                (option4 == originalAns)
                                    ?
                                    'bg-green-500'
                                    :
                                    'bg-stone-700'
                        }

                        `}
                    onClick={(event) => {
                        let userAns = event.target.innerHTML.trim();
                        let ansStatus = ''
                        if (userAns == finalCorrAns) {
                            setCAns(userAns)
                            ansStatus = "correct"
                        } else {
                            setCAns(4)
                            ansStatus = "incorrect"
                        }

                        setOriginalAns(finalCorrAns)
                        handleScore(index, ansStatus)
                    }}
                >
                    {option4}
                </li>
            </ul>
        </div>
    )

}