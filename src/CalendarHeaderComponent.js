import React, { useContext, useEffect } from 'react'
import GlobalContext from './context/GlobalContext'
import dayjs from 'dayjs';
import icons from './services/icons';

function CalendarHeaderComponent() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext)

  const handlePrevMonth = () => {
    setMonthIndex(monthIndex - 1)
  }
  const handleNextMonth = () => {
    setMonthIndex(monthIndex + 1)
  }
  const handleReset = () => {
    setMonthIndex(dayjs().month())
  }

  useEffect(() => {
    handleReset()
  }, [])

  return (
    <header>
      <div className='d-flex justify-content-center mb-2'>
        <div className='pointer me-4' onClick={handlePrevMonth}>
          {icons.left()}
        </div>
        <div onClick={handleReset} className='pointer ms-4 me-4'>
          {icons.calendar()}
        </div>
        <div onClick={handleNextMonth} className='pointer ms-4' >
          {icons.right()}
        </div>
      </div>
      <div>
        <h6 className='text-center'>
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY").toUpperCase()}
        </h6>
      </div>
    </header>
  )
}

export default CalendarHeaderComponent