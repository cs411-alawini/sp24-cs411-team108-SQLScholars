import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger2.css";
import profilePic from "../img/profile-pic.png"
import { useNavigate, useSearchParams } from "react-router-dom";

const ProfileView = () => {
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");
  const [occupation, setOccupation] = useState("");
  const [studentIds, setStudentIds] = useState("");
  const [nav_path, setPath] = useState("/homeTeacher");

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const types = ["Admin", "Teacher", "Student", "Parent"];
      setUserType(types[parsedData.userType]);
      getProfileInfo(parsedData.userId);
      if (parsedData.userType === 0) {
        setPath("/homeAdmin");
      } else if (parsedData.userType === 1) {
        setPath("/homeTeacher");
      } else if (parsedData.userType === 2) {
        setPath("/homeStudent");
      } else if (parsedData.userType === 3) {
        setPath("/homeParent");
      }
    } else {
      console.error("User data not found in local storage");
    }
  }, []);

  const getProfileInfo = async (userId) => {
    console.log(`Fetching profile info using userId: ${userId}`);
    try {
      const response = await fetch(
        `http://34.28.230.12/api/user/getProfile?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const user = data.data.user;
      setUserId(user.userId);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword(user.password);
      setAddress(user.address);
      var datePart = user.dob.split("T")[0];
      setDOB(datePart);
      setOccupation(user.occupation);
      setStudentIds(user.studentIds);
      console.log(user.dob);
    } catch (error) {
      console.error("Could not fetch profile:", error);
    }
  };

  const editProfile = async () => {
    try {
      const response = await fetch("http://34.28.230.12/api/user/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // userId, firstName, lastName, email, password, address, dob, occupation
        body: JSON.stringify({
          userId: userId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          address: address,
          dob: dob,
          occupation: occupation,
          studentIds: studentIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Profile updated successfully:", data);
      // Handle success response here
    } catch (error) {
      console.error("Could not update profile:", error);
    }
  };
  return (
    <div className="h-container">
      <div className="header">
        <img
          src={logo}
          alt="Illini Logo"
          className="logo"
          onClick={() => navigate(nav_path)}
        />
        <h1 className="student-title">{userType}</h1>
        <img className="profile-picture" onClick={() => navigate("/profileView")} src={profilePic} alt="Profile Pic"/>
      </div>
      <div className="profile-content">
        <h1>Profile</h1>
        <div className="profile-field">First Name</div>
        <input  type="text" placeholder="Enter First Name" value={firstName} 
                                                onChange={(e) => setFirstName(e.target.value)} className="profile-input"></input>
        <div className="profile-field">Last Name</div>
        <input type="text" placeholder="Enter Last Name" value={lastName} 
                                                onChange={(e) => setLastName(e.target.value)} className="profile-input"></input>
        <div className="profile-field">Email</div>
        <input type="email" placeholder="Enter Email" value={email} 
                                                onChange={(e) => setEmail(e.target.value)} className="profile-input"></input>
        <div className="profile-field">Password</div>
        <input type="password" placeholder="Enter Password" value={password} 
                                                onChange={(e) => setPassword(e.target.value)} className="profile-input"></input>
        <div className="profile-field">Address</div>
        <input type="text" placeholder="Enter Address" value={address} 
                                                onChange={(e) => setAddress(e.target.value)} className="profile-input"></input>
        <div className="profile-field">Date of Birth</div>
        <input type="date" placeholder="Enter DOB" value={dob} 
                                                onChange={(e) => setDOB(e.target.value)} className="profile-input"></input>
        {(userType === "Parent") && (
            <div style={{marginLeft:"0"}}>
              <div className="profile-field">Occupation</div>
              <input type="text" placeholder="Enter Occupation" value={occupation} 
                                                onChange={(e) => setOccupation(e.target.value)} className="parent-input"></input>
              <div className="profile-field">Student Ids</div>
              <input type="text" placeholder="Enter Student Ids" value={studentIds} 
                                                onChange={(e) => setStudentIds(e.target.value)} className="parent-input"></input>
            </div>
        )}
        <button style={{marginLeft:"47%", marginTop:"2%", width:"5%"}} onClick={() => editProfile()}>Submit</button>
      </div>
    </div>
  );
};

export default ProfileView;
