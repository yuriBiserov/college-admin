import React from "react";

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: (idx) => {},
    currentLessons:[],
    setCurrentLessons:(lessons) => {}
})

export default GlobalContext;