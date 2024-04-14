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

    static getClassroomUsersByClassGroupId(classroomId: String){
        return `SELECT * FROM ClassroomUsers where classGroupId = "${classroomId}";`;
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

    static getAllClassroomGroupsForAdmin(){
        return `SELECT * FROM ClassroomGroups NATURAL JOIN Classrooms NATURAL JOIN Courses order by createdAt DESC;`;
    }

    static getClassroomGroupsByClassroomIdAndCourseId(classroomId, courseId){
        return `SELECT * FROM ClassroomGroups where classroomId = "${classroomId}" AND courseId = "${courseId}";`;
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
}
export default SQLHelper;