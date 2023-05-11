import React, { useEffect, useState } from 'react'
import apiService from './services/api.service'
import icons from './services/icons'
import { toastFailed, toastSuccess } from './services/toasts';
import { useForm } from 'react-hook-form';
import { MultiSelect } from './MultiSelect';

function AddEditLecturersComponent(props) {
    let lecturerToEdit = props.lecturer
    let majors = props.majors
    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState([]);
    const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id: lecturerToEdit?.id,
            first_name: lecturerToEdit?.first_name,
            last_name: lecturerToEdit?.last_name,
            password: lecturerToEdit ? lecturerToEdit.password : "",
            major: lecturerToEdit?.major,
            isAdmin: lecturerToEdit?.isAdmin
        }
    });
    //bind selected majors to use-form major 
    useEffect(() => {
        let mjrs = []
        if (selected.length) {
            selected.map(s => mjrs.push(s.value))
        } else {
            setValue('major', [])
        }
        setValue('major', mjrs)
    }, [selected])

    //on edit mode - push current lecturer majors to 'MultiSelect' 
    useEffect(() => {
        let slctd = []
        if (props.lecturer) {
            if (props.lecturer.major.length) {
                props.lecturer.major.map(m => {
                    slctd.push({
                        label: m,
                        value: m
                    })
                })
            }
        }
        setSelected(slctd)
    }, [])

    //on init , push current majors to 'MultiSelect'
    useEffect(() => {
        let ops = [];
        if (majors.length) {
            majors.map((m) => {
                let major = { value: m, label: m }
                ops.push(major)
            })
            setOptions(ops)
        }
    }, [majors])

    const onSubmit = (lecturer) => {
        props.lecturer ?
            apiService.editLecturer(lecturer).then((r) => {
                props.getLecturers()
                toastSuccess("Lecturer Updated Successfully")
                props.handleClose()
            }, err => { toastFailed("Updating Lecturer was failed!") })
            :
            apiService.addLecturer(lecturer).then((r) => {
                props.getLecturers()
                toastSuccess("Lecturer Added Successfully")
                props.handleClose()
            }, err => { toastFailed("Adding Lecturer was failed!") })
    }
    return (
        <>
            {props.lecturer ? <h5 className='p-2 m-2'>Edit Lecturer</h5>:<h5 className='p-2 m-2'>Add Lecturer</h5>}
            <form>
                {errors.id && <span className='required'>ID is required</span>}
                <input className='form-control mb-3 mx-auto' placeholder='ID' disabled={props.lecturer} {...register("id", { required: true, maxLength: 9 , minLength:9 })} />

                {errors.major && <span className='required'>Major is required</span>}
                <MultiSelect options={options} value={selected} placeholder='Select Majors' onChange={setSelected} />

                {errors.first_name && <span className='required'>First name is required</span>}
                <input className='form-control mb-3 mx-auto' placeholder='First Name' {...register("first_name", { required: true })} />

                {errors.last_name && <span className='required'>Last name is required</span>}
                <input className='form-control mb-3 mx-auto' placeholder='Last Name' {...register("last_name", { required: true })} />
                {!props.lecturer && <>
                    {errors.password && <span className='required'>Password is required</span>}
                    <input className='form-control mb-3 mx-auto' placeholder='Password' {...register("password", { required: true })} />
                </>}

                <input className='me-2' type='checkbox' id='isAdmin' name='isAdmin' defaultChecked={lecturerToEdit?.isAdmin} {...register("isAdmin")} />
                <label className='mb-3' htmlFor='isAdmin'>Is Admin</label>

                {props.lecturer ?
                    <div onClick={handleSubmit(onSubmit)} className='d-flex align-items-center submit-btn'>
                        <input type='button' className='bg-transparent border-0' value="Update Lecturer" />
                    </div>
                    :
                    <div onClick={handleSubmit(onSubmit)} className='d-flex align-items-center submit-btn'>
                        {icons.add()}
                        <input type='button' className='bg-transparent border-0' value="Register Lecturer" />
                    </div>}
            </form>
        </>
    )
}

export default AddEditLecturersComponent