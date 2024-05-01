import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import logo from "../img/illini_logo.png";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'; // Import necessary components
import { useNavigate } from 'react-router-dom';
import profilePic from "../img/profile.png";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const prepareChartData = (grades) => {
  if(grades.length === 0) {
    return {};
  }
  const labels = grades.map(item => item.assignmentId);
  const userGrades = grades.map(item => item.grade);
  const topperGrades = grades.map(item => item.topperGrade);

  return {
      labels,
      datasets: [
          {
              label: 'Student Grade',
              data: userGrades,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          },
          {
              label: 'Topper Grade',
              data: topperGrades,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          },
          {
              label: 'Maximum Possible Grade',
              data: grades.map(item => item.maximumPossibleGrade),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          }
      ]
  };
};

const prepareAttendanceData = (attendance) => {
    if(attendance.length === 0) {
      return {};
    }
    const presentDays = attendance.filter(item => item.userAttendance === 1).length;
    const absentDays = attendance.filter(item => item.userAttendance === 0).length;
    if(presentDays === 0 && absentDays === 0) {
      return {};
    }
    return {
      labels: ['Present', 'Absent'],
      datasets: [{
        label: 'Attendance',
        data: [presentDays, absentDays],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    };
  };

const StudentCharts = ({ student }) => {
  const gradeData =  prepareChartData(student.assignmentGrades)
  const attendanceData = prepareAttendanceData(student.attendance);
  return (
    <div style={{marginBottom: "20px", marginTop: "50px", fontWeight: "600"}}>
      <a>{student.userData.firstName} {student.userData.lastName}</a>
      <div className="charts-row">
        {gradeData && gradeData.datasets && gradeData.datasets.length > 0 ? (
          <div className="chart-container">
            <Bar data={gradeData} options={{ scales: { y: { beginAtZero: true } }, plugins: {legend: {display: true}} }} />
          </div>
        ) : <div className="chart-container" style={{marginTop: "120px"}}>No assignment data available</div>}
        {attendanceData && attendanceData.datasets && attendanceData.datasets.length > 0 ? (
          <div className="chart-container">
            <Pie data={attendanceData} />
          </div>
        ):  <div className="chart-container" style={{marginTop: "120px"}}>No attendance data available</div>}
      </div>
    </div>
  );
};


const HomePageParent = () => {
  const navigate = useNavigate();
  const logoutUser = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };
  const [studentData, setStudentData] = React.useState([]);
  const userData = localStorage.getItem("userData");
  if (!userData) {
    console.error("User data not found in local storage");
    return;
  }
  const fetchData = async () => {
    try{
      const response = await fetch(`http://34.28.230.12/api/classroomgroup/getStudentAnalytics?userId=${JSON.parse(userData).userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudentData(data.data);
    } catch (error) {
      console.error("Could not fetch student data:", error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  return (
      <div style={{textAlign: "center", fontSize: "20px"}}>
        <header className="app-header">
        <img
        src={logo}
        alt="Illini Logo"
        className="logo"
      />
        <span style={{fontWeight: "550"}}>Parent Dashboard</span>
          
          <div className="container" style={{marginLeft: "70%"}}>
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
          <div>
              {studentData.map(student => (
                  <StudentCharts key={student.userData.userId} student={student} />
              ))}
          </div>
      </div>
  );
};

export default HomePageParent;
