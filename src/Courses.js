import { React, useState, useEffect, Fragment } from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import AddEditCourseComponent from './AddEditCourseComponent';
import apiService from './services/api.service';
import Modal from 'react-bootstrap/Modal';
import Dashboard from './Dashboard';
import auth from './services/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { toastFailed, toastSuccess } from './services/toasts';
import icons from './services/icons';
import { Pagination } from 'antd';

function Courses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currentCourse, setCurrentCourse] = useState({})
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  //pagination variables
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  let currentItems = courses.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  useEffect(() => {
    if (!auth.CheckToken()) {
      navigate('/')
    }
  }, [])

  const onSubmit = (course) => {
    apiService.createOrUpdateCourse(course).then((r) => {
      getCourses()
      toastSuccess("Course Added")
    }, err => { toastFailed("Adding Course was failed!") })
  }

  const getCourses = () => {
    apiService.getCourses().then((r) => {
      if (r) {
        var sorted = r.data.slice(0);
        sorted.sort(function (a, b) {
          var x = a.major.toLowerCase();
          var y = b.major.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        })
        setCourses(sorted)
      }
    })
  }

  useEffect(() => {
    getCourses()
  }, [])

  const deleteCourse = (number) => {
    apiService.deleteCourse(number).then((r) => {
      if (r) {
        getCourses()
      }
    })
  }
  const editCourse = (c) => {
    handleShow()
    setCurrentCourse(c)
  }

  return (
    <>
      <div className='w-100'>
        <h5 className='page-title m-3'>Courses</h5>
        <div onClick={e => editCourse(null)} className='d-flex align-items-center submit-btn m-3'>
          {icons.add()}
          <input type='button' className='bg-transparent border-0' value="Add Course" />
        </div>
        {courses &&
          <>
            <div className='h-60vh'>
              <Table striped bordered className='min-w540'>
                <thead>
                  <tr>
                    <th></th>
                    <th>Number</th>
                    <th>Major</th>
                    <th>Name</th>
                    <th>Duration in minutes</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((c, idx) => {
                    return <Fragment key={c._id}>
                      <tr>
                        <td>{idx + 1}</td>
                        <td>{c.number}</td>
                        <td>{c.major}</td>
                        <td>{c.name}</td>
                        <td>{c.duration_in_minutes}</td>
                        <td className='bt' onClick={e => editCourse(c)}>
                          {icons.edit()}
                        </td>
                        <td className='bt-remove' onClick={e => deleteCourse(c.number)}>
                          {icons.remove()}
                        </td>
                      </tr>
                    </Fragment>
                  })}
                </tbody>
              </Table>
            </div>
            <Pagination
              onChange={(value) => setPage(value)}
              pageSize={itemsPerPage}
              total={courses.length}
              current={page}
            />
          </>
        }
        <Modal show={show} onHide={handleClose}>
          <AddEditCourseComponent handleClose={handleClose} course={currentCourse} getCourses={getCourses} handleSubmit={handleSubmit} onSubmit={onSubmit} />
        </Modal>
      </div>
      <ToastContainer />
    </>
  )
}

export default Courses