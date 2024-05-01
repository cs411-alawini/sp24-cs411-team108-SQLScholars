import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/FormStyle.css";
import "../css/CreateClassroom.css";

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
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newCourseRating, setCourseRating] = useState('');

  useEffect(() => {
  const fetchCourses = async () => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      setError('User data not found');
      setIsLoading(false);
      return;
    }
    
  const parsedData = JSON.parse(userData);
  const uId = parsedData.userId;

    try {

      const response = await fetch(`http://34.28.230.12/api/course/fetch?userId=${uId}&limit=50`);
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
      const response = await fetch(`http://34.28.230.12/api/classroom/fetch?userId=${uId}&limit=50`);
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

  const logoutUser = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

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
  
  const handleCourseModalOpen = () => {
    setIsCourseModalOpen(true);
  };
  
  const handleCourseModalClose = () => {
    setIsCourseModalOpen(false);
    setNewCourseName('');

  };
  
  const handleClassModalOpen = () => {
    setIsNewClassModalOpen(true);
  };
  
  const handleClassModalClose = () => {
    setIsNewClassModalOpen(false);
    setNewClassName('');
  };
  

  const handleNewCourseSubmit = async (event) => {
    event.preventDefault();
    const userData = localStorage.getItem("userData");
      if (!userData) {
        setError('User data not found');
        setIsLoading(false);
        return;
      }
      const parsedData = JSON.parse(userData);
      const uId = parsedData.userId;
    try {
      const response = await fetch(`http://34.28.230.12/api/course/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectName: newCourseName,
          userId: uId,
          courseRating: 0
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create new course');
      }
      
      const data = await response.json();
      console.log('New Course created successfully:', data);
      navigate('/homeAdmin'); // Navigate after successful creation
    } catch (error) {
      console.error('Error creating new Course:', error);
    }
    
    console.log("New Course Added:", newCourseName); // Log the new course name
    handleCourseModalClose();
  };

  const handleNewClassSubmit = async (event) => {
    event.preventDefault();
    const userData = localStorage.getItem("userData");
      if (!userData) {
        setError('User data not found');
        setIsLoading(false);
        return;
      }
      const parsedData = JSON.parse(userData);
      const uId = parsedData.userId;
    
    try {
      const response = await fetch(`http://34.28.230.12/api/classroom/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className: newClassName,
          userId: uId,
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create new class');
      }
      
      const data = await response.json();
      console.log('New Class created successfully:', data);
      navigate('/homeAdmin'); // Navigate after successful creation
    } catch (error) {
      console.error('Error creating new Class:', error);
    }
    
    console.log("New Class Added:", newClassName); // Log the new course name
    handleClassModalClose();
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div>
        <header className="app-header">
        <span style={{fontWeight: "550", fontSize: "20px"}}>Administrator</span>
        <div className="container">
          <button type="button" className="logout-button" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </header>
    <div className="form-container">
      <form onSubmit={handleSubmit}>
      <label>
        Course:
        <div style={{ display: 'flex', alignItems: 'center', width:'100%', justifyContent: 'space-between' }}>
          <select
            value={newClassroom.courseId}
            onChange={(e) => setNewClassroom({ ...newClassroom, courseId: e.target.value })}
            required
            style={{ flex: 1, marginRight: '10px' }}  // Ensures dropdown takes most of the space and leaves some margin
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.courseId} value={course.courseId}>
                {course.subjectName}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleCourseModalOpen}>Add Course</button>
        </div>
      </label>
        <label>
          Class:
          <div style={{ display: 'flex', alignItems: 'center', width:'100%', justifyContent: 'space-between' }}>
          <select
            value={newClassroom.classroomId}
            onChange={(e) => setNewClassroom({ ...newClassroom, classroomId: e.target.value })}
            required
            style={{ flex: 1, marginRight: '10px' }} 
          >
            <option value="">Select a class</option>
            {classrooms.map(classroom => (
              <option key={classroom.classroomId} value={classroom.classroomId}>
                {classroom.className}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleClassModalOpen}>Add Class</button>
          </div>
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

      
      
  {isCourseModalOpen && (
  <>
    <div className="overlay" onClick={handleCourseModalClose}></div>
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={handleCourseModalClose}>&times;</span>
        <form onSubmit={handleNewCourseSubmit}>
          <label>
            New Course Name:
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              required
            />
          </label>
          <label>
            Course Rating:
            <input
              type="text"
              value={newCourseRating}
              onChange={(e) => setCourseRating(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="modal-button">Add Course</button>
        </form>
      </div>
    </div>
  </>
)}


{isNewClassModalOpen && (
  <>
  <div className="overlay" onClick={handleClassModalClose}> </div>
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={handleClassModalClose}>&times;</span>
        <form onSubmit={handleNewClassSubmit}>
          <label>
            New Class Name:
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="modal-button">Add Class</button>
        </form>
      </div>
    </div>
  </>
)}
    
</div>
</div>
  );
};

export default CreateClassroomPage;
