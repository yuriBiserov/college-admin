import React from 'react'
import { useNavigate } from "react-router-dom";
import apiService from './services/api.service';
import { ToastContainer } from 'react-toastify';
import { toastFailed } from './services/toasts';
import { useForm } from "react-hook-form";

function LoginComponent() {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    const onSubmit = (user) => {
        apiService.login(user).then((r) => {
            if (r.data.token && r.data.lecturer.isAdmin) {
                sessionStorage.setItem("token", r.data.token)
                navigate('/schelude');
            }else{
                toastFailed("Unauthorized")
            }
        }, err => toastFailed("Invalid ID or Password"))
    }

    return (
        <>
            <div className='login-window'>
                <ToastContainer />
                <h2 className='d-flex justify-content-center p-4'>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {errors.id && <span className='required d-flex justify-content-center'>ID is required</span>}
                    <input type='text' className='form-control mb-3 mx-auto' placeholder='ID' {...register("id", { required: true })} />
                    {errors.password && <span className='required d-flex justify-content-center'>Password is required</span>}
                    <input type='password' className='form-control mb-3 mx-auto' placeholder='Password' {...register("password", { required: true })} />
                    <input type='submit' className='form-control mx-auto' value="Login" />
                </form>
            </div>
        </>
    )
}

export default LoginComponent