import { sqlPool } from "../index";

class SQLHelper{
    constructor(){};

    static async executeQuery(query: string){
        try{
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
}
export default SQLHelper;