import React, { useEffect, useState } from 'react'
import DayComponent from './DayComponent'

function MonthComponent({month , lessons}) {
  
  return (
    <div className='days-grid'>
        {month.map((row,i) => {
            return <div className='d-flex' key={i}>
                {row.map((day , idx) => (
                    <DayComponent day={day} key={idx} rowIdx={i} lessons={lessons}/>
                ))}
            </div>
        })}
    </div>
  )
}

export default MonthComponent