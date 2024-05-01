import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputModal from "./InputModal";

const AttendanceView = () => {
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserType] = useState(null);
  const [attendanceData, setAttendance] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [isPresent, setIsPresent] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cgId = params.get("classGroupId");
  const crId = params.get("classroomId");
  const [nav_path, setPath] = useState("/homeTeacher");

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
    fetchAttendance();
  }, [crId, userId]);

  const fetchAttendance = async () => {
    try {
      const userData = localStorage.getItem("userData");
      const parsedData = JSON.parse(userData);
      const uId = parsedData.userId;
      const response = await fetch(
        `http://34.28.230.12/api/attendance/get?classroomId=${crId}&userId=${uId}`
      );
      const responseData = await response.json();
      const { attendance } = responseData.data;
      setAttendance(attendance);
    } catch (error) {
      console.error("Could not fetch details:", error);
    }
  };

  const handleAttendanceAction = async (currentAction) => {
    if (
      currentAction === "create" &&
      (!userId || !attendanceDate || !isPresent)
    ) {
      alert("Please fill all fields");
      return;
    }
    const isPresentBool = isPresent.toLowerCase() === "yes";
    let apiUrl = `http://34.28.230.12/api/attendance/${
      currentAction === "update" ? "update" : "create"
    }`;
    const method = currentAction === "update" ? "PUT" : "POST";

    const payload = {
      userId,
      classroomId: crId,
      attendanceDate,
      isPresent: isPresentBool,
    };

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      alert(data.message);
      await fetchAttendance();
    } catch (error) {
      console.error("Failed to process attendance:", error);
    }

    setModalOpen(false);
    setUserId("");
    setAttendanceDate("");
    setIsPresent("");
  };

  const handleModalOpen = (action, uid, dt) => {
    setAction(action);
    setUserId(uid);
    console.log("date:", dt);
    setAttendanceDate(dt);
    setModalOpen(true);
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
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date</th>
                <th>Is Present</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, index) => (
                <tr key={index}>
                  <td>{data.studentId}</td>
                  <td>{data.firstName}</td>
                  <td>{data.lastName}</td>
                  <td>
                    {new Date(data.attendanceDate).toLocaleDateString("en-GB", {
                      timeZone: "UTC",
                      dateStyle: "medium",
                    })}
                  </td>
                  <td>{data.isPresent ? "Yes" : "No"}</td>
                  {(userType === "Teacher" || userType === "Admin") && (
                    <td>
                      <button
                        onClick={() => {
                          console.log("date:", data.attendanceDate);
                          // const date = new Date(timestamp).toISOString().split('T')[0];
                          handleModalOpen(
                            "update",
                            data.studentId,
                            new Date(data.attendanceDate)
                              .toISOString()
                              .split("T")[0]
                          );
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {(userType === "Admin" || userType === "Teacher") && (
            <div
              style={{ marginTop: "20px", maxWidth: "600px", width: "100%" }}
            >
              <button onClick={() => handleModalOpen("create", "", "")}>
                Add New Attendance
              </button>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal">
          <h2>{`${
            action.charAt(0).toUpperCase() + action.slice(1)
          } Attendance`}</h2>
          {action === "create" && (
            <>
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </>
          )}
          <input
            type="text"
            placeholder="Present?(Yes/No)"
            value={isPresent}
            onChange={(e) => setIsPresent(e.target.value)}
          />
          <button onClick={() => handleAttendanceAction(action)}>{`${
            action.charAt(0).toUpperCase() + action.slice(1)
          }`}</button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
