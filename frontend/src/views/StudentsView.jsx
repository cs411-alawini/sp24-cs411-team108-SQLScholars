import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/Hamburger2.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentView = () => {
  const [userType, setUserType] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [queryList, setQueryList] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [students, setStudents] = useState([]);
  const [starStudents, setStarStudents] = useState([]);
  const [belowAvgStudents, setBelowAvgStudents] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cgId = params.get("classGroupId");
  const crId = params.get("classroomId");
  const [sModalOpen, setIsSModalOpen] = useState(false);
  const [tModalOpen, setIsTModalOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      console.error("User data not found in local storage");
      return;
    }
    const parsedData = JSON.parse(userData);
    console.log(`Fetching students using userId: ${parsedData.userId} and classGroupId: ${cgId}`);
    
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://34.28.230.12/api/classroomgroup/getDetails?classGroupId=${cgId}&userId=${parsedData.userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setStudents(data.data.classroomGroup.users); // Update state with fetched students
        setStarStudents(data.data.classroomGroup.starStudents);
        setBelowAvgStudents(data.data.classroomGroup.belowAverageStudents);
      } catch (error) {
        console.error("Could not fetch students:", error);
      }
    };

    fetchStudents();
    
    if (parsedData.userType === 0) {
      setUserType("Admin");
    } else if (parsedData.userType === 1) {
      setUserType("Teacher");
    } else if (parsedData.userType === 2) {
      setUserType("Student");
    } else if (parsedData.userType === 3) {
      setUserType("Parent");
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
    {
      id: "grades",
      label: "Grades",
      path: `/gradesView?classGroupId=${cgId}&classroomId=${crId}`,
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
  
  const deleteUser = async(student) => {
    try {
      const response = await fetch('http://34.28.230.12/api/classroomgroup/removeUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: student.userId,
          classGroupId: student.classGroupId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Student removed successfully:', data);
      const updatedStudents = students.filter(s => s.userId !== student.userId);
      setStudents(updatedStudents);
      // Handle success response here
    } catch (error) {
      console.error('Could not remove student:', error);
      // Handle error here
    }
  };

  const addStudentModal = () => {
    setIsSModalOpen(true);
  };

  const addTeacherModal = () => {
    setIsTModalOpen(true);
  }

  const closeSModal = () => {
    setUserQuery(null);
    setQueryList([]);
    setDisabledButtons([]);
    setIsSModalOpen(false);
  };

  const closeTModal = () => {
    setUserQuery(null);
    setQueryList([]);
    setDisabledButtons([]);
    setIsTModalOpen(false);
  }

  const searchStudent = async(num) => {
    try {
      const response = await fetch(`http://34.28.230.12/api/user/search?query=${userQuery}&userType=${num}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQueryList(data.data.users);
      console.log(data.data.users)
    } catch (error) {
      console.error("Could not fetch students:", error);
    }
  };
  const addUser = async(user, index) => {
    try {
      const response = await fetch('http://34.28.230.12/api/classroomgroup/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          classGroupId: cgId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Student added successfully:', data);
      const updatedStudents = [...students]
      updatedStudents.push(user);
      setStudents(updatedStudents);
      const updatedDisabled = [...disabledButtons];
      updatedDisabled.push(index);
      setDisabledButtons(updatedDisabled);
      // Handle success response here
    } catch (error) {
      console.error('Could not add student:', error);
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
      <div className="student-content">
      <h2 className="student-title">Teachers</h2>
        <div className="class-group-table1">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Joined At</th>
                {userType === "Admin" ? (
                  <th>Delete Teacher?</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {students
                .filter(student => student.userType == 1) // Filter out students not in starStudents
                .map((student, index) => (
                  <tr key={index}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.address}</td>
                    <td>{student.dob}</td>
                    <td>{student.email}</td>
                    <td>{student.userJoinedAt}</td>
                    {userType === "Admin" ? (
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => deleteUser(student)}>
                          Delete Teacher
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <h2 className="student-title">Star Students</h2>
        <div className="class-group-table1">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Joined At</th>
                {userType === "Teacher" || userType === "Admin" ? (
                  <th>Delete Student?</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {students
                .filter(student => starStudents.includes(student.userId)) // Filter out students not in starStudents
                .map((student, index) => (
                  <tr key={index}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.address}</td>
                    <td>{student.dob}</td>
                    <td>{student.email}</td>
                    <td>{student.userJoinedAt}</td>
                    {userType === "Teacher" || userType === "Admin" ? (
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => deleteUser(student)}>
                          Delete Student
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <h2 className="student-title">Regular Students</h2>
        <div className="class-group-table1">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Joined At</th>
                {userType === "Teacher" || userType === "Admin" ? (
                  <th>Delete Student?</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {students
                .filter(student => !starStudents.includes(student.userId) 
                  && !belowAvgStudents.includes(student.userId)
                  && student.userType === 2) // Filter out students not in starStudents and belowAvgStudents
                .map((student, index) => (
                  <tr key={index}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.address}</td>
                    <td>{student.dob}</td>
                    <td>{student.email}</td>
                    <td>{student.userJoinedAt}</td>
                    {userType === "Teacher" || userType === "Admin" ? (
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => deleteUser(student)}>
                          Delete Student
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <h2 className="student-title">Below Average Students</h2>
        <div className="class-group-table1">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Joined At</th>
                {userType === "Teacher" || userType === "Admin" ? (
                  <th>Delete Student?</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {students
                .filter(student => belowAvgStudents.includes(student.userId)) // Filter out students not in starStudents and belowAvgStudents
                .map((student, index) => (
                  <tr key={index}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.address}</td>
                    <td>{student.dob}</td>
                    <td>{student.email}</td>
                    <td>{student.userJoinedAt}</td>
                    {userType === "Teacher" || userType === "Admin" ? (
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => deleteUser(student)}>
                          Delete Student
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {sModalOpen && (
          <div className="modal-students">
            <h1 className="modal-title">
              Search For User
            </h1>
            <span style={{width: "100%", display:"flex", justifyContent: "center"}}>
              <input type="text"
                placeholder="Enter User"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="search-bar"></input>
              <button className="search-button" onClick={() => searchStudent(2)}>
                Search
              </button>
            </span>
            <div className="class-group-table1">
              <table className="add-student-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                    <th>Email</th>
                    {userType === "Teacher" || userType === "Admin" ? (
                      <th>Add Student?</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {queryList
                    .filter(student => !students.some(s => s.userId === student.userId))
                    .map((student, index) => (
                      <tr key={index}>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.address}</td>
                        <td>{student.dob}</td>
                        <td>{student.email}</td>
                        {userType === "Teacher" || userType === "Admin" ? (
                          <td style={{ textAlign: "center" }}>
                            <button disabled={disabledButtons.includes(index)} onClick={() => addUser(student, index)}>
                              Add Student
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <button style={{marginTop:"2%"}} onClick={() => closeSModal()}>Done</button>
          </div>
        )}
        {tModalOpen && (
          <div className="modal-students">
            <h1 className="modal-title">
              Search For User
            </h1>
            <span style={{width: "100%", display:"flex", justifyContent: "center"}}>
              <input type="text"
                placeholder="Enter User"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="search-bar"></input>
              <button className="search-button" onClick={() => searchStudent(1)}>
                Search
              </button>
            </span>
            <div className="class-group-table1">
              <table className="add-student-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                    <th>Email</th>
                    {userType === "Admin" ? (
                      <th>Add Teacher?</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {queryList
                    .filter(teacher => teacher.userType == 1 && !students.some(s => s.userId === teacher.userId))
                    .map((teacher, index) => (
                      <tr key={index}>
                        <td>{teacher.firstName}</td>
                        <td>{teacher.lastName}</td>
                        <td>{teacher.address}</td>
                        <td>{teacher.dob}</td>
                        <td>{teacher.email}</td>
                        {userType === "Admin" ? (
                          <td style={{ textAlign: "center" }}>
                            <button disabled={disabledButtons.includes(index)} onClick={() => addUser(teacher, index)}>
                              Add Teacher
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <button style={{marginTop:"2%"}} onClick={() => closeTModal()}>Done</button>
          </div>
        )}
        <div className="button-container">
          {(userType === "Teacher" || userType === "Admin") && (
            <button className="search-button" onClick={() => addStudentModal()}>
              Add New Student
            </button>
          )}
          {userType === "Admin" && (
            <button className="search-button" onClick={() => addTeacherModal()}>
              Add New Teacher
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentView;
