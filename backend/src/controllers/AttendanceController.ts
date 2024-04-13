import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";

class AttendanceController{
    constructor(){};

    static async addAttendanceForClassroom(req, res, next){
        return apiResponse("Attendance Marked", RESPONSE.HTTP_CREATED, {}, res);

    }

    static async editAttendanceForClassroom(req, res, next){
        return apiResponse("Attendance Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async getAttendanceForClassroom(req, res, next){
        return apiResponse("Attendance Details for Classroom", RESPONSE.HTTP_OK, {}, res);
    }

    
}
export default AttendanceController;