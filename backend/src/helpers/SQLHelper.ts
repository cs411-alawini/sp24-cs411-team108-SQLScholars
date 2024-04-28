import { sqlPool } from "../index";

class SQLHelper{
    constructor(){};

    static async executeQuery(query: string){
        try{
            console.log("Query to be executed", query);
            const response = await sqlPool.query(query);
            return response;
        } catch(error){
            console.log("Error in query execution", error);
            return null;
        }
        
    }
    static emailCheckQuery(email: String){
        return `SELECT * FROM Users where email='${email}';`;
    }

    static getClassroomGroupsByClassroomId(classroomId: String){
        return `SELECT * FROM ClassroomGroups where classroomId = "${classroomId}";`;
    }

    static getClassroomIdByUserId(userId: String, LIMIT: number = -1){
        if (LIMIT === -1) {
            return `SELECT classroomId FROM ClassroomUsers where userId = "${userId}";`;
        } else {
            return `SELECT classroomId FROM ClassroomUsers where userId = "${userId}" LIMIT ${LIMIT};`;
        }
    }

    static getClassroomGroupById(classroomId){
        return `SELECT * FROM ClassroomGroups where classGroupId = "${classroomId}";`;
    }
    static getAllAssignments(){
        return `SELECT * FROM Assignment;`;
    }

    static getClassroomUsersByClassGroupId(classGroupId: String){
        return `SELECT * FROM ClassroomUsers where classGroupId = "${classGroupId}";`;
    }

    static createUserQuery(userId, firstName, lastName, email, password, userType, address, dob){
        return `INSERT INTO Users(userId, firstName, lastName, email, password, userType, address, dob) VALUES("${userId}", "${firstName}", "${lastName}", "${email}", "${password}", "${userType}", "${address}", "${dob}");`;
    
    }
    static getStudentCount(userType){
        return `SELECT COUNT(*) as count FROM Users where userType = "${userType}";`;
    }
    static getUserById(userId){
        return `SELECT * FROM Users where userId = "${userId}";`;
    }
    static editUserQuery(userId, updateFields){
        let updateFieldsString = "";
        for (const key in updateFields) {
            updateFieldsString += `${key} = "${updateFields[key]}", `;
        }
        updateFieldsString = updateFieldsString.slice(0, -2); // Remove the last comma
        return `UPDATE Users SET ${updateFieldsString} WHERE userId = "${userId}";`;
    }
    static searchUserQuery(searchString, userType){
        return `SELECT * FROM Users where (firstName LIKE "%${searchString}%" OR lastName LIKE "%${searchString}%" OR email LIKE "%${searchString}%") AND userType = ${userType};`;
    }
    
    static getClassrooms(count: boolean, LIMIT: number = 1){
        if(count){
            return `SELECT COUNT(*) as count FROM Classrooms;`;
        }
        return `SELECT * FROM Classrooms LIMIT ${LIMIT};`;
    }
    static createClassroomQuery(classroomId, className, createdAt){
        return `INSERT INTO Classrooms(classroomId, className, createdAt) VALUES("${classroomId}", "${className}", "${createdAt}");`;
    }
    static getClassroomById(classroomId){
        return `SELECT * FROM Classrooms where classroomId = "${classroomId}";`;
    }

    static editClassroomQuery(classroomId, className){
        return `UPDATE Classrooms SET className="${className}" WHERE classroomId = "${classroomId}";`;
    }

    static getCourses(count: boolean, LIMIT: number = 1){
        if(count){
            return `SELECT COUNT(*) as count FROM Courses;`;
        }
        return `SELECT * FROM Courses LIMIT ${LIMIT};`;
    }
    static createCourseQuery(courseId, subjectName, rating){
        return `INSERT INTO Courses(courseId, subjectName, rating) VALUES("${courseId}", "${subjectName}", ${rating});`;
    }
    static getCourseById(courseId){
        return `SELECT * FROM Courses where courseId = "${courseId}";`;
    }
    static editCourseQuery(courseId, subjectName, rating){
        return `UPDATE Courses SET subjectName="${subjectName}", rating=${rating} WHERE courseId = "${courseId}";`;
    }

    static getClassroomGroupsForStudent(userId){
        return `SELECT * FROM ClassroomUsers NATURAL JOIN ClassroomGroups NATURAL JOIN Classrooms NATURAL JOIN Courses where userId = "${userId}" order by userJoinedAt DESC;`;
    }

    static getClassroomGroupUsersByClassGroupId(classGroupId){
        return `SELECT * FROM ClassroomUsers NATURAL JOIN Users where classGroupId = "${classGroupId}";`;
    }

    static getClassroomGroupUsersForAdminsWithStarStudent(classGroupId){
        return `select DISTINCT g.classGroupId, g.userId from Grades g JOIN Assignment a on g.assignmentId = a.assignmentId and g.userId IN (select a.studentId from Attendance a group by classroomId, studentId having sum(a.isPresent) >=(select avg(totalAttendance) from (select classroomId, studentId, sum(isPresent) as totalAttendance from Attendance as a1 group by classroomId, studentId) as maxAttendance where maxAttendance.classroomId = a.classroomId) order by a.classroomId) group by g.classGroupId, g.userId having avg(g.grade/a.maximumGrade*100)>=(select avg(g1.grade/a1.maximumGrade*100) from Grades g1 JOIN Assignment a1 on g1.assignmentId = a1.assignmentId where g1.classGroupId = g.classGroupId) and g.classGroupId="${classGroupId}" order by g.classGroupId;`
    }
    static getBelowAverageStudentsForClassroomGroup(classroomId, classGroupId){
        return `CALL FetchBelowAverageUsersOfClassroomAndClassGroup("${classroomId}", "${classGroupId}", 60);`;
    }
    static getClassroomGroupsForParentsChild(userId){
        return `select co.subjectName as subjectName, cr.className as className, cg.classGroupId as classGroupId, a.assignmentId as assignmentId, g.grade as grade, maxGrade.topperGrade as topperGrade, a.maximumGrade as maximumPossibleGrade from ClassroomUsers cu NATURAL JOIN ClassroomGroups cg NATURAL JOIN Courses co NATURAL JOIN Classrooms cr NATURAL JOIN Assignment a NATURAL JOIN Grades g JOIN (select assignmentId, max(grade) as topperGrade from Grades group by assignmentId) as maxGrade ON g.assignmentId = maxGrade.assignmentId where cu.userId="${userId}";`;
    }
    
    static getAttendanceForStudent(userId){
        return `SELECT * FROM Attendance where studentId = "${userId}";`;
    }
    static getAllClassroomGroupsForAdmin(){
        return `SELECT * FROM ClassroomGroups NATURAL JOIN Classrooms NATURAL JOIN Courses order by createdAt DESC;`;
    }
    static getClassroomGroupToppers(){
        return `select g.classGroupId, u.userId as topperUserId, u.firstName AS topperFirstName, u.lastName AS topperLastName, Round(max(g.grade/a.maximumGrade*100), 2) as topperAverage from Assignment a NATURAL JOIN Grades g NATURAL JOIN Users u group by g.classGroupId, u.userId having (g.classGroupId, topperAverage) IN (select g.classGroupId, Round(max(g.grade/a.maximumGrade*100), 2) as topperAverage from Assignment a JOIN Grades g on a.assignmentId=g.assignmentId group by g.classGroupId) order by g.classGroupId;`;
    }
    static getClassroomGroupsByClassroomIdAndCourseId(classroomId, courseId){
        return `SELECT * FROM ClassroomGroups where classroomId = "${classroomId}" AND courseId = "${courseId}";`;
    }

    static getClassroomGroupsByClassgroupId(classGroupId){
        return `SELECT * FROM ClassroomGroups NATURAL JOIN Classrooms NATURAL JOIN Courses where classGroupId = "${classGroupId}";`;
    }
    static getClassroomGroupCount(){
        return `SELECT COUNT(*) as count FROM ClassroomGroups;`;
    }
    static createClassroomGroup(classGroupId, classroomId, courseId, zoomLink, classStartTimings, classDuration){
        return `INSERT INTO ClassroomGroups(classGroupId, classroomId, courseId, zoomLink, classStartTimings, classDuration) VALUES("${classGroupId}", "${classroomId}", "${courseId}", "${zoomLink}", "${classStartTimings}", "${classDuration}");`;
    }
    static editClassroomGroup(classGroupId, updateFields){
        let updateFieldsString = "";
        for (const key in updateFields) {
            updateFieldsString += `${key} = "${updateFields[key]}", `;
        }
        updateFieldsString = updateFieldsString.slice(0, -2); // Remove the last comma
        return `UPDATE ClassroomGroups SET ${updateFieldsString} WHERE classGroupId = "${classGroupId}";`;
    }
    static checkIfClassroomGroupExistsForUserId(userId, classGroupId){
        return `SELECT * FROM ClassroomUsers where userId = "${userId}" AND classGroupId = "${classGroupId}";`;
    }
    static joinClassroomGroup(userId, classGroupId, classroomId, courseId, userJoinedAt){
        return `INSERT INTO ClassroomUsers(userId, classGroupId, classroomId, courseId, userJoinedAt) VALUES("${userId}", "${classGroupId}", "${classroomId}", "${courseId}", "${userJoinedAt}");`;
    }
    static getClassroomGroupRecordingCount(classGroupId){
        return `SELECT COUNT(*) as count FROM ClassGroupRecordings where classGroupId = "${classGroupId}";`;
    }
    static addClassroomGroupRecording(recordingId, classGroupId, classroomId, courseId, classDate, recordingLink){
        return `INSERT INTO ClassGroupRecordings(recordingId, classGroupId, classroomId, courseId, classDate, recordingLink) VALUES("${recordingId}", "${classGroupId}", "${classroomId}", "${courseId}", "${classDate}", "${recordingLink}");`;
    }
    static getClassroomGroupRecordingById(recordingId){
        return `SELECT * FROM ClassGroupRecordings where recordingId = "${recordingId}";`;
    }
    static editClassroomGroupRecording(recordingId, updateFields){
        let updateFieldsString = "";
        for (const key in updateFields) {
            updateFieldsString += `${key} = "${updateFields[key]}", `;
        }
        updateFieldsString = updateFieldsString.slice(0, -2); // Remove the last comma
        return `UPDATE ClassGroupRecordings SET ${updateFieldsString} WHERE recordingId = "${recordingId}";`;
    }
    static deleteClassroomGroupRecording(recordingId){
        return `DELETE FROM ClassGroupRecordings WHERE recordingId = "${recordingId}";`;
    }
    static leaveClassroomGroup(userId, classGroupId){
        return `DELETE FROM ClassroomUsers WHERE userId = "${userId}" AND classGroupId = "${classGroupId}";`;
    }
    static getClassroomGroupRecordingsByClassgroupId(classGroupId){
        return `SELECT * FROM ClassGroupRecordings where classGroupId = "${classGroupId}";`;
    }
    static createAssignment(assignmentId, classGroupId, classroomId, courseId, googleFormLink, maximumGrade){
        return `INSERT INTO Assignment(assignmentId, classGroupId, classroomId, courseId, googleFormLink, maximumGrade) VALUES("${assignmentId}", "${classGroupId}", "${classroomId}", "${courseId}", "${googleFormLink}", ${maximumGrade});`;
    }
    static getAllAssignmentsCount(){
        return `SELECT assignmentId as latestAssignmentId FROM Assignment order by assignmentId DESC LIMIT 1;`;
    }
    static getAssignmentById(assignmentId){
        return `SELECT * FROM Assignment where assignmentId = "${assignmentId}";`;
    }
    static getAssignmentsByClassGroupId(classGroupId){
        return `select a.assignmentId as assignmentId, a.googleFormLink, Round(AVG(g.grade), 2) as averageGrade, max(g.grade) as maxStudentScore, a.maximumGrade as maxPossibleGrade from Assignment a LEFT JOIN Grades g ON a.assignmentId = g.assignmentId where a.classGroupId = '${classGroupId}' GROUP BY a.assignmentId, a.maximumGrade, a.googleFormLink;`;
    }
    static deleteAssignment(assignmentId){
        return `CALL DeleteAssignmentAndGrades("${assignmentId}");`;
    }
    static editAssignment(assignmentId, updateFields){
        let updateFieldsString = "";
        for (const key in updateFields) {
            updateFieldsString += `${key} = "${updateFields[key]}", `;
        }
        updateFieldsString = updateFieldsString.slice(0, -2); // Remove the last comma
        return `UPDATE Assignment SET ${updateFieldsString} WHERE assignmentId = "${assignmentId}";`;
    }
    static getAssignmentGradeByAssignmentIdAndUserId(assignmentId, userId){
        return `SELECT * FROM Grades where assignmentId = "${assignmentId}" AND userId = "${userId}";`;
    }
    static getAssignmentGradesByAssignmentId(assignmentId){
        return `SELECT * FROM Grades where assignmentId = "${assignmentId}";`;

    }
    static createAssignmentGrade(assignmentId, userId, classGroupId, classroomId, courseId, grade, remarks, sentimentScore, isNotificationSent){
        return `INSERT INTO Grades(assignmentId, userId, classGroupId, classroomId, courseId, grade, remarks, sentimentScore, isNotificationSent) VALUES("${assignmentId}", "${userId}", "${classGroupId}", "${classroomId}", "${courseId}", ${grade}, "${remarks}", ${sentimentScore}, ${isNotificationSent});`;
    }
    static editAssignmentGrade(assignmentId, userId, classGroupId, classroomId, courseId, grade, remarks){
        return `UPDATE Grades SET grade=${grade}, remarks="${remarks}" WHERE assignmentId = "${assignmentId}" AND userId = "${userId}" AND classGroupId = "${classGroupId}" AND classroomId = "${classroomId}" AND courseId = "${courseId}";`;
    }
    static createAttendance(userId, classroomId, isPresent, attendanceDate, isParentsNotified){
        return `INSERT INTO Attendance(studentId, classroomId, isPresent, attendanceDate, isParentsNotified) VALUES("${userId}", "${classroomId}", ${isPresent}, "${attendanceDate}", ${isParentsNotified});`;
    }
    static getAttendanceForClassroom(classroomId){
        return `SELECT * FROM Attendance, Users where studentId=userId AND classroomId = "${classroomId}" order by attendanceDate DESC;`;
    }

    static getStudentsWithLowThresholdAttendance(classroomId, threshold = 60){
        return `CALL FetchUsersWithLowAttendance("${classroomId}", ${threshold});`;
    }
    static getAttendanceForClassroomAndUser(classroomId, userId){
        return `SELECT * FROM Attendance, Users where studentId=userId AND classroomId = "${classroomId}" AND studentId = "${userId}";`;
    }
    static editAttendance(userId, classroomId, attendanceDate, isPresent){
        return `UPDATE Attendance SET isPresent=${isPresent} WHERE studentId = "${userId}" AND classroomId = "${classroomId}" AND attendanceDate = "${attendanceDate}";`;
    }
    static getStudentsWithIsParentNotifiedFalse(){
        return `SELECT * FROM Attendance where isParentsNotified = false;`;
    }
    static getParentsByStudentId(studentId){
        return `SELECT * FROM Users where studentIds LIKE "%${studentId}%";`;
    }
    static updateAttendanceAfterNotification(studentId, attendanceDate){
        return `UPDATE Attendance SET isParentsNotified = true WHERE studentId = "${studentId}" AND attendanceDate = "${attendanceDate}";`;
    }
    static getUsersGradeNotification(){
        return `SELECT * FROM Grades where isNotificationSent = false;`;
    }
    static updateGradeNotification(userId, assignmentId){
        return `UPDATE Grades SET isNotificationSent = true WHERE userId = "${userId}" AND assignmentId = "${assignmentId}";`;
    }
    static deleteClassroomGroup(classGroupId, classroomId, courseId){
        return `CALL DeleteClassroomGroup("${classGroupId}", "${classroomId}", "${courseId}");`;
    }
    
}
export default SQLHelper;