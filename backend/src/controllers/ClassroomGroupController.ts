import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";

class ClassroomGroupController{
    constructor(){};

    static async linkCourseToClassroom(req, res, next){
        return apiResponse("Course added in Classroom", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async editClassroomGroups(req, res, next){
        return apiResponse("ClassroomGroup Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async addStudentToClassroomGroup(req, res, next){
        return apiResponse("ClassroomGroup Student Added", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async removeStudentFromClassroomGroup(req, res, next){
        return apiResponse("ClassroomGroup Student Removed", RESPONSE.HTTP_OK, {}, res);
    }

    static async fetchAllClassroomGroupsForUser(req, res, next){
        return apiResponse("ClassroomGroups Fetched", RESPONSE.HTTP_OK, {}, res);
    }

    static async fetchClassroomGroupDetails(req, res, next){
        return apiResponse("ClassroomGroup Details Fetched", RESPONSE.HTTP_OK, {}, res);
    }


    static async addClassroomGroupRecordings(req, res, next){
        return apiResponse("ClassroomGroup Recording Added", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async editClassroomGroupRecordings(req, res, next){
        return apiResponse("ClassroomGroup Recording Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async deleteClassroomGroupRecordings(req, res, next){
        return apiResponse("ClassroomGroup Recording Deleted", RESPONSE.HTTP_OK, {}, res);
    }
}
export default ClassroomGroupController;