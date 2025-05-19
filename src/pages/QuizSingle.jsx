import React, { useContext, useEffect, useState } from 'react'
import { FaGooglePlus } from "react-icons/fa";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebase_app } from '../FirebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { IoLogOutOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { userContext } from '../MainContext';
import { TbReload } from "react-icons/tb";







export default function QuizSingle() {

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
        <>

            <ToastContainer />

            <section className='w-full min-h-[100vh] border'>
                <div className='flex flex-col justify-center items-center container mx-auto py-[50px]'>
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
                    <div>

                        {
                            userDtls
                                ?
                                allQuestion.length >= 1
                                    ?
                                    <div>
                                        <h1 className='text-4xl text-red-600 text-center py-5'>
                                            Play Quiz
                                        </h1>

                                        <div className='w-[600px]'>
                                            <QuizQues questions={allQuestion} handleScore={handleScore} setUserScore={setUserScore} />
                                        </div>
                                    </div>
                                    :
                                    <h1 className='text-red-600 text-2xl text-center'>
                                        No Question Uploaded Yet!!
                                    </h1>

                                :
                                <h1 className='text-2xl text-center font-semibold mt-10'>
                                    Please login to attend quiz
                                </h1>
                        }

                    </div>
                </div>
            </section>
        </>
    )
}

function QuizQues({ questions, handleScore, setUserScore }) {

    let [currentQuesIndex, setCurrentQuesIndex] = useState(0);

    let [cAns, setCAns] = useState('')
    let [originalAns, setOriginalAns] = useState('')

    let ttlQues = questions.length;

    // Wait for data to be fetched
    if (ttlQues === 0) {
        return <h2 className='text-xl text-center'>Loading questions...</h2>;
    }

    // Prevent going out of bounds
    if (currentQuesIndex >= ttlQues) {
        return (
            <div className='flex flex-col justify-center items-center'>
                <h2 className='text-xl text-center mt-5'>
                    Quiz Completed...
                </h2>
                <button type="button" className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium 
                    rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none 
                    dark:focus:ring-blue-800 cursor-pointer mt-3 flex items-center gap-2"
                    onClick={() => {
                        setCurrentQuesIndex(0)
                        setUserScore([])
                    }}
                >
                    <TbReload />
                    Attend Quiz Again
                </button>
            </div>
        )
    }

    const { question, option1, option2, option3, option4, correctAns } = questions[currentQuesIndex];

    let finalCorrAns = ''
    switch (correctAns.toLowerCase()) {
        case 'a': finalCorrAns = option1; break;
        case 'b': finalCorrAns = option2; break;
        case 'c': finalCorrAns = option3; break;
        case 'd': finalCorrAns = option4; break;
    }



    let resetStoredState = () => {
        setCAns('')
        setOriginalAns('')
    }


    let index = currentQuesIndex;

    return (

        <div>

            {/* cAns = {cAns}
            <br />
            originalAns = {originalAns}
            <br /> */}

            <div className='bg-stone-200 rounded-md w-full p-5 shadow-2xl border border-yellow-800'>
                <h1 className='text-3xl mb-5'>
                    {currentQuesIndex + 1}. {question}
                </h1>
                <ul>
                    <li
                        className={`
                            
                            py-3 px-5 text-[18px] text-white cursor-pointer 
                            mb-2 rounded-md

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
                                        'bg-yellow-800 hover:bg-yellow-900 duration-300'
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
                        className={`
                             
                            py-3 px-5 text-[18px] text-white cursor-pointer 
                            mb-2 rounded-md

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
                                        'bg-yellow-800 hover:bg-yellow-900 duration-300'
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
                        className={`
                            
                            py-3 px-5 text-[18px] text-white cursor-pointer 
                            mb-2 rounded-md

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
                                        'bg-yellow-800 hover:bg-yellow-900 duration-300'
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
                        className={`
                            
                            py-3 px-5 text-[18px] text-white cursor-pointer 
                            mb-2 rounded-md

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
                                        'bg-yellow-800 hover:bg-yellow-900 duration-300'
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

            <div className='my-5 flex justify-between'>
                <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                    hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
                    font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center justify-center gap-2
                    cursor-pointer"
                    disabled={currentQuesIndex == 0}
                    onClick={() => {
                        setCurrentQuesIndex(currentQuesIndex - 1)
                        resetStoredState()
                    }}
                >
                    <FaArrowLeft />
                    Previous
                </button>

                <button type="button"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                        focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm 
                        px-5 py-2.5 text-center me-2 mb-2 flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => {
                        setCurrentQuesIndex(currentQuesIndex + 1)
                        resetStoredState()
                    }}
                >
                    Next
                    <FaArrowRight />
                </button>
            </div>

        </div>

    )

}