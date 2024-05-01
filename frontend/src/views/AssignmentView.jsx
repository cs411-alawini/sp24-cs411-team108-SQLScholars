import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const AssignmentView = () => {
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserType] = useState(null);
  const [assignmentData, setAssignment] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [googleFormLink, setGoogleFormLink] = useState("");
  const [maximumGrade, setMaxGrade] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cgId = params.get("classGroupId");
  const crId = params.get("classroomId");
  const classGroupId = cgId;
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
      if (parsedData.userType == 0) {
        setPath("/homeAdmin");
      } else if (parsedData.userType == 1) {
        setPath("/homeTeacher");
      } else if (parsedData.userType == 2) {
        setPath("/homeStudent");
      } else if (parsedData.userType == 3) {
        setPath("/homeParent");
      }
      const types = ["Admin", "Teacher", "Student", "Parent"];
      setUserType(types[parsedData.userType]);
    } else {
      console.error("User data not found in local storage");
    }
    fetchAssignment();
  }, []);

  const fetchAssignment = async () => {
    try {
      const userData = localStorage.getItem("userData");
      const parsedData = JSON.parse(userData);
      const uId = parsedData.userId;
      const response = await fetch(
        `http://34.28.230.12/api/assignment/getAssignments?classGroupId=${cgId}&userId=${uId}`
      );
      const responseData = await response.json();
      const assignment = responseData.data.assignments;
      console.log("assignment:", assignment);
      console.log("responseData:", responseData);
      setAssignment(assignment);
    } catch (error) {
      console.error("Could not fetch details:", error);
    }
  };

  const handleAssignmentAction = async (action) => {
    if (action === "create" && (!googleFormLink || !maximumGrade)) {
      alert("Please fill all required fields for creating an assignment.");
      return;
    } else if (action === "edit" && (!googleFormLink || !maximumGrade)) {
      alert("Please fill all required fields for editing an assignment.");
      return;
    }
    const userData = localStorage.getItem("userData");
    const parsedData = JSON.parse(userData);
    const userId = parsedData.userId;

    let apiUrl = `http://34.28.230.12/api/assignment/${action}`;
    const method = action === "edit" ? "PUT" : "POST";

    const payload = {
      userId: userId,
      assignmentId: action !== "create" ? assignmentId : undefined,
      googleFormLink: action !== "delete" ? googleFormLink : undefined,
      maximumGrade: action !== "delete" ? maximumGrade : undefined,
      classGroupId: action === "create" ? classGroupId : undefined,
    };

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      alert(data.message);
      await fetchAssignment();
    } catch (error) {
      console.error("Failed to process assignment:", error);
    }

    setModalOpen(false);
    setAssignmentId("");
    setGoogleFormLink("");
    setMaxGrade("");
  };

  const handleModalOpen = (action, ass_id) => {
    setAction(action);
    setAssignmentId(ass_id);
    setModalOpen(true);
  };

  const logoutUser = () => {
    localStorage.removeItem("userData");
    navigate("/login");
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
                <th>Google Form Link</th>
                <th>Average Student Grade</th>
                <th>Maximum Grade Possible</th>
                <th>Maximum Student Grade</th>
                <th>Check Grade</th>
                {userType === "Teacher" && <th>Edit</th>}
                {userType === "Teacher" && <th>Delete</th>}
              </tr>
            </thead>
            <tbody>
              {assignmentData.map((data, index) => (
                <tr key={index}>
                  <td>{data.assignmentId}</td>
                  <td>{data.googleFormLink}</td>
                  <td>
                    {data.averageGrade === null ? "N.A" : data.averageGrade}
                  </td>
                  <td>{data.maxPossibleGrade}</td>
                  <td>
                    {data.maxStudentScore === null
                      ? "N.A"
                      : data.maxStudentScore}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(
                          `/gradesView?classGroupId=${cgId}&classroomId=${crId}&assignmentId=${data.assignmentId}`
                        )
                      }
                    >
                      View Grade
                    </button>
                  </td>
                  {userType === "Teacher" && (
                    <td>
                      <button
                        onClick={() =>
                          handleModalOpen("edit", data.assignmentId)
                        }
                      >
                        Edit
                      </button>
                    </td>
                  )}
                  {userType === "Teacher" && (
                    <td>
                      <button
                        onClick={() =>
                          handleModalOpen("delete", data.assignmentId)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {userType === "Teacher" && (
            <div
              style={{ marginTop: "20px", maxWidth: "600px", width: "100%" }}
            >
              <button onClick={() => handleModalOpen("create")}>Add</button>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <h2>{`${
            action.charAt(0).toUpperCase() + action.slice(1)
          } Assignment`}</h2>
          {(action === "edit" || action === "create") && (
            <>
              <input
                type="text"
                placeholder="Enter Google Form Link"
                value={googleFormLink}
                onChange={(e) => setGoogleFormLink(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Maximum Grade"
                value={maximumGrade}
                onChange={(e) => setMaxGrade(e.target.value)}
              />
            </>
          )}
          <button onClick={() => handleAssignmentAction(action)}>Submit</button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AssignmentView;
