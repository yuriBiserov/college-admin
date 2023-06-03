import axios from 'axios';
import { React, useState, useEffect, Fragment } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Button, Row, Col, FormControl, FormSelect, FormLabel } from 'react-bootstrap';
import apiService from './services/api.service';
import auth from './services/auth';
import { useForm } from "react-hook-form";
import toasts from './services/toasts';
import { ToastContainer } from 'react-toastify';
import icons from './services/icons';
import AddEditLecturersComponent from './AddEditLecturersComponent';
import Modal from 'react-bootstrap/Modal';
import { Pagination } from 'antd';

function LecturersComponent() {
    const navigate = useNavigate()
    const [lecturers, setLecturers] = useState([])
    const [majors, setMajors] = useState([])
    const [currentLecturer, setCurrentLecturer] = useState({})
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //pagination variables
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    let currentItems = lecturers.slice((page - 1) * itemsPerPage, page * itemsPerPage)

    useEffect(() => {
        if (!auth.CheckToken()) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        getLecturers()
        apiService.getCourses().then((r) => {
            let majors = [];
            r.data.map((c) => {
                majors.push(c.major)
            })
            setMajors([... new Set(majors)])
        })
    }, [])

    const editLecturer = (l) => {
        handleShow()
        setCurrentLecturer(l)
    }

    const getLecturers = () => {
        apiService.getLecturers().then((r) => {
            setLecturers(r.data)
        })
    }

    const onSubmit = (lecturer) => {
        apiService.addLecturer(lecturer).then(r => {
            toasts.toastSuccess("Lecturer Added Successfully!")
            getLecturers()
        }, err => { toasts.toastFailed("Adding Lecturer Failed!") })
    }

    const deleteLecturer = (id) => {
        if (id) {
            apiService.deleteLecturer(id).then((r) => {
                getLecturers()
            })
        }
    }

    return (
        <div className='w-100'>
            <ToastContainer />
            <h5 className='page-title m-3'>Lecturers</h5>
            <div onClick={e => editLecturer(null)} className='m-3 d-flex align-items-center submit-btn m-3'>
                {icons.add()}
                <input type='button' className='bg-transparent border-0' value="Add Lecturer" />
            </div>
            <div className='h-60vh'>
                <Table striped bordered className='min-w540'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Admin</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((s, idx) => {
                            return <Fragment key={s._id}>
                                <tr>
                                    <td>{idx + 1}</td>
                                    <td>{s.id}</td>
                                    <td>{s.first_name}</td>
                                    <td>{s.last_name}</td>
                                    <td className={s.isAdmin && 'd-flex justify-content-center'}>{s.isAdmin &&
                                        icons.check()}</td>
                                    <td className='bt' onClick={e => editLecturer(s)}>
                                        {icons.edit()}
                                    </td>
                                    <td className='bt-remove' onClick={e => deleteLecturer(s.id)}>
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
                total={lecturers.length}
                current={page}
            />
            <div>
                <Modal show={show} onHide={handleClose}>
                    <AddEditLecturersComponent majors={majors} handleClose={handleClose} lecturer={currentLecturer} getLecturers={getLecturers} handleSubmit={handleSubmit} onSubmit={onSubmit} />
                </Modal>
                <ToastContainer />
            </div>
        </div>
    )
}

export default LecturersComponent