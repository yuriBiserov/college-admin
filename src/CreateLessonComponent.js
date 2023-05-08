import React, { useEffect, useState } from 'react'
import apiService from './services/api.service'
import dayjs from 'dayjs';
import { ToastContainer } from 'react-toastify';
import { get, useForm } from 'react-hook-form';
import { MultiSelect } from './MultiSelect';
import icons from './services/icons';
import { toastFailed, toastSuccess } from './services/toasts';
import { hours } from './hours';
import { Form } from 'react-bootstrap';

function CreateLessonComponent(props) {
  const [majors, setMajors] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [lecturers, setLecturers] = useState([])
  const [coursesByMajor, setCoursesByMajor] = useState([])
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([])

  const { register, control, handleSubmit, watch, getValues, setValue, formState: { errors } } = useForm({
    defaultValues: {
      major: "",
      class: "",
      course: {},
      start_time: "",
      end_time: "",
      students: [],
      start_date: "",
      end_date: "",
      lecturer: {},
      in_class:true
    }
  });

  useEffect(() => {
    apiService.getCourses().then((r) => {
      let majors = [];
      r.data.map((c) => {
        majors.push(c.major)
      })
      setMajors([... new Set(majors)])
    })
    apiService.getClasses().then(r => setClasses(r.data))
  }, [])

  useEffect(() => {
    let ops = [];
    if (students.length) {
      students.map((s) => {
        let student = {
          value: s.id,
          label: s.first_name + " " + s.last_name
        }
        ops.push(student)
      })
      setOptions(ops)
    }
  }, [students])

  const onSubmit = (data) => {
    //parse some form values 
    const course = coursesByMajor.find(c => c.number == getValues('course'))
    const lecturer = lecturers.find(c => c.id == getValues('lecturer'))

    //get dates range 
    const dayOfLesson = dayjs(getValues('start_date')).day()
    let startDate = new Date(getValues('start_date'))
    let endDate = new Date(getValues('end_date'))

    let lessons = []

    //loop in dates range
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      const currDay = dayjs(day).day()
      if (currDay == dayOfLesson) {
        //if day of the week matches choosen day
        //create lesson object and push to array

        //set lesson date Hour
        let lesson_date = new Date(day)
        const startHour = data.start_time.substring(0, 2)
        const startMinute = data.start_time.substring(3, 5)
        lesson_date.setUTCHours(startHour)
        lesson_date.setMinutes(startMinute)

        const lesson = {
          major: data.major,
          class: data.class,
          course: course,
          students: data.students,
          lecturer: lecturer,
          in_class: data.in_class,
          start_time: data.start_time,
          end_time: data.end_time,
          date: lesson_date
        }
        lessons.push(lesson)
      }
    }
    //loop through lessons and send to api 
    Promise.all([
      lessons.map(l => {
        apiService.createLesson(l).then()
      })
    ]).then((r) => {
      toastSuccess("Lessons Added Successfully")
      props.getLessons()
      props.handleClose()
    }, err => { toastFailed("Adding Lessons Failed...") })
  }

  //trigger changes on 'Major' change
  useEffect(() => {
    setOptions([])
    setSelected([])

    if (getValues('major')) {
      const selectedMajor = getValues('major')
      apiService.getCourses(selectedMajor).then(r => {
        setCoursesByMajor(r.data)
        setValue('course', "")
      })
      apiService.getStudents(selectedMajor).then(r => setStudents(r.data))
      apiService.getLecturers(selectedMajor).then(r => setLecturers(r.data))
    } else {
      setLecturers([])
    }
  }, [watch('major')])

  //trigger change on 'start_time' 
  useEffect(() => {
    if (!getValues('start_time')) {
      setValue('end_time', '')
    } else {
      if (getValues('course')) {
        const course = coursesByMajor.find(c => c.number == getValues('course'))
        if (course) {
          const start = getValues('start_time')
          const duration = course.duration_in_minutes

          setValue('end_time', calculateEndTime(start, duration))
        }
      }
    }
  }, [watch('start_time')])

  const calculateEndTime = (startTime, duration) => {
    const durationHour = Math.floor(duration / 60)
    const durationMinute = (duration % 60)

    const startHour = startTime.substring(0, startTime.indexOf(':'))
    const startMinute = startTime.slice(startTime.indexOf(':') + 1)

    let minutes = (parseInt(startMinute) + parseInt(durationMinute))
    if (minutes == 0) {
      minutes = "00"
    }

    return ((parseInt(startHour) + parseInt(durationHour)) + ":" + minutes)
  }

  //get MultiSelect values on change
  useEffect(() => {
    let stdnts = []
    students.map((s) => {
      let id = s.id
      selected.map((i) => {
        if (i.value === id) {
          stdnts.push(s)
        }
      })
    })
    setValue('students', stdnts)
  }, [selected])

  return (
    <>
      <h5 className='p-2 m-2'>Create Lessons</h5>
      <form className='lesson-form' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className='bold' htmlFor='major'>Major</label><br />
          {errors.major && <span className='required'>Major is required</span>}
          <select id='major' className='form-control mb-3'
            {...register("major",
              { required: true })}>
            <option value="">Select Major</option>
            {majors.map(m => {
              return <option value={m}>{m}</option>
            })}
          </select>

          <label className='bold' htmlFor='course'>Course</label><br />
          {errors.course && <span className='required'>Course is required</span>}
          <select id='course' disabled={getValues('major').length == 0} className='form-control mb-3'
            {...register("course",
              { required: true })}>
            <option value="">Select Course</option>
            {coursesByMajor.map(c => {
              return <option value={c.number}>{c.name}</option>
            })}
          </select>

          <label className='bold' htmlFor='lecturer'>Lecturer</label><br />
          {errors.lecturer && <span className='required'>Lecturer is required</span>}
          <select disabled={getValues('major').length == 0} id='lecturer' className='form-control mb-3'
            {...register("lecturer",
              { required: true })}>
            <option value="">Select Lecturer</option>
            {lecturers.map(l => {
              return <option value={l.id}>{l.first_name} {l.last_name}</option>
            })}
          </select>

          <label className='bold' htmlFor='class'>Class Room</label><br />
          {errors.class && <span className='required'>Class is required</span>}
          <select id='class' className='form-control mb-3'
            {...register("class")}>
            <option value="">Select Class</option>
            {classes.map(c => {
              return <option value={c.number}>{c.number}</option>
            })}
          </select>
        </div>
        <div>
          <label className='bold' htmlFor='start-date'>Start Date</label><br />
          {errors.start_date && <span className='required'>Start Date is required</span>}
          <input type='date' id='start-date' className='form-control mb-3'{...register("start_date", { required: true })} />

          <label className='bold' htmlFor='end-date'>End Date</label><br />
          {errors.end_date && <span className='required'>End Date is required</span>}
          <input type='date' id='end-date' className='form-control mb-3'{...register("end_date", { required: true })} />

          <label className='bold' htmlFor='start-time'>Start Time</label><br />
          {errors.start_time && <span className='required'>Start Time is required</span>}
          <select id='start-time' className='form-control mb-3'
            {...register("start_time",
              { required: true })}>
            <option value="">Select Start Time</option>
            {hours.map(t => {
              return <option value={t}>{t}</option>
            })}
          </select>

          <label className='bold' htmlFor='end-time'>End Time</label><br />
          {errors.end_time && <span className='required'>End Time is required</span>}
          <select id='end-time' disabled={getValues('start_time').length === 0} className='form-control mb-3'
            {...register("end_time",
              { required: true })}>
            <option value="">Select End Time</option>
            {hours.map(t => {
              return <option value={t}>{t}</option>
            })}
          </select>
        </div>
        <div>
          <label className='bold' htmlFor='studets'>Students</label><br />
          {errors.students && <span className='required'>Students is required</span>}
          <MultiSelect id='students' options={options} value={selected} placeholder='Select Students' onChange={setSelected} />

          <label className='bold' htmlFor='in-class'>In Class</label>
          <div className='d-flex'>
            <input id='yes' {...register("in_class", { required: true })} type="radio" checked value={true} className='me-2' />
            <label htmlFor='yes'>Yes</label>
          </div>
          <div className='d-flex'>
            <input id='no' {...register("in_class", { required: true })} type="radio" value={false} className='me-2' />
            <label htmlFor='no'>No</label>
          </div>

        </div>
        <div className='d-flex align-items-center submit-btn'>
          {icons.add()}
          <input type='submit' className='bg-transparent border-0' value="Add Lessons" />
        </div>
      </form>
      <ToastContainer />
    </>
  )
}

export default CreateLessonComponent