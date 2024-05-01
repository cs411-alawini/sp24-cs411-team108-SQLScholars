import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../css/FormStyle.css';

const EditClassGroupPage = () => {
  const [params] = useSearchParams();
  console.log(params);
  // const { classGroupId } = useParams();
  const classGroupId = params.get("classGroupId");
  // const crId = params.get("classroomId");
  const [classGroup, setClassGroup] = useState(null);
  const navigate = useNavigate();
  const userData = localStorage.getItem("userData")
  const parsedData = JSON.parse(userData);
  const uId = parsedData.userId;
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const classGroupId = params.get("classGroupId");
    // Fetch the details of the ClassroomGroup from the server
    // Here we assume the server has an endpoint to get details of a single ClassroomGroup
    fetch(`http://34.28.230.12/api/classroomgroup/getDetails?classGroupId=${classGroupId}&userId=${uId}`)
      .then(response => response.json())
      .then(data => setClassGroup(data.data.classroomGroup))
      .catch(error => console.error('Error fetching class group data:', error));
  }, [classGroupId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Reset the status message on new submission attempt
    setStatusMessage("");
  
    const updatedData = {
      classGroupId, 
      userId: uId,
      classStartTimings: classGroup.classStartTimings,
      classDuration: classGroup.classDuration,
      zoomLink: classGroup.zoomLink
    
    };
  
    try {
      const response = await fetch(`http://34.28.230.12/api/classroomgroup/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
  
      if (!response.ok) throw new Error('Failed to update class group');
  
      const result = await response.json();  // Assuming your API sends back some response data
      console.log('Update Success:', result);
      setStatusMessage("Update successful!");
      navigate('/homeAdmin');  // Navigate on successful update
    } catch (error) {
      console.error('Error updating class group:', error);
      setStatusMessage("Error updating class group.");  // Set error message
    }
  };
  
  

  if (!classGroup) {
    return <div>Loading...</div>;
  }

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit}>
      <h2>Edit Classroom Group</h2>
        <div className="info-section">
          <p><strong>Subject Name:</strong> {classGroup.subjectName}</p>
          <p><strong>Class Name:</strong> {classGroup.className}</p>
        </div>
        <label>
          Starts At:
          <input
            type="time"
            value={classGroup.classStartTimings}
            onChange={(e) => setClassGroup({ ...classGroup, classStartTimings: e.target.value })}
          />
        </label>
        <label>
          Duration (hours):
          <input
            type="number"
            step="0.1"
            value={classGroup.classDuration}
            onChange={(e) => setClassGroup({ ...classGroup, classDuration: e.target.value })}
          />
        </label>
        <label>
          Zoom Link:
          <input
            type="text"
            value={classGroup.zoomLink}
            onChange={(e) => setClassGroup({ ...classGroup, rating: e.target.value })}
          />
        </label>
        <button type="submit">Save Changes</button>
        {statusMessage && <p>{statusMessage}</p>} 
      </form>
    </div>
  );
};

export default EditClassGroupPage;
