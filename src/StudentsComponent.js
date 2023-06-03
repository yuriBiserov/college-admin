import axios from 'axios';
import { React, useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import apiService from './services/api.service';
import auth from './services/auth';
import { useForm } from "react-hook-form";
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import toasts from './services/toasts';
import icons from './services/icons';
import AddEditStudentsComponent from './AddEditStudentsComponent';
import { Pagination } from 'antd';

function Students() {
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [majors, setMajors] = useState([])
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [currentStudent, setCurrentStudent] = useState({})

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //pagination variables
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    let currentItems = students.slice((page - 1) * itemsPerPage, page * itemsPerPage)

    const onSubmit = (student) => {
        apiService.addStudent(student).then(r => {
            toasts.toastSuccess("Student Added Successfully!")
            getStudents()
        }, err => { toasts.toastFailed("Adding Student Failed!") })
    };

    useEffect(() => {
        if (!auth.CheckToken()) {
            navigate('/')
        }
    }, [])

    const getStudents = () => {
        apiService.getStudents().then((r) => {
            setStudents(r.data)
        })
    }

    useEffect(() => {
        getStudents()
        apiService.getCourses().then((r) => {
            let majors = [];
            r.data.map((c) => {
                majors.push(c.major)
            })
            setMajors([... new Set(majors)])
        })
    }, [])

    const deleteStudent = (id) => {
        if (id) {
            apiService.deleteStudent(id).then((r) => {
                getStudents()
            })
        }
    }
    const editStudent = (s) => {
        handleShow()
        setCurrentStudent(s)
    }

    return (
        <div className='w-100'>
            <h5 className='page-title m-3'>Students</h5>
            <div onClick={e => editStudent(null)} className='d-flex align-items-center submit-btn m-3'>
                {icons.add()}
                <input type='button' className='bg-transparent border-0' value="Add Student" />
            </div>
            <div className='h-60vh'>
                <Table striped bordered className='min-w540'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
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
                                    <td className='bt' onClick={e => editStudent(s)}>
                                        {icons.edit()}
                                    </td>
                                    <td className='bt-remove' onClick={e => deleteStudent(s.id)}>
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
                total={students.length}
                current={page}
            />
            <Modal show={show} onHide={handleClose}>
                <AddEditStudentsComponent majors={majors} handleClose={handleClose} student={currentStudent} getStudents={getStudents} handleSubmit={handleSubmit} onSubmit={onSubmit} />
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default Students