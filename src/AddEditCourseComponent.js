import React, { useState , useEffect } from 'react'
import apiService from './services/api.service';
import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { toastFailed, toastSuccess } from './services/toasts';
import icons from './services/icons';
import { durations } from './durations';
import { hours } from './hours';

function AddEditCourseComponent(props) {
    let courseToEdit = props.course
    const { register, control, handleSubmit,setValue,watch,getValues, formState: { errors } } = useForm({
        defaultValues: {
            major: courseToEdit?.major,
            name: courseToEdit?.name,
            duration_in_minutes: courseToEdit?.duration_in_minutes,
            number: courseToEdit?.number
        }
    });

    const calculateDuration = (timeStr) => {
        const hour = timeStr.substring(0, timeStr.indexOf(':'))
        const minute = timeStr.slice(timeStr.indexOf(':') + 1 , timeStr.indexOf(':') + 3)
        return((parseInt(hour) * 60) + parseInt(minute))
    }

    const onSubmit = (course) => {
        course.duration_in_minutes = calculateDuration(course.duration_in_minutes)

        apiService.createOrUpdateCourse(course).then((r) => {
            props.getCourses()
            !courseToEdit ? toastSuccess("Course Added Successfully") : toastSuccess("Course Updated Successfully")
            props.handleClose()
        }, err => { toastFailed("Adding/Updating Course was failed!") })
    }

    return (
        <>
            {!props.course ? <h5 className='p-2 m-2'>Add Course</h5> : <h5 className='p-2 m-2'>Edit Course</h5>}
            <form onSubmit={handleSubmit(onSubmit)}>
                {errors.major && <span className='required d-flex justify-content-center'>Major is required</span>}
                <input className='form-control mb-3 mx-auto' placeholder='Major' {...register("major", { required: true })} />

                {errors.name && <span className='required d-flex justify-content-center'>Name is required</span>}
                <input className='form-control mb-3 mx-auto' placeholder='Name' {...register("name", { required: true })} />

                <label className='bold' htmlFor='duration_in_minutes'>Duration</label><br />
                {errors.duration_in_minutes && <span className='required'>Duration is required</span>}
                <select id='duration_in_minutes' className='form-control mb-3'
                    {...register("duration_in_minutes",
                        { required: true })}>
                    <option value="">Select Duration</option>
                    {durations.map(d => {
                        return <option value={d}>{d}</option>
                    })}
                </select>

                {props.course ?
                    <div onClick={handleSubmit(onSubmit)} className='d-flex align-items-center submit-btn'>
                        <input type='button' className='bg-transparent border-0' value="Update Course" />
                    </div>
                    :
                    <div onClick={handleSubmit(onSubmit)} className='d-flex align-items-center submit-btn'>
                        {icons.add()}
                        <input type='button' className='bg-transparent border-0' value="Add Course" />
                    </div>}
            </form>
        </>
    )
}

export default AddEditCourseComponent