import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const GradesView = () => {
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserType] = useState(null);
  const [gradesData, setGradesData] = useState([]); // Change to gradesData
  const [grade, setGrades] = useState([]);
  const [action, setAction] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "add" or "edit"
  const [userId, setUserId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [remarks, setRemarks] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [nav_path, setPath] = useState("/homeTeacher");

  const cgId = params.get("classGroupId");
  const crId = params.get("classroomId");
  const assId = params.get("assignmentId");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const types = ["Admin", "Teacher", "Student", "Parent"];
      setUserType(types[parsedData.userType]);
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
    fetchGrades();
  }, []);

  const handleGradeSubmission = async () => {
    if (!userId || !grade) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("modal action:", action);
    const apiUrl = `http://34.28.230.12/api/assignment/${
      action === "add" ? "addGrade" : "editGrade"
    }`;
    const method = action === "add" ? "POST" : "PUT";
    const payload = { userId, assignmentId, grade, remarks };

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`${action === "add" ? "Add" : "Edit"} Grade Response:`, data);
      fetchGrades();
      setModalOpen(false);
    } catch (error) {
      console.error(
        `Could not ${action === "add" ? "add" : "edit"} grade:`,
        error
      );
    }
    setModalOpen(false);
    setUserId("");
    setAssignmentId("");
    setGrades("");
    setRemarks("");
  };

  const handleModalOpen = (action, u_id) => {
    setAction(action);
    setAssignmentId(assId);
    setUserId(u_id);
    setModalOpen(true);
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
        setGradesData(responseData.data.assignmentGrades);
      } else {
        throw new Error("Expected an array of grades");
      }
    } catch (error) {
      setGradesData([]);
      console.error("Could not fetch grades:", error);
    }
  };

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
      label: "Recordings",
      path: `/recordingsView?classGroupId=${cgId}&classroomId=${crId}`,
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
          onClick={() => navigate(nav_path)}
        />
        <h1 className="student-title">{userType}</h1>
        <header className="app-header">
          <div className="container" style={{ marginLeft: "1200px" }}>
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
      <div className="attendance-table">
        <div
          className="class-group-table"
          style={{ marginLeft: "270px", width: "100%" }}
        >
          <table>
            <thead>
              <tr>
                <th>Assignment ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>User ID</th>
                <th>Grade</th>
                <th>Remarks</th>
                {(userType === "Teacher" || userType === "Admin") && (
                  <th>Edit</th>
                )}
              </tr>
            </thead>
            <tbody>
              {gradesData.map((g, index) => (
                <tr key={index}>
                  <td>{g.assignmentId}</td>
                  <td>{g.firstName}</td>
                  <td>{g.lastName}</td>

                  <td>{g.userId}</td>
                  <td>{g.grade}</td>
                  <td>{g.remarks}</td>
                  {(userType === "Teacher" || userType === "Admin") && (
                    <td>
                      <button onClick={() => handleModalOpen("edit", g.userId)}>
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {(userType === "Admin" || userType === "Teacher") && (
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => handleModalOpen("add", "")}>
                Add Grade
              </button>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <h2>{`${action.charAt(0).toUpperCase() + action.slice(1)} Grade`}</h2>
          <input
            type="text"
            placeholder="Enter Grade"
            value={grade}
            onChange={(e) => setGrades(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          {action === "add" && (
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          )}

          <button onClick={handleGradeSubmission}>{`${
            action.charAt(0).toUpperCase() + action.slice(1)
          } Grade`}</button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default GradesView;
