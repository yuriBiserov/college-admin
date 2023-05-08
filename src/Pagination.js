import React from 'react'

function Pagination({ totalItems, itemsPerPage, setCurrentPage, currentPage }) {
    
    let pages = []
    for (let i= 1; i<= Math.ceil(totalItems / itemsPerPage); i++){
        pages.push(i)
    }
    
    return (
        <div className='pagination'>
            {pages.map((page ,idx) => {
                return (
                    <button 
                    key={idx} 
                    onClick={() => setCurrentPage(page)} 
                    className={page === currentPage ? 'current-page' : ''}>{page}</button>
                )
            })}
        </div>
    )
}

export default Pagination