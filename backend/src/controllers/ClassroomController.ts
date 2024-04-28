import RESPONSE from "../constants/ResponseConstants";
import { USER_TYPES } from "../constants/ServerConstants";
import { apiResponse } from "../helpers/ApiResponse";
import SQLHelper from "../helpers/SQLHelper";

class ClassroomController{
    constructor(){};

    static async createClassroom(req, res, next){
        const className = req.body.className;
        const userId = req.body.userId;
        const userSearchRespose: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userSearchRespose === null || userSearchRespose[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_FORBIDDEN, {}, res);
        }
        const user: any = userSearchRespose[0][0];
        console.log(userSearchRespose);
        if (user.userType !== USER_TYPES.admin) {
            return apiResponse("Only admins are allowed to create classrooms", RESPONSE.HTTP_FORBIDDEN, {user}, res);
        }
        const classroomCountResponse = await SQLHelper.executeQuery(SQLHelper.getClassrooms(true));
        console.log(classroomCountResponse[0][0].count);
        const classroomCount = classroomCountResponse[0][0].count;
        const classroomId = `CLID${classroomCount.toString().padStart(5, '0')}`;
        
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');;
        const response = await SQLHelper.executeQuery(SQLHelper.createClassroomQuery(classroomId, className, createdAt));
        if (response === null) {
            return apiResponse("Error creating classroom", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const classroomResponse = await SQLHelper.executeQuery(SQLHelper.getClassroomById(classroomId));
        const classroom = classroomResponse[0][0];
        return apiResponse("Classroom created", RESPONSE.HTTP_CREATED, {classroom}, res);
    }

    static async getClassrooms(req, res, next){
        const userId = req.query.userId;
        const limit = req.query.limit;
        const userSearchRespose: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userSearchRespose === null || userSearchRespose[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_FORBIDDEN, {}, res);
        }
        const user: any = userSearchRespose[0][0];
        if(user.userType !== USER_TYPES.admin){
            return apiResponse("Only admins are allowed to fetch classrooms", RESPONSE.HTTP_FORBIDDEN, {user}, res);
        }
        const classroomsResponse = await SQLHelper.executeQuery(SQLHelper.getClassrooms(false, limit));
        const classrooms = classroomsResponse[0];
        return apiResponse("Classrooms Fetched", RESPONSE.HTTP_OK, {classrooms}, res);
    }
    static async editClassroom(req, res, next){
        const userId = req.body.userId;
        const classroomId = req.body.classroomId;
        const className = req.body.className;

        if(className === undefined || className === "" || classroomId === undefined || classroomId === ""){
            return apiResponse("Classroom name or classroomId cannot be empty", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const userSearchRespose: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userSearchRespose === null || userSearchRespose[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_FORBIDDEN, {}, res);
        }
        const user: any = userSearchRespose[0][0];
        if(user.userType !== USER_TYPES.admin){
            return apiResponse("Only admins are allowed to edit classrooms", RESPONSE.HTTP_FORBIDDEN, {user}, res);
        }
        const classroomResponse: any = await SQLHelper.executeQuery(SQLHelper.getClassroomById(classroomId));
        if (classroomResponse === null || classroomResponse[0].length === 0) {
            return apiResponse("Classroom not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const response: any = await SQLHelper.executeQuery(SQLHelper.editClassroomQuery(classroomId, className));
        if(response === null || response[0].affectedRows === 0){
            return apiResponse("Error editing classroom", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Classroom Edited Successfully", RESPONSE.HTTP_OK, {}, res);
    }
}
export default ClassroomController;