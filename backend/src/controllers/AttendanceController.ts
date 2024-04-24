import RESPONSE from "../constants/ResponseConstants";
import { USER_TYPES } from "../constants/ServerConstants";
import { apiResponse } from "../helpers/ApiResponse";
import SQLHelper from "../helpers/SQLHelper";

class AttendanceController{
    constructor(){};

    static async addAttendanceForClassroom(req, res, next){
        const userId = req.body.userId;
        const classroomId = req.body.classroomId;
        const isPresent = req.body.isPresent;
        const attendanceDate = req.body.attendanceDate;
        const isParentsNotified = false;

        const userResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null || userResponse[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user = userResponse[0][0];
        const classroomResponse: any = await SQLHelper.executeQuery(SQLHelper.getClassroomById(classroomId));
        if (classroomResponse === null || classroomResponse[0].length === 0) {
            return apiResponse("Classroom not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const createAttendance = await SQLHelper.executeQuery(SQLHelper.createAttendance(userId, classroomId, isPresent, attendanceDate, isParentsNotified));
        if (createAttendance === null) {
            return apiResponse("Error in creating attendance", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Attendance Marked", RESPONSE.HTTP_CREATED, {}, res);

    }

    static async editAttendanceForClassroom(req, res, next){
        const userId = req.body.userId;
        const classroomId = req.body.classroomId;
        const attendanceDate = req.body.attendanceDate;
        const isPresent = req.body.isPresent;
        
        const userResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null || userResponse[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user = userResponse[0][0];
        const classroomResponse: any = await SQLHelper.executeQuery(SQLHelper.getClassroomById(classroomId));
        if (classroomResponse === null || classroomResponse[0].length === 0) {
            return apiResponse("Classroom not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        if(isPresent === undefined){
            return apiResponse("Please provide atleast isPresent attribute", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const editAttendance = await SQLHelper.executeQuery(SQLHelper.editAttendance(userId, classroomId, attendanceDate, isPresent));
        if (editAttendance === null) {
            return apiResponse("Error in editing attendance", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Attendance Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async getAttendanceForClassroom(req, res, next){
        const classroomId = req.query.classroomId;
        const userId = req.query.userId;
        const userResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null || userResponse[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user = userResponse[0][0];
        var attendanceResponse: any;
        var studentsBelowThreshold: any;
        if(user.userType === USER_TYPES.student){
            attendanceResponse = await SQLHelper.executeQuery(SQLHelper.getAttendanceForClassroomAndUser(classroomId, userId));
        } else if(user.userType === USER_TYPES.teacher){
            attendanceResponse = await SQLHelper.executeQuery(SQLHelper.getAttendanceForClassroom(classroomId));
        } else if(user.userType === USER_TYPES.admin){
            attendanceResponse = await SQLHelper.executeQuery(SQLHelper.getAttendanceForClassroom(classroomId));
            studentsBelowThreshold = await SQLHelper.executeQuery(SQLHelper.getStudentsWithLowThresholdAttendance(classroomId));
        } else {
            return apiResponse("UserType not supported", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        if (attendanceResponse === null) {
            return apiResponse("Error in fetching attendance", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        if(attendanceResponse[0].length === 0){
            return apiResponse("No attendance details found", RESPONSE.HTTP_OK, {}, res);
        }
        const attendance = attendanceResponse[0];
        const lowAttendanceStudents = studentsBelowThreshold[0];
        return apiResponse("Attendance Details for Classroom", RESPONSE.HTTP_OK, {attendance, lowAttendanceStudents}, res);
    }

    
}
export default AttendanceController;