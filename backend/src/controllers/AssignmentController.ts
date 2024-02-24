import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";

class AssignmentController{
    constructor(){};

    static async createGroupAssignment(req, res, next){
        return apiResponse("Assignment created", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async deleteGroupAssignment(req, res, next){
        return apiResponse("Assignment deleted", RESPONSE.HTTP_OK, {}, res);
    }

    static async editGroupAssignment(req, res, next){
        return apiResponse("Assignment edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async addAssignmentGrade(req, res, next){
        return apiResponse("Assignment Graded", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async editAssignmentGrade(req, res, next){
        return apiResponse("Assignment Grade Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async fetchGroupAssignment(req, res, next){
        return apiResponse("Assignments Fetched", RESPONSE.HTTP_OK, {}, res);
    }
}
export default AssignmentController;