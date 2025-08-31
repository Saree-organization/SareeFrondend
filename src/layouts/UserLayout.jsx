import React from 'react'
import Navbar from '../non-outlates/Navbar'
import Footer from '../non-outlates/Footer'
import { Outlet } from 'react-router-dom'
function UserLayout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default UserLayout