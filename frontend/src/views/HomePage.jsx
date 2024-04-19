import React, { useState, useEffect } from "react";
import logo from "../img/illini_logo.png";
import "../css/HomePage.css";

const CourseCard = ({ course }) => {
  // Format the start time and date
  const startTime = new Date(course.classStartTimings).toLocaleTimeString();
  const startDate = new Date(course.classStartTimings).toLocaleDateString();

  return (
    <div className="course-card">
      <div className="card-header">
        <img src={logo} alt="University Logo" />
        <h3>University of Illinois at Urbana-Champaign</h3>
      </div>
      <div className="card-body">
        <h4>{course.subjectName}</h4>
        <p>Class: {course.className}</p>
        <p>Starts on: {startDate} at {startTime}</p>
        <p>Duration: {course.classDuration} hours</p>
        <p>Rating: {course.rating}</p>
        <a href={course.zoomLink}>Join Class</a>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);

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

  return (
    <div className="app">
      <header className="app-header">
        <input type="search" placeholder="Search for Classroom..." />
        <button type="button">Create Classroom</button>
      </header>
      <div className="courses-container">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
