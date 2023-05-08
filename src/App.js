import './App.scss';
import { Route, Routes } from "react-router-dom";
import LoginComponent from './LoginComponent';
import Dashboard from './Dashboard';
import Courses from './Courses';
import StudentsComponent from './StudentsComponent';
import CreateLessonComponent from './CreateLessonComponent';
import ScheludeComponent from './ScheludeComponent';
import LecturersComponent from './LecturersComponent';
import SidebarComponent from './SidebarComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
      <div className='d-flex'>
        <Routes>
          <Route path="/" element={<LoginComponent />}></Route>
            {/* <Route path="/dashboard" element={<><SidebarComponent/><Dashboard /></>}></Route> */}
            <Route path="/courses" element={<><SidebarComponent/><Courses /></>}></Route>
            <Route path="/lecturers" element={<><SidebarComponent/><LecturersComponent /></>}></Route>
            <Route path="/students" element={<><SidebarComponent/><StudentsComponent /></>}></Route>
            <Route path="/create-lesson" element={<><SidebarComponent/><CreateLessonComponent /></>}></Route>
            <Route path="/schelude" element={<><SidebarComponent/><ScheludeComponent /></>}></Route>
        </Routes>
      </div>
  );
}

export default App;
