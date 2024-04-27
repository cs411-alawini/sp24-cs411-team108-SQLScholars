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

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const types = ["Admin", "Teacher", "Student", "Parent"];
      setUserType(types[parsedData.userType]);
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
    if (!userId || !attendanceDate || !isPresent) {
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
    // Close the modal and reset form after submission
    setModalOpen(false);
    setUserId("");
    setAttendanceDate("");
    setIsPresent("");
  };

  const handleModalOpen = (action) => {
    setAction(action);
    setModalOpen(true);
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
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date</th>
                <th>Is Present</th>
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
                </tr>
              ))}
            </tbody>
          </table>
          {(userType === "Admin" || userType === "Teacher") && (
            <div
              style={{ marginTop: "20px", maxWidth: "600px", width: "100%" }}
            >
              <button onClick={() => handleModalOpen("update")}>
                Edit Attendance
              </button>
              <button onClick={() => handleModalOpen("create")}>
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
          <input
            type="text"
            placeholder="Is the user present? (Yes/No)"
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
