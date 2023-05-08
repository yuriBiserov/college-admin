import { ToastContainer, toast } from 'react-toastify';

export const toastSuccess = (msg) => {
    return toast.success(msg, {
        position: toast.POSITION.TOP_RIGHT
    });
}
export const toastFailed = (msg) => {
    return toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT
    });
}

export default {
    toastSuccess,
    toastFailed
}