import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import {format} from 'date-fns';;
import "../css/Hamburger.css";
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
  const [tFirstName, setTFirstName] = useState("");
  const [tLastName, setTLastName] = useState("");
  const [tEmail, setTEmail] = useState("");
  const [tPassword, setTPassword] = useState("");
  const [tAddress, setTAddress] = useState("");
  const [tDob, setTDOB] = useState("");
  const [tOccupation, setTOccupation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const types = ["Admin", "Teacher", "Student", "Parent"];
      setUserType(types[parsedData.userType]);
      getProfileInfo(parsedData.userId);
    } else {
      console.error("User data not found in local storage");
    }
    
  }, []);

  const getProfileInfo = async(userId) => {
    console.log(`Fetching profile info using userId: ${userId}`);
    try {
      const response = await fetch(`http://34.28.230.12/api/user/getProfile?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserId(data.data.user.userId);
      setFirstName(data.data.user.firstName);
      setLastName(data.data.user.lastName);
      setEmail(data.data.user.email);
      setPassword(data.data.user.password);
      setAddress(data.data.user.address);
      setDOB(format(new Date(data.data.user.dob), 'dd/MM/yyyy'));
      setOccupation(data.data.user.occupation);
      setStudentIds(data.data.user.studentIds);

      setTFirstName(data.data.user.firstName);
      setTLastName(data.data.user.lastName);
      setTEmail(data.data.user.email);
      setTPassword(data.data.user.password);
      setTAddress(data.data.user.address);
      setTDOB(format(new Date(data.data.user.dob), 'dd/MM/yyyy'));
      setTOccupation(data.data.user.occupation);
      console.log("tFirstName: ", tFirstName)
      console.log(data);
    } catch (error) {
      console.error("Could not fetch profile:", error);
    }
  };

  const editProfile = async() => {
    try {
      const response = await fetch('http://34.28.230.12/api/user/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // userId, firstName, lastName, email, password, address, dob, occupation
        body: JSON.stringify({
          userId: userId,
          firstName: tFirstName,
          lastName: tLastName,
          email: tEmail,
          password: tPassword,
          address: tAddress,
          dob: tDob,
          occupation: tOccupation
        }),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Profile updated successfully:', data);
      setFirstName(tFirstName);
      setLastName(tLastName);
      setEmail(tEmail);
      setPassword(tPassword);
      setAddress(tAddress);
      setDOB(tDob);
      setOccupation(tOccupation);
      setModalOpen(false);
        // Handle success response here
    } catch (error) {
      console.error('Could not update profile:', error);
    }
  };

  const cancel = () => {
    setTFirstName(firstName);
    setTLastName(lastName);
    setTEmail(email);
    setTPassword(password);
    setTAddress(address);
    setTDOB(dob);
    setTOccupation(occupation);
    setModalOpen(false);
  };
  
  return (
    <div className="h-container">
      <div className="header">
        <img src={logo} alt="Illini Logo" className="logo" />
        <h1 className="student-title">{userType}</h1>
      </div>
      <div className="profile-content">
        <h1>Profile</h1>
        <div>
          <div><span>User Id: </span><span>{userId}</span></div>
          <div><span>First Name: </span><span>{firstName}</span></div>
          <div><span>Last Name: </span><span>{lastName}</span></div>
          <div><span>Email: </span><span>{email}</span></div>
          <div><span>Password: </span><span>{password}</span></div>
          <div><span>Address: </span><span>{address}</span></div>
          <div><span>Date of Birth: </span><span>{dob}</span></div>
          <div><span>Occupation: </span><span>{occupation}</span></div>
          <div><span>Student IDs: </span><span>{studentIds}</span></div>
          <button style={{marginTop:"3%"}} onClick={() => setModalOpen(true)}>Edit Profile Info</button>

        </div>
      </div>
      {modalOpen && (
        <div className="modal-profile">
          <h2 className="student-title" style={{paddingBottom:"2%"}}>Edit Profile</h2>
          <div><span>First Name: </span><span><input type="text" placeholder="Enter First Name" value={tFirstName} 
                                                onChange={(e) => setTFirstName(e.target.value)} className="profile-input"></input></span></div>
          <div><span>Last Name: </span><span><input type="text" placeholder="Enter Last Name" value={tLastName} 
                                                onChange={(e) => setTLastName(e.target.value)} className="profile-input"></input></span></div>
          <div><span>Email: </span><span><input type="email" placeholder="Enter Email" value={tEmail} 
                                                onChange={(e) => setTEmail(e.target.value)} className="profile-input"></input></span></div>
          <div><span>Password: </span><span><input type="text" placeholder="Enter Password" value={tPassword} 
                                                onChange={(e) => setTPassword(e.target.value)} className="profile-input"></input></span></div>
          <div><span>Address: </span><span><input type="text" placeholder="Enter Address" value={tAddress} 
                                                onChange={(e) => setTAddress(e.target.value)} className="profile-input"></input></span></div>
          <div><span>Date of Birth: </span><span><input type="date" placeholder="Enter DOB" value={tDob} 
                                                onChange={(e) => setTDOB(e.target.value)} className="profile-input"></input></span></div>
          <div><span>Occupation: </span><span><input type="text" placeholder="Enter Occupation" value={tOccupation} 
                                                onChange={(e) => setTOccupation(e.target.value)} className="profile-input"></input></span></div>
          <button style={{marginTop:"5%"}} onClick={() => cancel()}>Cancel</button>
          <button style={{marginLeft:"30%", marginTop:"5%"}} onClick={() => editProfile()}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;