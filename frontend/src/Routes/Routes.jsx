import React from 'react'
import {Route,Routes} from "react-router-dom"
import PrivateRoute from '../Components/PrivateRoute'
import Home from '../Pages/Home'
import Signin from '../Pages/Signin'
import Signup from '../Pages/Signup'

const Router = () => {
  return (
    <Routes>
     
     <Route path="/home" element={
       <PrivateRoute>
     <Home/>
     </PrivateRoute>
     } />
     <Route path="/signup" element={<Signup/>} />
     <Route path="/signin" element={<Signin/>} />
    </Routes>
  )
}

export default Router