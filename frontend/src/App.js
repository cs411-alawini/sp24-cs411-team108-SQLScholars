import LoginPage from "./views/LoginPage";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignupPage from "./views/SignupPage";
import LandingPage from "./views/LandingPage";
import HomePage from "./views/HomePage";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/signup" element={<SignupPage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;