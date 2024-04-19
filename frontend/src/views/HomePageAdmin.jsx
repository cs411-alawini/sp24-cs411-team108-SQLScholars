import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/HomePage.css";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
  
    // Ensure classToppers is an array, default to empty if undefined
    const toppers = course.classToppers || [];
  
    return (
      <div className="course-card">
        <div className="card-header">
          <img src={logo} alt="University Logo" />
          <h3>University of Illinois at Urbana-Champaign</h3>
        </div>
        <div className="card-body">
          <h4>{course.subjectName}</h4>
          <p>Class: {course.className}</p>
          <p>Starts at: {course.classStartTimings}</p>
          <p>Duration: {course.classDuration} hours</p>
          <p>Rating: {course.rating}</p>
          <button onClick={() => window.open(course.zoomLink, '_blank', 'noopener,noreferrer')}>Join Class</button>
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
                  <li key={index}>{topper.topperFirstName} {topper.topperLastName} - Grade: {topper.topperAverage}</li>
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
  useEffect(() => {

    const userData = localStorage.getItem('userData');
    if(!userData){
      console.error('User data not found in local storage');
      return;
    }
    console.log(JSON.parse(userData));

    const { userId } = JSON.parse(userData);

    console.log(`Fetching courses for user ${userId}`);

    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://34.28.230.12/api/classroomgroup/getAll?userId=${userId}`);
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
  
  const logoutUser = () => {
    localStorage.removeItem('userData');
    navigate('/');
  }
  
  return (
    <div className="app">
      <header className="app-header">
        <input type="search" placeholder="Search for Classroom..." />
        <div className="container">
          <button type="button" className="create-button">Create Classroom</button>
          <button type="button" className="logout-button" onClick={logoutUser}>Logout</button>
        </div>
      </header>
      <div className="courses-container">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};

export default HomePageAdmin;
