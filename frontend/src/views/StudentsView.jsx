import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentView = () => {
  const [userType, setUserId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cgId = params.get("classGroupId");
  const crId = params.get("classroomId");
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.userType == 0) {
        setUserId("Admin");
      } else if (parsedData.userType == 1) {
        setUserId("Teacher");
      } else if (parsedData.userType == 2) {
        setUserId("Student");
      } else if (parsedData.userType == 3) {
        setUserId("Parent");
      }
    } else {
      console.error("User data not found in local storage");
    }
  }, []);

  const options = [
    {
      id: "home",
      label: "Home",
      path: `/homeStudent`,
    },
    {
      id: "classGroup",
      label: "ClassGroup View",
      path: `/classGroupview?classGroupId=${cgId}&classroomId=${crId}`,
    },
    {
      id: "attendance",
      label: "Attendance",
      path: `/attendanceView?classGroupId=${cgId}&classroomId=${crId}`,
    },
    {
      id: "assignments",
      label: "Assignments",
      path: `/assignmentView?classGroupId=${cgId}&classroomId=${crId}`,
    },
    {
      id: "student",
      label: "Students",
      path: `/studentView?classGroupId=${cgId}&classroomId=${crId}`,
    },
  ];

  const handleOptionClick = (path) => {
    setIsActive(false);
    navigate(path);
  };

  return (
    <div className="h-container">
      <div className="header">
        <img src={logo} alt="Illini Logo" className="logo" />
        <h1 className="student-title">{userType}</h1>
      </div>
      <button
        className={`hamburger-icon ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
      >
        &#9776;
      </button>
      {isActive && (
        <div className="sidebar">
          {options.map((option) => (
            <button
              key={option.id}
              className="menu-option"
              onClick={() => handleOptionClick(option.path)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      <div className="content">
        <div>
          <h1>Students View</h1>
        </div>
      </div>
    </div>
  );
};
export default StudentView;
