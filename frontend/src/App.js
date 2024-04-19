import LoginPage from "./views/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./views/SignupPage";
import LandingPage from "./views/LandingPage";
import HomePageAdmin from "./views/HomePageAdmin";
import HomePageStudent from "./views/HomePageStudent";
import HomePageTeacher from "./views/HomePageTeacher";
import HomePageParent from "./views/HomePageParent";

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
