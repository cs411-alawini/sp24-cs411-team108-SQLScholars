import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";

class ClassroomController{
    constructor(){};

    static async createClassroom(req, res, next){
        return apiResponse("Classroom created", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async getClassrooms(req, res, next){
        return apiResponse("Classrooms Fetched", RESPONSE.HTTP_OK, {}, res);
    }
    static async editClassroom(req, res, next){
        return apiResponse("Classroom Edited", RESPONSE.HTTP_OK, {}, res);
    }
}
export default ClassroomController;