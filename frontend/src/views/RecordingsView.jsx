import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const RecordingsView = () => {
  const [userType, setUserType] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [recordingLink, setRecordingLink] = useState("");
  const [tRecordingLink, setTRecordingLink] = useState("");
  const [classDate, setClassDate] = useState("");
  const [tClassDate, setTClassDate] = useState("");
  const [recordingId, setRecordingId] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [nav_path, setPath] = useState("/homeTeacher");

  const cgId = params.get("classGroupId");
  const crId = params.get("classroomId");
  const getRecordings = async () => {
    try {
      const response = await fetch(
        `http://34.28.230.12/api/classroomgroup/getRecordings?classGroupId=${cgId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setRecordings(data.data.classroomGroupRecordings);
    } catch (error) {
      console.error("Could not fetch recordings:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserId(parsedData.userId);
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

      getRecordings();
    } else {
      console.error("User data not found in local storage");
    }
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
      label: "Recordings",
      path: `/recordingsView?classGroupId=${cgId}&classroomId=${crId}`,
    },
  ];

  const handleOptionClick = (path) => {
    setIsActive(false);
    navigate(path);
  };

  const cancelAddRecording = () => {
    setTRecordingLink("");
    setTClassDate("");
    setAddModalOpen(false);
  };
  // Parameters - userId, classGroupId, recordingLink, classDate
  const submitAddRecording = async () => {
    try {
      const response = await fetch(
        "http://34.28.230.12/api/classroomgroup/addRecording",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            classGroupId: cgId,
            recordingLink: tRecordingLink,
            classDate: tClassDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Recording added successfully:", data);
      setRecordingLink(tRecordingLink);
      setClassDate(tClassDate);
    } catch (error) {
      console.error("Could not add recording:", error);
    }
    setTRecordingLink("");
    setTClassDate("");
    getRecordings();
    setAddModalOpen(false);
  };

  const openEditModal = (recording) => {
    setTRecordingLink(recording.recordingLink);
    setTClassDate(recording.classDate);
    setRecordingId(recording.recordingId);
    setEditModalOpen(true);
  };

  const editRecording = async (recording) => {
    try {
      const response = await fetch(
        "http://34.28.230.12/api/classroomgroup/editRecording",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            classGroupId: cgId,
            recordingId: recordingId,
            recordingLink: tRecordingLink,
            classDate: tClassDate,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Recording link edited successfully:", data);
    } catch (error) {
      console.error("Could not edit recording:", error);
    }
    setEditModalOpen(false);
    setRecordingId("");
    setTRecordingLink("");
    setTClassDate("");
    getRecordings();
  };

  const cancelEditRecording = () => {
    setEditModalOpen(false);
    setRecordingId("");
    setTRecordingLink("");
    setTClassDate("");
  };

  const deleteRecording = async (recording) => {
    try {
      const response = await fetch(
        "http://34.28.230.12/api/classroomgroup/deleteRecording",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            classGroupId: cgId,
            recordingId: recording.recordingId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Recording deleted successfully:", data);
    } catch (error) {
      console.error("Could not delete recording:", error);
    }
    if (recordings.length === 1) {
      setRecordings([]);
    } else {
      getRecordings();
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
      <div className="recordings-content">
        <h1 className="student-title">Recordings View</h1>
        {addModalOpen && (
          <div className="modal-recordings">
            <h1 className="student-title">Add Recording</h1>
            <span>Recording Link: </span>
            <span>
              <input
                type="text"
                placeholder="Enter Recording Link"
                value={tRecordingLink}
                onChange={(e) => setTRecordingLink(e.target.value)}
                className="r-add-input"
              ></input>
            </span>
            <span>Class Date: </span>
            <span>
              <input
                type="date"
                placeholder="Enter Class Date"
                value={tClassDate}
                onChange={(e) => setTClassDate(e.target.value)}
                className="r-add-input"
              ></input>
            </span>
            <button onClick={() => cancelAddRecording()}>Cancel</button>
            <button onClick={() => submitAddRecording()}>Submit</button>
          </div>
        )}

        {addModalOpen && (
          <div className="modal-recordings">
            <h1 className="student-title">Add Recording</h1>
            <span>Recording Link: </span>
            <span>
              <input
                type="text"
                placeholder="Enter Recording Link"
                value={tRecordingLink}
                onChange={(e) => setTRecordingLink(e.target.value)}
                className="r-add-input"
              ></input>
            </span>
            <span>Class Date: </span>
            <span>
              <input
                type="date"
                placeholder="Enter Class Date"
                value={tClassDate}
                onChange={(e) => setTClassDate(e.target.value)}
                className="r-add-input"
              ></input>
            </span>
            <button onClick={() => cancelAddRecording()}>Cancel</button>
            <button onClick={() => submitAddRecording()}>Submit</button>
          </div>
        )}
        {editModalOpen && (
          <div className="modal-recordings">
            <h1 className="student-title">Edit Recording</h1>
            <span>Recording Link: </span>
            <span>
              <input
                type="text"
                placeholder="Enter Recording Link"
                value={tRecordingLink}
                onChange={(e) => setTRecordingLink(e.target.value)}
                className="r-add-input"
              ></input>
            </span>
            <span>Class Date: </span>
            <span>
              <input
                type="date"
                placeholder="Enter Class Date"
                value={tClassDate}
                onChange={(e) => setTClassDate(e.target.value)}
                className="r-add-input"
              ></input>
            </span>
            <button onClick={() => cancelEditRecording()}>Cancel</button>
            <button onClick={() => editRecording()}>Submit</button>
          </div>
        )}
        <div className="class-group-table1">
          <table className="add-student-table">
            <thead>
              <tr>
                <th>Recording Link</th>
                <th>Recording Date</th>

                {userType === "Teacher" ? <th>Edit Recording?</th> : null}
                {userType === "Teacher" ? <th>Delete Recording?</th> : null}
              </tr>
            </thead>
            <tbody>
              {recordings.map((recording, index) => (
                <tr key={index}>
                  <td>
                    <a
                      href={`http://${recording.recordingLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here
                    </a>
                  </td>
                  <td>{recording.classDate}</td>
                  {userType === "Teacher" ? (
                    <td style={{ textAlign: "center" }}>
                      <button onClick={() => openEditModal(recording)}>
                        Edit Recording
                      </button>
                    </td>
                  ) : null}
                  {userType === "Teacher" ? (
                    <td style={{ textAlign: "center" }}>
                      <button onClick={() => deleteRecording(recording)}>
                        Delete Recording
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {userType === "Teacher" && (
            <div
              style={{ marginTop: "20px", width: "100%", textAlign: "center" }}
            >
              <button
                className="search-button"
                onClick={() => setAddModalOpen(true)}
              >
                Add New Recording
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingsView;
