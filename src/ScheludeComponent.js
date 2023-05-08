import { React, useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import CalendarHeaderComponent from './CalendarHeaderComponent'
import CreateLessonComponent from './CreateLessonComponent'
import MonthComponent from './MonthComponent'
import apiService from './services/api.service'
import { getMonth } from './util'
import GlobalContext from './context/GlobalContext';
import auth from './services/auth'
import { useNavigate } from 'react-router-dom'
import icons from './services/icons'
import { ToastContainer } from 'react-toastify'
import dayjs from 'dayjs'

function ScheludeComponent() {
    const navigate = useNavigate()
    const [lessons, setLessons] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [currentMonth, setCurrentMonth] = useState((getMonth()))
    const { monthIndex } = useContext(GlobalContext)
    const { currentLessons } = useContext(GlobalContext)

    useEffect(() => {
        if (!auth.CheckToken()) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex))
    }, [monthIndex])

    const getLessons = () => {
        apiService.getLessons().then((r) => {
            setLessons(r.data)
        })
    }
    
    const addCourseHandler = () => {
        handleShow()
    }

    useEffect(() => {
        getLessons()
    }, [])
    return (
        <div className='w-100'>
            <h5 className='page-title m-3'>Schelude</h5>
            <div onClick={() => addCourseHandler()} className='m-3 d-flex align-items-center submit-btn m-3'>
                {icons.add()}
                <input type='button' className='bg-transparent border-0' value="Add Lesson" />
            </div>
            <div className='schelude'>
                <CalendarHeaderComponent />
                <div className='d-flex'>
                    <MonthComponent month={currentMonth} lessons={lessons} />
                    <div className='lessons'>
                        {currentLessons.length > 0 &&
                            <div>
                                {
                                    currentLessons.map((c) => {
                                        return (
                                            <div className='single-lesson-info'>
                                                <h6 className='bold'>{dayjs(c.date).format('DD/MM/YYYY')}</h6>
                                                <li className='bold'>{c.course.name}</li>
                                                <li className='d-flex align-items-center'>{icons.location()} <span>{c.class}</span></li>
                                                <li className='d-flex align-items-center'>{icons.clock()} <span>{c.start_time} - {c.end_time}</span></li>
                                                <li className='d-flex align-items-center'>{icons.lecturer()} <span>{c.lecturer.first_name} {c.lecturer.last_name}</span></li>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>

            <Modal size={'xl'} show={show} onHide={handleClose}>
                <CreateLessonComponent handleClose={handleClose} getLessons={getLessons} setLessons={setLessons} />
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default ScheludeComponent