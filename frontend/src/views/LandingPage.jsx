import React from "react";
import { useNavigate } from 'react-router-dom';
import image from "../img/landing_page.png"
import "../css/LandingPage.css"

const LandingPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        const user = JSON.parse(localStorage.getItem('userData'));
        if(user){
            if(user.userType == 0){
                navigate('/homeAdmin');
            } else if(user.userType == 2){
                navigate('/homeStudent');
            } else if(user.userType == 1){
                navigate('/homeTeacher');
            } else if(user.userType == 3){
                navigate('/homeParent');
            } else {
                navigate('/homeStudent');
            }
        } else {
            navigate('/');
        }
    }

    return (
        <div className="background" style={{ backgroundImage:`url(${image})`,backgroundRepeat:"no-repeat"}}>
            <div className="landing-title">Illini CMS</div>
            <div className="landing-desc">A Classroom Management System</div>
            <div className="vertical-space"></div>
            <button className="start-button" onClick={handleClick}>Get Started</button>
        </div>
    );
}

export default LandingPage;
