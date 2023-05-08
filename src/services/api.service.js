import axios from "axios"
import { AuthHeader } from './auth'

const basePath = process.env.REACT_APP_BASE_URL

const login = (user) => {
    return axios.post(`${basePath}/lecturer/login`,user)
}
const deleteStudent = (id) => {
    return axios.delete(`${basePath}/student/delete-student/${id}`)
}
const deleteLecturer = (id) => {
    return axios.delete(`${basePath}/lecturer/delete-lecturer/${id}`,{headers:AuthHeader()})
}
const addStudent = (student) => {
    return axios.post(`${basePath}/student/register`, student)
}
const editStudent = (student) => {
    return axios.post(`${basePath}/student/update`, student)
}
const addLecturer = (lecturer) => {
    return axios.post(`${basePath}/lecturer/register`, lecturer)
}
const editLecturer = (lecturer) => {
    return axios.post(`${basePath}/lecturer/update`, lecturer)
}
const getStudents = (major = "") => {
    return axios.get(`${basePath}/student/get-students/${major}`)
}
const getLecturers = (major = "") => {
    return axios.get(`${basePath}/lecturer/get-lecturers/${major}`,{headers:AuthHeader()})
}
const getLecturersByMajor = (major) => {
    return axios.get(`${basePath}/lecturer/get-lecturers/${major}`,{headers:AuthHeader()})
}
const getStudentsByMajor = (major) => {
    return axios.get(`${basePath}/student/get-students/${major}`)
}
const getCourses = (major = "") => {
    return axios.get(`${basePath}/courses/get-courses/${major}`,{headers:AuthHeader()})
}
const getCoursesByMajor = (major) => {
    return axios.get(`${basePath}/courses/get-courses/${major}`,{headers:AuthHeader()})
}
const createOrUpdateCourse = (course) => {
    return axios.post(`${basePath}/courses/create-course`, course,{headers:AuthHeader()})
}
const deleteCourse = (number) => {
    return axios.delete(`${basePath}/courses/delete-course/${number}`,{headers:AuthHeader()})
}
const getClasses = () => {
    return axios.get(`${basePath}/classes/get-classes`)
}
const createLesson = (lesson) => {
    return axios.post(`${basePath}/lessons/create-lesson`,lesson,{headers:AuthHeader()})
}
const getLessons = () => {
    return axios.get(`${basePath}/lessons/get-lessons`,{headers:AuthHeader()})
}

export default {
    getClasses,
    deleteStudent,
    addStudent,
    editStudent,
    login,
    getStudents,
    getCourses,
    getCoursesByMajor,
    getStudentsByMajor,
    createOrUpdateCourse,
    deleteCourse,
    getLecturers,
    getLecturersByMajor,
    addLecturer,
    editLecturer,
    createLesson,
    getLessons,
    deleteLecturer
}