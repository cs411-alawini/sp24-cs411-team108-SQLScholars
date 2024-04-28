import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/CreateClassroom.css";

const CreateClassroomPage = () => {
  const [newClassroom, setNewClassroom] = useState({
    subject: '',
    classId: '',
    startsAt: '',
    duration: '',
    rating: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your API call to create a new classroom here
    console.log(newClassroom);
    // After creation, you can redirect the user as needed
    navigate('/adminHome');
  };

  return (
    <div className="create-classroom-container">
      <form onSubmit={handleSubmit}>
        <label>
          Subject:
          <select
            value={newClassroom.subject}
            onChange={(e) => setNewClassroom({ ...newClassroom, subject: e.target.value })}
            required
          >
            <option value="">Select a subject</option>
            {/* Add your subjects here */}
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            {/* ... other options ... */}
          </select>
        </label>
        <label>
          Class:
          <select
            value={newClassroom.classId}
            onChange={(e) => setNewClassroom({ ...newClassroom, classId: e.target.value })}
            required
          >
            <option value="">Select a class</option>
            {/* Add your classes here */}
            <option value="1-A">1-A</option>
            <option value="2-B">2-B</option>
            <option value="3-C">3-C</option>
            {/* ... other options ... */}
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
          Rating:
          <input
            type="number"
            step="0.01"
            value={newClassroom.rating}
            onChange={(e) => setNewClassroom({ ...newClassroom, rating: e.target.value })}
            required
          />
        </label>
        <button type="submit">Create Classroom</button>
      </form>
    </div>
  );
};

export default CreateClassroomPage;
