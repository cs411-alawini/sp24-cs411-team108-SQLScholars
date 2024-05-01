import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/HomePage.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import settingsbutton from "../img/three-dots.png";
import profilePic from "../img/profile.png";

const CourseCard = ({ course, onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userData = localStorage.getItem("userData");
  const parsedData = JSON.parse(userData);
  const uId = parsedData.userId;
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();
  // Ensure classToppers is an array, default to empty if undefined
  const toppers = course.classToppers || [];
  const handleCardClick = () => {
    navigate(
      `/classGroupview?classGroupId=${course.classGroupId}&classroomId=${course.classroomId}`
    );
  };

  const handleEdit = () => {
    // Add your logic to handle edit
    navigate(
      `/editClassGroup?classGroupId=${course.classGroupId}&userId=${uId}`
    );
    setMenuOpen(false); // Close the menu
  };

  // Function to handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://34.28.230.12/api/classroomgroup/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classGroupId: course.classGroupId,
            userId: uId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the classroom group");
      }
      onDelete(course.classGroupId); // Notify the parent component to update its state
      setMenuOpen(false); // Close the menu
    } catch (error) {
      console.error("Error deleting classroom group:", error);
    }
  };

  return (
    <div className="course-card">
      <div className="card-header">
        <img src={logo} alt="University Logo" />
        <h3>University of Illinois at Urbana-Champaign</h3>
        <button className="menu-button" onClick={toggleMenu}>
          <img src={settingsbutton} className="three-dots-icon" alt="Menu" />
        </button>
        {menuOpen && (
          <div className="menu-content">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
      <div className="card-body">
        <div onClick={handleCardClick}>
          <h4>{course.subjectName}</h4>
          <p>Class: {course.className}</p>
          <p>Starts at: {course.classStartTimings}</p>
          <p>Duration: {course.classDuration} hours</p>
          <p>Rating: {course.rating}</p>
        </div>

        <button
          onClick={() =>
            window.open(course.zoomLink, "_blank", "noopener,noreferrer")
          }
        >
          Join Class
        </button>
        <button onClick={openModal}>View Toppers</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Class Toppers"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Class Toppers</h2>
          {toppers.length > 0 ? (
            <ul>
              {toppers.map((topper, index) => (
                <li key={index}>
                  {topper.topperFirstName} {topper.topperLastName} - Grade:{" "}
                  {topper.topperAverage}
                </li>
              ))}
            </ul>
          ) : (
            <p>No toppers available.</p>
          )}
          <button onClick={closeModal}>Close</button>
        </Modal>
      </div>
    </div>
  );
};

const HomePageAdmin = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      console.error("User data not found in local storage");
      return;
    }
    console.log(JSON.parse(userData));

    const { userId } = JSON.parse(userData);

    console.log(`Fetching courses for user ${userId}`);

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://34.28.230.12/api/classroomgroup/getAll?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data.data.classroomGroups); // Update state with fetched courses
      } catch (error) {
        console.error("Could not fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = (classGroupId) => {
    setCourses((courses) =>
      courses.filter((course) => course.classGroupId !== classGroupId)
    );
  };

  const logoutUser = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <input
          type="search"
          placeholder="Search for Classroom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span style={{fontWeight: "550", fontSize: "20px"}}>Administrator</span>
        <div className="container" style={{ marginLeft: "63%" }}>
          <button type="button" className="create-button" onClick={() => navigate('/createClassroom')}>
            Create Classroom
          </button>
          <button type="button" className="logout-button" onClick={logoutUser}>
            Logout
          </button>
        </div>
        <img
          className="profile-picture"
          onClick={() => navigate("/profileView")}
          src={profilePic}
          alt="Profile Pic"
        />
      </header>
      <div className="courses-container">
        {filteredCourses.map((course, index) => (
          <CourseCard
            key={index}
            course={course}
            onDelete={handleDeleteCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePageAdmin;
