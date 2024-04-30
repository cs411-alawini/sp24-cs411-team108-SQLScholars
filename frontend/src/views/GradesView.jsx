import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const GradesView = () => {
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserType] = useState(null);
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cgId = params.get("classGroupId");
  const crId = params.get("classroomId");
  const assId = params.get("assignmentId");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const types = ["Admin", "Teacher", "Student", "Parent"];
      setUserType(types[parsedData.userType]);
    } else {
      console.error("User data not found in local storage");
    }
    fetchGrades();
  }, []);

  const addGrade = async () => {
    const userId = prompt("Enter User ID:");
    const assignmentId = prompt("Enter Assignment ID:");
    const grade = prompt("Enter Grade:");
    const remarks = prompt("Enter Remarks:");
    if (
      userId === null ||
      assignmentId === null ||
      grade === null ||
      remarks === null
    ) {
      return;
    }

    const payload = { userId, assignmentId, grade, remarks };
    try {
      const response = await fetch(
        `http://34.28.230.12/api/assignment/addGrade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Add Grade Response:", data);
      fetchGrades(); // Refresh grades
    } catch (error) {
      console.error("Could not add grade:", error);
    }
  };

  // Function to edit a grade
  const editGrade = async () => {
    const userId = prompt("Enter User ID:");
    const assignmentId = prompt("Enter Assignment ID:");
    const grade = prompt("Enter New Grade:");
    const remarks = prompt("Enter Remarks:");
    if (
      userId === null ||
      assignmentId === null ||
      grade === null ||
      remarks === null
    ) {
      return;
    }
    const payload = { userId, assignmentId, grade, remarks };
    try {
      const response = await fetch(
        `http://34.28.230.12/api/assignment/editGrade`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Edit Grade Response:", data);
      fetchGrades(); // Refresh grades
    } catch (error) {
      console.error("Could not edit grade:", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        console.error("User data not found in local storage");
        return;
      }
      const parsedData = JSON.parse(userData);
      const response = await fetch(
        `http://34.28.230.12/api/assignment/getAssignmentGrades?assignmentId=${assId}&userId=${parsedData.userId}`
      );
      const responseData = await response.json();
      console.log("Grades response:", responseData);
      if (Array.isArray(responseData.data.assignmentGrades)) {
        setGrades(responseData.data.assignmentGrades);
      } else {
        throw new Error("Expected an array of grades");
      }
    } catch (error) {
      setGrades([]);
      console.error("Could not fetch grades:", error);
    }
  };

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
      <div className="attendance-table">
        <div
          className="class-group-table"
          style={{ marginLeft: "270px", width: "100%" }}
        >
          {(userType === "Admin" || userType === "Teacher") && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Assignment ID</th>
                    <th>Class Group ID</th>
                    <th>User ID</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.length > 0 ? (
                    grades.map((grade, index) => (
                      <tr key={index}>
                        <td>{grade.assignmentId}</td>
                        <td>{grade.classGroupId}</td>
                        <td>{grade.userId}</td>
                        <td>{grade.grade}</td>
                        <td style={{ width: "40%" }}>{grade.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No grades available</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ marginTop: "20px" }}>
                {userType === "Teacher" && (
                  <>
                    <button onClick={addGrade}>Add Grade</button>
                    <button onClick={editGrade}>Edit Grade</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default GradesView;
