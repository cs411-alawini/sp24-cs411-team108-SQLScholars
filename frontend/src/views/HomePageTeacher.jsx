import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(
      `/classGroupview?classGroupId=${course.classGroupId}&classroomId=${course.classroomId}`
    );
  };

  const toppers = course.classToppers || [];

  return (
    <div className="course-card" onClick={handleCardClick}>
      <div className="card-header">
        <img src={logo} alt="University Logo" />
        <h3>University of Illinois at Urbana-Champaign</h3>
      </div>
      <div className="card-body">
        <h4>{course.subjectName}</h4>
        <p>Class: {course.className}</p>
        <p>{course.classroomGroups}</p>
        <p>Starts at: {course.classStartTimings}</p>
        <p>Duration: {course.classDuration} hours</p>
        {/* <p>Rating: {course.rating}</p> */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(course.zoomLink, "_blank", "noopener,noreferrer");
          }}
        >
          Join Class
        </button>
      </div>
    </div>
  );
};

const HomePageStudent = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCourses = courses.filter((course) =>
  course.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  course.className.toLowerCase().includes(searchQuery.toLowerCase())
);

  const logoutUser = () => {
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  return (
    <div className="app">
      <header className="app-header">
      <input
          type="search"
          placeholder="Search for Classroom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="container">
          <button type="button" className="logout-button" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </header>
      <div className="courses-container">
        {filteredCourses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};

export default HomePageStudent;
