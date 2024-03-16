import React, {useEffect, useState, useMemo} from 'react';
import {useStore} from '../../store/zustand';
import {useNavigate} from "react-router-dom";
import {io} from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

let timer;

const Student = () => {
  const navigate = useNavigate();
  const socket = useMemo(() => io(URL), []);
  const {user} = useStore();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSelectionLocked, setIsSelectionLocked] = useState(false);
  const [isTeacherPresent, setIsTeacherPresent] = useState(true)// check this later
  const [isQuesAvailable, setIsQuesAvailabe] = useState(false)

  const [newQuestion, setNewQuestion] = useState({
    questionText: 'temp',
    options: [
      {id: 1, optionVotes: 0, optionText: 'a'},
      {id: 2, optionVotes: 0, optionText: 'b'},
      {id: 3, optionVotes: 0, optionText: 'c'},
      {id: 4, optionVotes: 0, optionText: 'd'}
    ],
    correctId: 3,
    totalVotes: 0,
    timer: 20
  });


  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected " + socket.id)
    })

    socket.on("newQuestion", (data) => {
      // post question
      // time logic
      clearTimeout(timer)
      timer = setTimeout(() => {
        setIsSelectionLocked(true)
        setIsQuesAvailabe(false)
      }, data.timer * 1000)

      setSelectedOption(null)
      setIsSelectionLocked(false)
      setNewQuestion(data)
      setIsQuesAvailabe(true);
    })

    socket.on("updateQuestion", (data) => {
      // this is stats update
      setNewQuestion(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])


  useEffect(() => {
    if (user === '')
      navigate('/')
    if (user === 'teacher') {
      navigate('/teacher')
    }
  }, []);




  const handleOptionClick = (option) => {
    if (!isSelectionLocked) {
      console.log(option)
      setSelectedOption(option);
      setIsSelectionLocked(true);
      console.log(selectedOption)
      socket.emit("submit", {
        choosedAns: option
      })

    }
  };


  return (
    <div className=' mt-20 flex justify-center items-center'>
      {!isQuesAvailable && <div className="flex flex-col items-center justify-center mt-[15%]">
        <h1 className="text-4xl font-bold mb-8 mx-10">{isTeacherPresent ? "Waiting for teacher to ask question..." : "Teacher Left"}</h1>
      </div>}

      {isQuesAvailable && <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">{newQuestion.questionText}</h1>
        <div className="grid gap-4">
          {newQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`w-[350px] relative px-8 py-4 rounded-lg font-bold text-xl cursor-pointer transition duration-300 
              ${selectedOption !== null && index + 1 === newQuestion.correctId ? 'bg-green-800 text-white' :
                  selectedOption === index ? 'bg-red-600 text-white' : 'bg-blue-500 text-white'}`}
              onClick={() => handleOptionClick(index)}
            >
              {option.optionText}
              {selectedOption !== null && (
                <div className="absolute -translate-y-7 right-5 text-white ">  {!isNaN(option.optionVotes / newQuestion.totalVotes) ?
                  `${((option.optionVotes / newQuestion.totalVotes) * 100).toFixed(2).replace(/\.?0*$/, '')}%` :
                  ''
                }</div>
              )}
            </div>
          ))}
        </div>
      </div>}
    </div>
  )
}

export default Student;
