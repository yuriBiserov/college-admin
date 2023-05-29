import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import auth from './services/auth'
import icons from './services/icons';

function SidebarComponent() {
  const navigate = useNavigate();

  const navigaveToCourses = () => {
    navigate('/courses')
  }
  const navigaveToStudents = () => {
    navigate('/students')
  }
  const navigaveToLecturers = () => {
    navigate('/lecturers')
  }
  const navigateToAttendanceList = () => {
    navigate('/attendance-list')
  }
  const navigaveToSchelude = () => {
    navigate('/schelude')
  }
  const handleLogout = () => {
    let token = sessionStorage.getItem("token")
    if (token) {
      sessionStorage.removeItem("token")
    }
  }
  return (
    <div className='sidebar'>
      
      <h5 className='sidebar-title'>{icons.collegeIcon()}College Managment System</h5>
      <button className='sidebar-button' onClick={e => navigaveToCourses()}>Manage Courses</button>
      <button className='sidebar-button' onClick={e => navigaveToStudents()}>Manage Students</button>
      <button className='sidebar-button' onClick={e => navigaveToSchelude()}>Manage Schelude</button>
      <button className='sidebar-button' onClick={e => navigaveToLecturers()}>Manage Lecturers</button>
      <button className='sidebar-button' onClick={e => navigateToAttendanceList()}>Attendance List</button>
      <a onClick={handleLogout} className='d-flex m-4' href='/'>
        {icons.logout()}
      </a>
    </div>
  )
}

export default SidebarComponent