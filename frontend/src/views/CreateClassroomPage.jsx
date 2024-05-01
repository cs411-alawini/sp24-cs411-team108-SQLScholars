import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/FormStyle.css";



const CreateClassroomPage = () => {
  const [newClassroom, setNewClassroom] = useState({
    classroomId: '',
    courseId: '',
    userId: '',
    startsAt: '',
    duration: '',
    zoomLink: '',
  });

  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchCourses = async () => {
    setIsLoading(true);
    setError('');

    const userData = localStorage.getItem("userData");
    if (!userData) {
      setError('User data not found');
      setIsLoading(false);
      return;
    }
    
    const parsedData = JSON.parse(userData);
    const uId = parsedData.userId;

    try {

      const response = await fetch(`http://34.28.230.12/api/course/fetch?userId=${uId}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const json = await response.json();
      setCourses(json.data.courses); // Ensure this path matches your actual data structure
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  fetchCourses();
}, []);

useEffect(() => {
  const fetchClassrooms = async () => {
    setIsLoading(true);
    const userData = localStorage.getItem("userData");
    if (!userData) {
      setError('User data not found');
      setIsLoading(false);
      return;
    }
    
    const parsedData = JSON.parse(userData);
    const uId = parsedData.userId;

    try {
      const response = await fetch(`http://34.28.230.12/api/classroom/fetch?userId=${uId}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch classrooms');
      }
      const data = await response.json();
      setClassrooms(data.data.classrooms); // Make sure to adjust according to your data structure
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchClassrooms();
}, []); 

  console.log(courses);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userData = localStorage.getItem("userData");
    const parsedData = JSON.parse(userData);
    const userId = parsedData.userId;  
  
    try {
      const response = await fetch(`http://34.28.230.12/api/classroomgroup/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId: newClassroom.classroomId,
          courseId: newClassroom.courseId,
          userId: userId, 
          zoomLink: newClassroom.zoomLink,
          classStartTimings: newClassroom.startsAt,
          classDuration: newClassroom.duration,
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create classroom');
      }
      
      const data = await response.json();
      console.log('Classroom created successfully:', data);
      navigate('/homeAdmin'); // Navigate after successful creation
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Course:
          <select
            value={newClassroom.courseId}
            onChange={(e) => setNewClassroom({ ...newClassroom, courseId: e.target.value })}
            required
          >
            <option value="">Select a subject</option>
            {courses.map(course => (
              <option key={course.courseId} value={course.courseId}>
                {course.subjectName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Class:
          <select
            value={newClassroom.classroomId}
            onChange={(e) => setNewClassroom({ ...newClassroom, classroomId: e.target.value })}
            required
          >
            <option value="">Select a class</option>
            {classrooms.map(classroom => (
              <option key={classroom.classroomId} value={classroom.classroomId}>
                {classroom.className}
              </option>
            ))}
          </select>
        </label>
        <label>
          Starts At:
          <input
            type="time"
            value={newClassroom.startsAt}
            onChange={(e) => setNewClassroom({ ...newClassroom, startsAt: e.target.value })}
            required
          />
        </label>
        <label>
          Duration (hours):
          <input
            type="number"
            step="0.01"
            value={newClassroom.duration}
            onChange={(e) => setNewClassroom({ ...newClassroom, duration: e.target.value })}
            required
          />
        </label>
        <label>
          Zoom Link:
          <input
            type="text"
            value={newClassroom.zoomLink}
            onChange={(e) => setNewClassroom({ ...newClassroom, zoomLink: e.target.value })}
            required
          />
        </label>
        <button type="submit">Create Classroom</button>
      </form>
    </div>
  );
};

export default CreateClassroomPage;
