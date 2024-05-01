import React, { useState, useEffect, URLSearchParams } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import "../css/LoginPage.css";

function ClassGroupView() {
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserId] = useState(null);
  const [classGroupData, setclassGroupData] = useState([]);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
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

    const fetchDetails = async () => {
      try {
        const userData = localStorage.getItem("userData");
        const parsedData = JSON.parse(userData);
        const uId = parsedData.userId;
        console.log("Classgroup:", cgId);
        console.log("userId:", parsedData.userId);
        const response = await fetch(
          `http://34.28.230.12/api/classroomgroup/getDetails?classGroupId=${cgId}&userId=${uId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData); // Check the response data structure
        const { data } = responseData; // Destructure the response data
        const { classroomGroup } = data; // Access the classroomGroup object
        console.log(classroomGroup); // Check the classroomGroup data
        setclassGroupData(classroomGroup); // Update state with classroomGroup data
      } catch (error) {
        console.error("Could not fetch details:", error);
      }
    };
    fetchDetails();
  }, []);

  const options = [
    {
      id: "home",
      label: "Home",
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
    {
      id: "recording",
      label : "Recordings",
      path: `/recordingsView?classGroupId=${cgId}&classroomId=${crId}`
    },
  ];

  const handleOptionClick = (path) => {
    setIsActive(false);
    navigate(path);
  };

  const logoutUser = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="h-container">
      <div className="header">
        <img
          src={logo}
          alt="Illini Logo"
          className="logo"
          onClick={() => navigate("/homeStudent")}
        />
        <h1 className="student-title">{userType}</h1>
        <header className="app-header">
          <div className="container" style={{ marginLeft: "500px" }}>
            <button
              type="button"
              className="logout-button"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        </header>
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
        {classGroupData ? (
          <>
            <table className="class-group-table">
              <tbody>
                <tr>
                  <th>Class Name</th>
                  <td>{classGroupData.className}</td>
                </tr>
                <tr>
                  <th>Class Name</th>
                  <td>{classGroupData.subjectName}</td>
                </tr>
                <tr>
                  <th>Class ID</th>
                  <td>{classGroupData.classGroupId}</td>
                </tr>
                <tr>
                  <th>Zoom Link</th>
                  <td>
                    <a
                      href={classGroupData.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Class
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>Start Time</th>
                  <td>{classGroupData.classStartTimings}</td>
                </tr>
                <tr>
                  <th>Duration</th>
                  <td>{classGroupData.classDuration} hours</td>
                </tr>
                {userType == "Admin" ? (
                  <tr>
                    <th>STAR Student</th>
                    <td>{classGroupData.starStudents}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            {/* <p>Total Students:{classGroupData.users.length}</p> */}
          </>
        ) : (
          <p>No class group data available.</p>
        )}
      </div>
    </div>
  );
}

export default ClassGroupView;
