import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import logo from "../img/illini_logo.png";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'; // Import necessary components
import { studentData } from './Data_temp.js';

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

const prepareGradeData = (grades) => {
    const subjects = [...new Set(grades.map(item => item.subjectName))];
    return subjects.map(subject => {
      const subjectData = grades.filter(item => item.subjectName === subject);
      const Tempgrades = subjectData.map(item => item.grade);
      return {
        label: subject,
        data: Tempgrades,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        maxBarThickness: 15
      };
    });
};

const prepareAttendanceData = (attendance) => {
    const presentDays = attendance.filter(item => item.isPresent === 1).length;
    const absentDays = attendance.filter(item => item.isPresent === 0).length;
    return {
      labels: ['Present', 'Absent'],
      datasets: [{
        label: 'Attendance',
        data: [presentDays, absentDays],
        backgroundColor: [
          'rgba(12, 198, 42, 1)',
          'rgba(180, 19, 48, 1)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    };
  };

const StudentCharts = ({ student }) => {
  const gradeData = {
    labels: student.assignmentGrades.map(item => item.assignmentId),
    datasets: prepareGradeData(student.assignmentGrades)
  };
  const attendanceData = prepareAttendanceData(student.attendance);

  return (
    <div style={{marginBottom: "20px", marginTop: "50px", fontWeight: "600"}}>
      <a>{student.userData.firstName} {student.userData.lastName}</a>
      <div className="charts-row">
        {gradeData && gradeData.datasets && gradeData.datasets.length > 0 && (
          <div className="chart-container">
            <Bar data={gradeData} options={{ scales: { y: { beginAtZero: true } } }} />
          </div>
        )}
        {attendanceData && attendanceData.datasets && attendanceData.datasets.length > 0 && (
          <div className="chart-container">
            <Pie data={attendanceData} />
          </div>
        )}
      </div>
    </div>
  );
};
const logoutUser = () => {
  localStorage.removeItem("userData");
  navigate("/");
};

const HomePageParent = () => {
    return (
        <div style={{textAlign: "center", fontSize: "20px"}}>
          <header className="app-header">
          <img
          src={logo}
          alt="Illini Logo"
          className="logo"
        />
          <span>Parent Dashboard</span>
            
            <div className="container">
              <button type="button" className="logout-button" onClick={logoutUser}>
                Logout
              </button>
            </div>
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
