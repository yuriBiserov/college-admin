import React, { Fragment, useEffect, useState } from 'react'
import apiService from './services/api.service'
import { ToastContainer } from 'react-toastify'
import { Pagination } from 'antd';
import { Form, Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import icons from './services/icons';
import { useForm } from 'react-hook-form';


function AttendanceList() {
    const { register, control, handleSubmit, watch, getValues, setValue, formState: { errors } } = useForm({
        defaultValues: {
            major: "",
            course: ""
        }
    });

    const [majors, setMajors] = useState([])
    const [coursesByMajor, setCoursesByMajor] = useState([])
    const [students, setStudents] = useState([])
    const [lessons, setLessons] = useState([])
    const [currentLessons, setCurrentLessons] = useState([])

    useEffect(() => {
        // apiService.getStudents().then((response) => {
        //     setStudents(response.data)
        // })

        apiService.getLessons().then((response) => {
            setLessons(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)))
            setCurrentLessons(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)))
        })

        apiService.getCourses().then((r) => {
            let majors = [];
            r.data.map((c) => {
                majors.push(c.major)
            })
            setMajors([... new Set(majors)])
        })
    }, [])

    //trigger changes on 'Major' change
    useEffect(() => {
        setCoursesByMajor([])
        if (getValues('major')) {
            const selectedMajor = getValues('major')
            apiService.getCourses(selectedMajor).then(r => {
                setCoursesByMajor(r.data)
                // setValue('course', "")
                setCurrentLessons(lessons.filter(lesson => {
                    return lesson.major == selectedMajor
                }))
            })
        } else {
            setCoursesByMajor([])
            setCurrentLessons(lessons)
        }
    }, [watch('major')])

    const checkStudentAttendancy = (id, lesson) => {
        if (lesson && id) {
            return lesson.attendance.some(x => x == id)
        }
    }
    useEffect(() => {
        if (getValues('course') && getValues('course').length) {
            const course = getValues('course')
            setCurrentLessons(lessons.filter(lesson => {
                return lesson.course.name == course
            }))
        } else {
            setCurrentLessons(lessons)
        }

    }, [watch('course')])


    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    let currentItems = lessons.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    return (
        <div className='w-100'>
            <ToastContainer />
            <h5 className='page-title m-3'>Attendance List</h5>
            <div className='m-3 d-flex align-items-center m-3'>
                <Form.Select id='major' className='form-control mb-3 me-4 w-auto'
                    {...register("major",
                        { required: true })}>
                    <option value="">Select Major</option>
                    {majors.map(m => {
                        return <option key={m} value={m}>{m}</option>
                    })}
                </Form.Select>
                <Form.Select disabled={!getValues('major')} id='course' className='form-control mb-3 w-auto'
                    {...register("course",
                        { required: true })}
                >
                    <option value="">Select Course</option>
                    {coursesByMajor.map(course => {
                        return <option key={course.number} value={course.name}>{course.name}</option>
                    })}
                </Form.Select>
            </div>

            <div className='h-60vh table-wrapper'>
                <Table striped bordered className='min-w540 attendance-list'>
                    <thead>
                        <tr>
                            <th className='fixed'></th>
                            <th className='fixed'>Date</th>
                            <th className='fixed'>Course</th>
                            <th className='fixed'>Lecturer</th>
                            <th className='fixed'>Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLessons.map((lesson, idx) => {
                            {
                                return dayjs(lesson.date).isBefore(dayjs()) &&
                                    <Fragment key={lesson._id}>
                                        <tr>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <div>
                                                    {dayjs(lesson.date).format('DD/MM/YYYY')}
                                                </div>
                                                <div>
                                                    {lesson.start_time}
                                                </div>
                                            </td>
                                            <td>{lesson.course.name}</td>
                                            <td>{lesson.lecturer.first_name} {lesson.lecturer.last_name}</td>
                                            <td>
                                                {lesson.students.map((student) => {
                                                    return <div key={student._id} className='student d-flex justify-content-between'>
                                                        <span>{student.first_name} {student.last_name}</span>
                                                        <span>{checkStudentAttendancy(student.id, lesson) ? icons.check() : icons.notChecked()}</span>
                                                    </div>
                                                })}
                                            </td>
                                        </tr>
                                    </Fragment>
                            }

                        })}
                    </tbody>
                </Table>
            </div>
            {/* <Pagination
                onChange={(value) => setPage(value)}
                pageSize={itemsPerPage}
                total={lessons.length}
                current={page}
            /> */}
        </div>
    )
}

export default AttendanceList