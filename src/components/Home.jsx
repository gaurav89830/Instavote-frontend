import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import {useStore} from '../store/zustand';

const Home = () => {
    const navigate = useNavigate();
    const {user, name, setUserType} = useStore();

    const studentHandler = () => {
        setUserType("student")
    }

    const teacherHandler = () => {
        setUserType("teacher")
    }


    useEffect(() => {
        if (user === 'teacher') {
            navigate('/teacher')
        }
        if (user === 'student' && name != "")
            navigate('/student')
    }, []);


    // user name 
    const [username, setUsername] = useState('');

    const handleChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserType("student", username)
        navigate('/student')
    };

    return (
        user === 'student' ?

            <div className="flex flex-col items-center justify-center  mt-[15%]">
                <h1 className="text-3xl font-bold mb-8">Please enter your name?</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-[300px]">
                    <input
                        type="text"
                        value={username}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full max-w-lg px-4 py-2 mb-4 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-8 py-2 rounded-lg font-bold text-xl cursor-pointer hover:bg-blue-600 transition duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div> :

            <div className="flex flex-col items-center justify-center mt-[20%]">
                <h1>{user}</h1>
                <h1 className="text-4xl font-bold mb-8">What kind of user are you?</h1>
                <div className="flex">
                    <Link onClick={studentHandler} to="/" className="bg-blue-500 text-white px-12 py-6 mr-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300">
                        <h2 className="text-2xl font-bold">Student</h2>
                    </Link>
                    <Link onClick={teacherHandler} to="/teacher" className="bg-green-500 text-white px-12 py-6 rounded-lg cursor-pointer hover:bg-green-600 transition duration-300">
                        <h2 className="text-2xl font-bold">Teacher</h2>
                    </Link>
                </div>
            </div>

    );
}

export default Home;
