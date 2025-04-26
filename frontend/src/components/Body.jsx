import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const Body = () => {
  const { user } = useSelector(store => store.app);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [])
  
  return (
    <>
      <Navbar />
      <div className='flex relative'>
        <Sidebar />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Body