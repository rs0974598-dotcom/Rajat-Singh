
import React from 'react'
import Nav from '../features/shared/Components/Nav'
import { Outlet } from 'react-router-dom'

const AppleLayout = () => {
  return (
    <div>
        <Nav/>
        <Outlet/>
    </div>
  )
}

export default AppleLayout