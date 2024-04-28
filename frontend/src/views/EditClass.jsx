import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditClassGroupPage = () => {
  const { classGroupId } = useParams();
  const [classGroup, setClassGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the details of the ClassroomGroup from the server
    // Here we assume the server has an endpoint to get details of a single ClassroomGroup
    fetch(`http://34.28.230.12/api/classroomgroup/${classGroupId}`)
      .then(response => response.json())
      .then(data => setClassGroup(data))
      .catch(error => console.error('Error fetching class group data:', error));
  }, [classGroupId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // ... code to send the updated classGroup to the server

    // After update, navigate back to the admin home page or display a success message
    navigate('/adminHome');
  };

  if (!classGroup) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Starts At:
        <input
          type="time"
          value={classGroup.startsAt}
          onChange={(e) => setClassGroup({ ...classGroup, startsAt: e.target.value })}
        />
      </label>
      <label>
        Duration (hours):
        <input
          type="number"
          step="0.01"
          value={classGroup.duration}
          onChange={(e) => setClassGroup({ ...classGroup, duration: e.target.value })}
        />
      </label>
      <label>
        Rating:
        <input
          type="number"
          step="0.01"
          value={classGroup.rating}
          onChange={(e) => setClassGroup({ ...classGroup, rating: e.target.value })}
        />
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
};
