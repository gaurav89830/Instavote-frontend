import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Nav/Navbar'
import Home from './components/Home'
import Student from './components/Student/Student'
import Teacher from './components/Teacher/Teacher'

const App = () => {
  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' element={<><Navbar showLogoutButton={false} /><Home /></>} />
        <Route path='/student' element={<><Navbar /><Student /></>} />
        <Route path='/teacher' element={<><Navbar /> <Teacher /></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App