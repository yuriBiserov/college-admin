import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import GlobalContext from './context/GlobalContext';

function DayComponent({ day, rowIdx, lessons }) {
    const { currentLessons, setCurrentLessons } = useContext(GlobalContext)

    //today's lessons on page load 
    useEffect(() => {
        setCurrentLessons(lessons.filter((l) => dayjs(l.date).format("DD-MM-YY") == dayjs().format("DD-MM-YY")))
    },[lessons])

    const getDaysClasses = () => {
        let className = ""
        const currentDay = day.format("DD-MM-YY")
        let lesson = []
        lessons.map(p => {
            if (dayjs(p.date).format("DD-MM-YY") === currentDay) {
                lesson.push(p)
            }
        })
        if (lesson.length) {
            className += " lesson-day"
        }
        return className
    }


    const getCurrentDayClass = () => {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? "current-day" : "day"
    }

    const handleSelectedDay = () => {
        let lsns = []
        lessons.map((l) => {
            if (dayjs(l.date).format("DD-MM-YY") === day.format("DD-MM-YY")) {
                lsns.push(l)
            }
        })
        lsns = lsns.sort((d1, d2) => new Date(d1.date).getTime() - new Date(d2.date).getTime());
        setCurrentLessons(lsns)
    }

    return (
        <div className='mb-4 mx-auto text-center'>
            {rowIdx === 0 &&
                <>
                    <p className='bold'>{day.format('ddd').toUpperCase()}</p>
                </>
            }
            <div className={`${getCurrentDayClass()} d-grid`} onClick={handleSelectedDay}>
                <div>{day.format('DD')}</div>
                <div className={getDaysClasses()}></div>
            </div>

        </div>
    )
}

export default DayComponent