// src/views/HomePageParent.js
import React, {useRef} from 'react';
import GradeGraph from '../components/GradeGraph';
import { studentData } from './Data_temp.js';  // Import the data

const HomePageParent = () => {
    // Assuming you want to show Anthropology grades for the first student
    const anthropologyGrades = studentData[0].assignmentGrades
        .filter(grade => grade.subjectName === 'Anthropology')
        .map(grade => ({
            assignmentId: grade.assignmentId,
            grade: grade.grade,
            maximumPossibleGrade: grade.maximumPossibleGrade
        }));

    return (
        <div>
            <h1>Parent Dashboard</h1>
            <GradeGraph studentGrades={anthropologyGrades} />
        </div>
    );
};

export default HomePageParent;
