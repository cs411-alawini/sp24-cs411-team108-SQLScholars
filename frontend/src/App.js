import LoginPage from "./views/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./views/SignupPage";
import LandingPage from "./views/LandingPage";
import HomePageAdmin from "./views/HomePageAdmin";
import HomePageStudent from "./views/HomePageStudent";
import HomePageTeacher from "./views/HomePageTeacher";
import HomePageParent from "./views/HomePageParent";
import ClassGroupView from "./views/ClassGroupView";
import AssignmentView from "./views/AssignmentView";
import GradesView from "./views/GradesView";
import AttendanceView from "./views/AttendanceView";
import StudentView from "./views/StudentsView";
import CreateClassroomPage from "./views/CreateClassroomPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/homeAdmin" element={<HomePageAdmin />}></Route>
        <Route path="/homeStudent" element={<HomePageStudent />}></Route>
        <Route path="/homeTeacher" element={<HomePageTeacher />}></Route>
        <Route path="/homeParent" element={<HomePageParent />}></Route>
        <Route path="/assignmentView" element={<AssignmentView />}></Route>
        <Route path="/gradesView" element={<GradesView />}></Route>
        <Route path="/attendanceView" element={<AttendanceView />}></Route>
        <Route path="/studentView" element={<StudentView />}></Route>
        <Route path="/classGroupView" element={<ClassGroupView />}></Route>
        <Route
          path="/createClassroom"
          element={<CreateClassroomPage />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
