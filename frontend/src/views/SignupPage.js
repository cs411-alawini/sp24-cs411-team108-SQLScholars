import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../img/landing_page.png";
import logo from "../img/illini_logo.png";
import "../css/SignupPage.css";

const submitSignup = (e, navigate, selectedOption) => {
  e.preventDefault();
  const firstName = e.target.first_name.value;
  const lastName = e.target.last_name.value;
  const email = e.target.email_id.value;
  const password = e.target.password.value;
  const password_conf = e.target.password_conf.value;
  const userType = Number(selectedOption);
  const address = e.target.address.value;
  const dob = e.target.dob.value;
  if (firstName === "") {
    alert("Please enter first name");
    return;
  }
  if (lastName === "") {
    alert("Please enter last name");
    return;
  }
  if (email === "") {
    alert("Please enter email");
    return;
  }
  if (password === "") {
    alert("Please enter password");
    return;
  }
  if (password_conf === "") {
    alert("Please confirm password");
    return;
  }
  if (password !== password_conf) {
    alert("Password and password confirmation do not match!");
    return;
  }
  if (userType === "") {
    alert("Please choose a user type");
    return;
  }
  if (address === "") {
    alert("Please enter an adress");
    return;
  }
  if (dob === "") {
    alert("Please enter a date of birth");
    return;
  }
  console.log(
    JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      userType,
      address,
      dob,
    })
  );
  fetch("http://34.28.230.12/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      userType,
      address,
      dob,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 201) {
        const user = data.data.user;
        localStorage.setItem("userData", JSON.stringify(user));
        if (user.userType == 0) {
          navigate("/homeAdmin");
        } else if (user.userType == 2) {
          navigate("/homeStudent");
        } else if (user.userType == 1) {
          navigate("/homeTeacher");
        } else if (user.userType == 3) {
          navigate("/homeParent");
        } else {
          navigate("/homeStudent");
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const SignUp = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const selectType = (event) => {
    setSelectedOption(event.target.value);
  };
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/");
  };
  return (
    <div
      className="signup-background"
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="signup-top-bar">
        <img className="signup-logo" src={logo} />
        <div className="signup-logo-text">
          <h1 className="signup-cms-title">Illini CMS</h1>
          <div className="signup-cms-desc">A Classroom Management System</div>
        </div>
      </div>
      <div className="signup">
        <h1 className="signup-header">Join Illini School</h1>
        <form
          className="signup-form"
          onSubmit={(e) => submitSignup(e, navigate, selectedOption)}
        >
          <input
            name="first_name"
            placeholder="First Name:"
            className="first_name"
          />
          <input
            name="last_name"
            placeholder="Last Name:"
            className="last_name"
          />
          <input
            type="email"
            name="email_id"
            placeholder="Email ID:"
            className="email-id-input"
          />
          <select
            className="user-select"
            value={selectedOption}
            onChange={selectType}
          >
            <option value="">Select a User Type</option>
            <option value="0">Admin</option>
            <option value="1">Teacher</option>
            <option value="2">Student</option>
            <option value="3">Parent</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="pw-input"
          />
          <input
            type="password"
            name="password_conf"
            placeholder="Confirm Password:"
            className="pw-conf-input"
          />
          <input name="address" placeholder="Address" className="address" />
          <div className="date_title">Date of Birth</div>
          <input type="date" name="dob" className="dob" />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div>
          Already have an account?{" "}
          <button className="login-redirect" onClick={navigateToLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
