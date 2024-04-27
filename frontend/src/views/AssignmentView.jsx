import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const AssignmentView = () => {
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserType] = useState(null);
  const [assignmentData, setAssignment] = useState([]);
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
    // const userId = prompt("Enter User ID:");
    // const attendanceDate = prompt("Enter Attendance Date (YYYY-MM-DD):");
    // const isPresentInput = prompt("Is the user present? (Yes/No):");
    // const isPresent = isPresentInput.toLowerCase() === "yes";

    let apiUrl = `http://34.28.230.12/api/assignment`;
    let method = "POST"; // Default to POST for creating
    let payload;
    const userData = localStorage.getItem("userData");
    const parsedData = JSON.parse(userData);
    const uId = parsedData.userId;
    if (action === "update") {
      apiUrl += "/edit";
      method = "PUT";
      const googleFormLink = prompt("Enter New Google Form Link");
      const assId = prompt("Enter Assignment Id to be edited");
      const maximumGrade = prompt("Enter Maximum Possible Grade");
      if (googleFormLink === null || assId === null || maximumGrade === null) {
        return;
      }

      payload = {
        userId: uId,
        assignmentId: assId,
        googleFormLink,
        maximumGrade,
      };
    } else if (action === "create") {
      apiUrl += "/create";
      const googleFormLink = prompt("Enter Google Form Link");
      const maximumGrade = prompt("Enter Maximum Possible Grade");
      if (googleFormLink === null || maximumGrade === null) {
        return;
      }
      payload = {
        userId: uId,
        classGroupId: cgId,
        googleFormLink,
        maximumGrade,
      };
    } else if (action === "delete") {
      apiUrl += "/delete";
      const assId = prompt("Enter Assignment Id to be deleted");
      if (assId === null) {
        return;
      }
      payload = {
        userId: uId,
        assignmentId: assId,
      };
    }

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
      const data = await response.json(); // Process the JSON data from the response
      alert(data.message); // Display the response message to the user
      await fetchAssignment(); // Refresh data to show changes
    } catch (error) {
      console.error("Failed to process assignment:", error);
    }
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
                <th>Assignment ID</th>
                <th>Google Form Link</th>
                <th> Average Student Grade</th>
                <th>Maximum Grade Possible</th>
                <th>Maximum Student Grade</th>
                <th>Check Grade</th>
              </tr>
            </thead>
            <tbody>
              {assignmentData.map((data, index) => (
                <tr key={index}>
                  <td>{data.assignmentId}</td>
                  <td>{data.googleFormLink}</td>
                  <td>
                    {data.averageGrade == null ? "N.A" : data.averageGrade}
                  </td>
                  <td>{data.maxPossibleGrade}</td>
                  <td>
                    {data.maxStudentScore == null
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
                </tr>
              ))}
            </tbody>
          </table>
          {userType === "Teacher" && (
            <div
              style={{ marginTop: "20px", maxWidth: "600px", width: "100%" }}
            >
              <button onClick={() => handleAssignmentAction("update")}>
                Edit Assignment
              </button>
              <button onClick={() => handleAssignmentAction("create")}>
                Add New Assignment
              </button>
              <button onClick={() => handleAssignmentAction("delete")}>
                Delete Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentView;
