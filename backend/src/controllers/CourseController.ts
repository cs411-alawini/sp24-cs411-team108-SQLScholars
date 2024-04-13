import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";

class CourseController{
    constructor(){};

    static async createCourse(req, res, next){
        return apiResponse("Course created", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async getCourses(req, res, next){
        return apiResponse("Courses Fetched", RESPONSE.HTTP_OK, {}, res);
    }

    static async editCourses(req, res, next){
        return apiResponse("Courses Edited", RESPONSE.HTTP_OK, {}, res);
    }
}
export default CourseController;