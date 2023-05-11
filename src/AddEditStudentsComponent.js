import React, { useState } from 'react'
import apiService from './services/api.service';
import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { toastFailed, toastSuccess } from './services/toasts';
import icons from './services/icons';

function AddEditStudentsComponent(props) {
    let studentToEdit = props.student
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id:studentToEdit?.id,
            first_name: studentToEdit?.first_name,
            last_name: studentToEdit?.last_name,
            password: studentToEdit ? studentToEdit.password : "",
            major: studentToEdit?.major,
        }
    });

    const onSubmit = (student) => {
        props.student ?
            apiService.editStudent(student).then((r) => {
                props.getStudents()
                toastSuccess("Student Updated Successfully")
                props.handleClose()
            }, err => { toastFailed("Updating Student was failed!") })
            :
            apiService.addStudent(student).then((r) => {
                props.getStudents()
                toastSuccess("Student Added Successfully")
                props.handleClose()
            }, err => { toastFailed("Adding Student was failed!") })
    }

    return (
        <>
            {
                <>
                    {props.student ? <h5 className='p-2 m-2'>Edit Student</h5>:<h5 className='p-2 m-2'>Add Student</h5>}
                    <form>
                        {errors.id && <span className='required'>ID is required</span>}
                        <input className='form-control mb-3' placeholder='ID' disabled={props.student}  {...register("id", { required: true, maxLength: 9 , minLength:9 })} />

                        {errors.first_name && <span className='required'>First name is required</span>}
                        <input className='form-control mb-3' placeholder='First Name' {...register("first_name", { required: true })} />

                        {errors.last_name && <span className='required'>Last name is required</span>}
                        <input className='form-control mb-3' placeholder='Last Name' {...register("last_name", { required: true })} />

                        {!props.student &&
                            <>
                                {errors.password && <span className='required'>Password is required</span>}
                                <input className='form-control mb-3' placeholder='Password' {...register("password", { required: true })} />
                            </>
                        }
                        {errors.major && <span className='required'>Major is required</span>}
                        <select className='form-control mb-3' {...register("major", { required: true })}>
                            <option value="">Select Major</option>
                            {props.majors.map(m => {
                                return <option value={m}>{m}</option>
                            })}
                        </select>

                        {props.student ?
                            <>
                                <div onClick={handleSubmit(onSubmit)} className='d-flex align-items-center submit-btn'>
                                    <input type='button' className='bg-transparent border-0' value="Update Student" />
                                </div>
                            </>
                            :
                            <>
                                <div onClick={handleSubmit(onSubmit)} className='d-flex align-items-center submit-btn'>
                                    {icons.add()}
                                    <input type='button' className='bg-transparent border-0' value="Register Student" />
                                </div>
                            </>
                        }
                    </form>
                </>
            }
        </>
    )
}

export default AddEditStudentsComponent