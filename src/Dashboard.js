import axios from 'axios';
import {React,useState,useEffect} from 'react'
import { Button } from 'react-bootstrap';
import { Link, useLocation, Redirect, useNavigate } from 'react-router-dom';


function Dashboard(props) {
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
    const navigaveToLesson = () => {
        navigate('/create-lesson')
    }
    const navigaveToSchelude = () => {
        navigate('/schelude')
    }
    

    // useEffect(() => {
    //     if(location.state){
    //         setUser(location.state)
    //     }else{
    //         navigate('/')
    //     }
    // },[user])


    return (
    <>
        <div>
            <Button className='m-3' onClick={e => navigaveToCourses()}>Manage Courses</Button>
            <Button className='m-3' onClick={e => navigaveToStudents()}>Manage Students</Button>
            <Button className='m-3' onClick={e => navigaveToSchelude()}>Manage Schelude</Button>
            <Button className='m-3' onClick={e => navigaveToLecturers()}>Manage Lecturers</Button>
        </div>
    </>
  )
}

export default Dashboard