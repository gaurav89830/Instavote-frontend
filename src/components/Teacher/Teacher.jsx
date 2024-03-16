import React, {useState, useEffect, useMemo} from 'react';
import {useStore} from '../../store/zustand';
import {useNavigate} from "react-router-dom";
import {io} from 'socket.io-client';
import {Slider} from '@mui/material';


const URL = 'http://localhost:3000';


const Teacher = () => {


    const {name, user} = useStore();
    const navigate = useNavigate()
    const socket = useMemo(() => io(URL), []);
    const [sliderTime, setSliderTime] = useState(20)
    const [timer, setTimer] = useState(0)
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [newQuestion, setNewQuestion] = useState({
        questionText: 'No Previous Question !',
        options: [
            {id: 1, optionVotes: 0, optionText: 'Option A'},
            {id: 2, optionVotes: 0, optionText: 'Option B'},
            {id: 3, optionVotes: 0, optionText: 'Option C'},
            {id: 4, optionVotes: 0, optionText: 'Option D'}
        ],
        correctId: -1,
        totalVotes: 0,
        timer: 0
    });

    const [formData, setFormData] = useState({
        questionText: "What would you like to call yourself ? ",
        options: [
            {id: 1, optionVotes: 0, optionText: "Software Developer"},
            {id: 2, optionVotes: 0, optionText: "Coder"},
            {id: 3, optionVotes: 0, optionText: "Programmer"},
            {id: 4, optionVotes: 0, optionText: "Software Engineer"},
        ],
        correctId: -1,
        totalVotes: 0,
        timer: 0
    });

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected " + socket.id)
        })
        socket.on("failed", (data) => {
            alert(data.msg)
        })
        socket.on("newQuestion", (data) => {
            setTimer(data.timer)
            startCountdown(data.timer);
            setNewQuestion(data)
        })
        socket.on("updateQuestion", (data) => {
            setNewQuestion(data)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (user === 'student' && name.length > 0)
            navigate('/student')
        if (user === '')
            navigate('/')
    }, []);

    const handleOptionChange = (id, newText) => {
        setFormData(prevState => ({
            ...prevState,
            options: prevState.options.map(option =>
                option.id === id ? {...option, optionText: newText} : option
            )
        }));
    };

    const handleQuestionTextChange = newText => {
        setFormData(prevState => ({...prevState, questionText: newText}));
    };

    const handleCorrectIdChange = newId => {
        setFormData(prevState => ({...prevState, correctId: newId}));
    };
    const handleOptionSelect = index => {
        // setSelectedOption(index);
        setFormData(prevState => ({...prevState, correctId: formData.options[index].id}));
    };


    const handleQuestionSubmit = () => {
        formData.timer = sliderTime
        socket.emit("uploadQuestion", {
            formData
        })
        socket.off("uploadQuestion");
    }
    const handleClearForm = () => {
        const resetData = {
            ...formData,
            questionText: " ",
            options: formData.options.map(option => ({...option, optionText: ""})),
            correctId: -1,
            totalVotes: 0,
        };
        setFormData(resetData);
    }

    function startCountdown(timer) {
        let count = timer;
        setSubmitDisabled(true)
        const countdownInterval = setInterval(() => {
            if (count <= 0) {
                clearInterval(countdownInterval);
                setSubmitDisabled(false)
            } else {
                setTimer(prevCount => prevCount - 1);
                count -= 1;
            }
        }, 1000);
    }
    return (
        <div className='flex justify-evenly items-center m-10 flex-col lg:flex-row'>
            <div className='w-[400px] sm:w-[800px] lg:w-[1000px] p-3 sm:p-20'>
                <div className="flex flex-col p-5">
                    <h1 className="text-4xl font-bold mb-8 text-center">Create New Question</h1>
                    <input
                        type="text"
                        placeholder="Enter your question"
                        className="w-full max-w-lg px-4 py-2 mb-4 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        value={formData.questionText}
                        onChange={e => handleQuestionTextChange(e.target.value)}
                    />
                    <div className="flex flex-col items-start">
                        {formData.options.map((option, index) => (
                            <div key={option.id} className="flex items-center mb-4">
                                <input
                                    type="radio"
                                    id={`option-${index}`}
                                    name="options"
                                    onChange={() => handleOptionSelect(index)}
                                    className="mr-2 h-6 w-6 rounded-full border-gray-300 focus:ring-indigo-500 checked:bg-indigo-500 checked:border-transparent"
                                />

                                <input
                                    type="text"
                                    placeholder={`Enter option ${index + 1}`}
                                    className="ml-4 px-4 py-2 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                    value={option.optionText}
                                    onChange={e => handleOptionChange(option.id, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='mt-5 w-[90%] mx-auto' >
                        <Slider
                            onChange={(event, newValue) => setSliderTime(newValue)}
                            aria-label="Timer"
                            defaultValue={20}
                            valueLabelDisplay="auto"
                            shiftStep={10}
                            step={10}
                            marks
                            min={10}
                            max={60}
                        />
                    </div>
                    <button
                        disabled={submitDisabled}
                        onClick={handleQuestionSubmit}
                        className="bg-blue-500 w-[200px] sm:w-[400px] mx-auto mt-5 text-white px-8 py-4 rounded-lg font-bold text-xl cursor-pointer hover:bg-blue-600 transition duration-300"
                    >
                        Submit
                    </button>
                    <button
                        disabled={submitDisabled}
                        onClick={handleClearForm}
                        className="bg-gray-500 w-[200px] sm:w-[400px] mx-auto mt-2 text-white px-8 py-4 rounded-lg font-bold text-xl cursor-pointer hover:bg-gray-600 transition duration-300"
                    >
                        Clear Form
                    </button>
                </div>
            </div>
            <div className='w-full'>
                <div className="p-8 bg-gray-200 rounded-lg w-[400px] mx-auto grid grid-cols-2 gap-4">
                    <h1 className="col-span-2 text-3xl font-bold tracking-wider  text-center">Poll Stats</h1>
                    <div className="relative flex flex-col items-center bg-white rounded-lg p-6 w-[150px] h-[90px]">
                        <p className="absolute top-3 text-lg mb-4">Timer</p>
                        <p className="absolute bottom-3 text-4xl font-bold">{timer}</p>
                    </div>
                    <div className="relative flex flex-col items-center bg-white rounded-lg p-6 w-[150px] h-[90px]">
                        <p className="absolute top-3 text-lg mb-4">Participated</p>
                        <p className="absolute bottom-3 text-4xl font-bold">{newQuestion.totalVotes}</p>
                    </div>
                    <div className="relative flex flex-col items-center bg-white rounded-lg p-6 w-[150px] h-[90px]">
                        <p className="absolute top-3 text-lg mb-4">Passed</p>
                        <p className="absolute bottom-3 text-4xl font-bold">{newQuestion.correctId <= -1 ? 0 : newQuestion.options[newQuestion.correctId - 1].optionVotes}</p>
                    </div>
                    <div className="relative flex flex-col items-center bg-white rounded-lg p-6 w-[150px] h-[90px]">
                        <p className="absolute top-3 text-lg mb-4">Failed</p>
                        <p className="absolute bottom-3 text-4xl font-bold">{newQuestion.correctId <= -1 ? 0 : (newQuestion.totalVotes - newQuestion.options[newQuestion.correctId - 1].optionVotes)} </p>
                    </div>
                </div>



                <div className="flex flex-col items-center justify-center pt-10">
                    <h1 className="text-2xl font-bold mb-8">{"Question Stats"}</h1>
                    <div className="grid gap-4 w-[400px] ">
                        {newQuestion.options.map((option, index) => (
                            <div
                                key={index}
                                className={` w-full relative bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-xl cursor-pointer transition duration-300 ${newQuestion.correctId === index + 1 ? 'bg-green-800' : 'bg-blue-600'
                                    }`}
                            >
                                {option.optionText}
                                <div className="absolute -translate-y-7 right-5 text-white">
                                    {isNaN(option.optionVotes / newQuestion.totalVotes) ? (
                                        ''
                                    ) : (
                                        `${((option.optionVotes / newQuestion.totalVotes) * 100).toFixed(0)}%`
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Teacher;
