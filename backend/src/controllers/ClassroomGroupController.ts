import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";

class ClassroomGroupController{
    constructor(){};

    static async linkCourseToClassroom(req, res, next){
        return apiResponse("Course added in Classroom", RESPONSE.HTTP_OK, {}, res);
    }

    static async fetchClassroomGroupsForUser(req, res, next){
        return apiResponse("ClassroomGroups Fetched", RESPONSE.HTTP_OK, {}, res);
    }

    static async editClassroomGroups(req, res, next){
        return apiResponse("ClassroomGroup Edited", RESPONSE.HTTP_OK, {}, res);
    }
}
export default ClassroomGroupController;