import React from "react";
import { useNavigate } from 'react-router-dom';
import image from "../img/landing_page.png";
import logo from "../img/illini_logo.png";
import "../css/LoginPage.css";

const submitLogin = (e, navigate) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === ""){
        alert("Please enter email");
        return;
    }
    if (password === ""){
        alert("Please enter password");
        return;
    }
    
    
    fetch('http://34.28.230.12/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(data.message);
        localStorage.setItem('userData', JSON.stringify(data));
        navigate('/home');
    })
    .catch(error => {
        console.error(error);
    });
}

const LoginPage = () =>{
    const navigate = useNavigate(); // Move the hook call inside the component function
    const navigateToSignup = () => {
        navigate("/signup"); // Navigate to the signup page
    }
    
    return (
        <div className="login_background" style={{ backgroundImage:`url(${image})`,backgroundRepeat:"no-repeat"}}>
            <div className="top-bar">
                <img className="logo" src={logo}/>
                <div className="logo-text">
                    <h1 className="cms-title">Illini CMS</h1>
                    <div className="cms-desc">A Classroom Management System</div>
                </div>
            </div>
            <div className="login">
                <h1 className="login-header">Sign in to Illini School</h1>
                <form className="login-form" onSubmit={(e) => submitLogin(e, navigate)}>
                    <input type="email" name="email" placeholder="Email" className="email-input"/>
                    <input type="password" name="password" placeholder="Password" className="password-input" />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div>Don't have an account? <button className="signup-redirect" onClick={navigateToSignup}>Sign Up</button></div>
            </div>
        </div>
    )
}
export default LoginPage;