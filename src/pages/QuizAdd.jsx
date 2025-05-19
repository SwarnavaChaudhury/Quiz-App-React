import React, { useEffect, useState } from 'react'
import { FaGooglePlus } from "react-icons/fa";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { firebase_app } from '../FirebaseConfig';
import { ToastContainer, toast } from 'react-toastify';






export default function QuizAdd() {


    const [editingId, setEditingId] = useState(null);  // currently editing
    const [editValues, setEditValues] = useState(null);  // pre-fill form




    // fetch data from database
    let [allQuestion, setAllQuestion] = useState([])

    useEffect(() => {
        const db = getDatabase(firebase_app);
        const quizRef = ref(db, 'quiz/');

        onValue(quizRef, (snapshot) => {
            const data = snapshot.val();

            let finalQuestion = [];

            for (let key in data) {
                finalQuestion.push({
                    id: key,          // 🔑 Firebase key
                    ...data[key]      // 📄 Quiz object
                });
            }

            setAllQuestion(finalQuestion);
        });
    }, []);








    const handleDelete = (id) => {
        const db = getDatabase(firebase_app);
        const quizRef = ref(db, 'quiz/' + id);

        if (confirm("Confirm remove this question?")) {

            // delete quiz question by sending "null"
            set(quizRef, null)
                .then(() => toast.success("Question Deleted"))
                .catch((err) => console.error(err));
        }

    };









    // upload question to database
    const handleSave = (event) => {
        event.preventDefault();
        const db = getDatabase(firebase_app);

        let quizObj = {
            question: event.target.quiz_ques.value,
            option1: event.target.ans_one.value,
            option2: event.target.ans_two.value,
            option3: event.target.ans_three.value,
            option4: event.target.ans_four.value,
            correctAns: event.target.ans_correct.value,
        };

        if (editingId) {
            // Update existing
            set(ref(db, 'quiz/' + editingId), quizObj)
                .then(() => {
                    toast.success("Question Updated");
                    event.target.reset();
                    setEditingId(null);
                    setEditValues(null);
                });
        } else {
            // Add new
            set(ref(db, 'quiz/' + new Date().getTime() + "-quizid"), quizObj)
                .then(() => {
                    toast.success("Question Added");
                    event.target.reset();
                });
        }
    };





    return (
        <>

            <ToastContainer />

            <section className='min-h-[100vh] flex flex-col justify-center items-center gap-10'>

                {/* <div>
                    <button className='flex items-center justify-center gap-2 text-[18px] border rounded-md py-3 px-5 bg-blue-600 font-bold text-white cursor-pointer'>
                        <FaGooglePlus />
                        Login with Google
                    </button>
                </div> */}
                <div className='mt-5'>
                    <div className='w-[500px] border p-5'>
                        <h1 className='text-red-600 text-4xl text-center mb-5'>
                            Add Quiz
                        </h1>
                        <form onSubmit={handleSave}>
                            <div>
                                <label htmlFor="quiz_ques" className='block font-bold mb-1'>
                                    Add Question
                                </label>
                                <textarea
                                    name="quiz_ques"
                                    id="quiz_ques"
                                    className='border w-full resize-none h-[100px] rounded-lg pl-2 py-1'
                                    placeholder='Enter Question Here...'
                                    defaultValue={editValues ? editValues.question : ""}></textarea>
                            </div>
                            <div>
                                <label htmlFor="ans_one" className='block font-bold mb-1 mt-5'>
                                    Option 1
                                </label>
                                <input type="text" name="ans_one" id="ans_one" className='border w-full h-[40px] rounded-lg pl-2' placeholder='Enter option 1' defaultValue={editValues ? editValues.option1 : ""} />
                            </div>
                            <div>
                                <label htmlFor="ans_two" className='block font-bold mb-1 mt-5'>
                                    Option 2
                                </label>
                                <input type="text" name="ans_two" id="ans_two" className='border w-full h-[40px] rounded-lg pl-2' placeholder='Enter option 2' defaultValue={editValues ? editValues.option2 : ""} />
                            </div>
                            <div>
                                <label htmlFor="ans_three" className='block font-bold mb-1 mt-5'>
                                    Option 3
                                </label>
                                <input type="text" name="ans_three" id="ans_three" className='border w-full h-[40px] rounded-lg pl-2' placeholder='Enter option 3' defaultValue={editValues ? editValues.option3 : ""} />
                            </div>
                            <div>
                                <label htmlFor="ans_four" className='block font-bold mb-1 mt-5'>
                                    Option 4
                                </label>
                                <input type="text" name="ans_four" id="ans_four" className='border w-full h-[40px] rounded-lg pl-2' placeholder='Enter option 4' defaultValue={editValues ? editValues.option4 : ""} />
                            </div>
                            <div>
                                <label htmlFor="ans_correct" className='block font-bold mb-1 mt-5'>
                                    Correct Answer
                                </label>
                                <input type="text" name="ans_correct" id="ans_correct" className='border w-full h-[40px] rounded-lg pl-2' placeholder='Enter Correct Option' defaultValue={editValues ? editValues.correctAns : ""} />
                            </div>
                            <div className='text-center'>
                                <button type='submit' className='bg-violet-500 text-white font-semibold py-3 px-10 rounded-lg mt-5 cursor-pointer'>
                                    Add Question
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='mb-10 mt-5'>


                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Question
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Option 1
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Option 2
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Option 3
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Option 4
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center">
                                        Correct Answer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allQuestion.map((quesItem, index) => (
                                        <ShowStoredQuestion
                                            key={quesItem.id}
                                            quesItem={quesItem}
                                            index={index}
                                            onDelete={handleDelete}
                                            onEdit={(item) => {
                                                setEditingId(item.id);
                                                setEditValues(item);
                                            }}
                                        />
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>

                </div>

            </section>

        </>
    )
}




function ShowStoredQuestion({ quesItem, index, onDelete, onEdit }) {
    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {index + 1}. {quesItem.question}
            </th>
            <td className="px-6 py-4">
                {quesItem.option1}
            </td>
            <td className="px-6 py-4">
                {quesItem.option2}
            </td>
            <td className="px-6 py-4">
                {quesItem.option3}
            </td>
            <td className="px-6 py-4">
                {quesItem.option4}
            </td>
            <td className="px-6 py-4 font-bold text-center">
                {quesItem.correctAns}
            </td>
            <td className="px-6 py-4 flex gap-2">
                <button onClick={() => onEdit(quesItem)} className="bg-yellow-400 px-3 py-1 rounded text-white cursor-pointer">
                    Edit
                </button>
                <button onClick={() => onDelete(quesItem.id)} className="bg-red-500 px-3 py-1 rounded text-white cursor-pointer">
                    Delete
                </button>
            </td>
        </tr>
    );
}
