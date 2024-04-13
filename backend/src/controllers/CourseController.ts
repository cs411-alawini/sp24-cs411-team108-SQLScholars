import RESPONSE from "../constants/ResponseConstants";
import { USER_TYPES } from "../constants/ServerConstants";
import { apiResponse } from "../helpers/ApiResponse";
import SQLHelper from "../helpers/SQLHelper";

class CourseController{
    constructor(){};

    static async createCourse(req, res, next){
        const userId = req.body.userId;
        const subjectName = req.body.subjectName;
        const courseRating = req.body.courseRating;
        const userSearchRespose: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userSearchRespose === null || userSearchRespose[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_FORBIDDEN, {}, res);
        }
        if(subjectName === undefined || courseRating === undefined){
            return apiResponse("Subject name and course rating are required", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user: any = userSearchRespose[0][0];
        if (user.userType !== USER_TYPES.admin) {
            return apiResponse("Only admins are allowed to create courses", RESPONSE.HTTP_FORBIDDEN, {user}, res);
        }
        const courseCountResponse = await SQLHelper.executeQuery(SQLHelper.getCourses(true));
        const courseCount = courseCountResponse[0][0].count;
        const courseId = `CID${courseCount.toString().padStart(5, '0')}`;
        const courseCreateResponse = await SQLHelper.executeQuery(SQLHelper.createCourseQuery(courseId, subjectName, courseRating));
        if(courseCreateResponse === null){
            return apiResponse("Course creation failed", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Course created", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async getCourses(req, res, next){
        const userId = req.query.userId;
        const limit = req.query.limit;
        const userSearchRespose: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userSearchRespose === null || userSearchRespose[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_FORBIDDEN, {}, res);
        }
        const user: any = userSearchRespose[0][0];
        if (user.userType !== USER_TYPES.admin) {
            return apiResponse("Only admins are allowed to fetch courses", RESPONSE.HTTP_FORBIDDEN, {user}, res);
        }
        const coursesResponse = await SQLHelper.executeQuery(SQLHelper.getCourses(false, limit)); 
        if(coursesResponse === null){
            return apiResponse("Courses fetch failed", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const courses = coursesResponse[0];
        return apiResponse("Courses Fetched", RESPONSE.HTTP_OK, {courses}, res);
    }

    static async editCourses(req, res, next){
        const userId = req.body.userId;
        const courseId = req.body.courseId;
        const subjectName = req.body.subjectName;
        const rating = req.body.rating;
        const userSearchRespose: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userSearchRespose === null || userSearchRespose[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_FORBIDDEN, {}, res);
        }
        if(subjectName === undefined || rating === undefined){
            return apiResponse("Subject name and course rating are required", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user: any = userSearchRespose[0][0];
        if (user.userType !== USER_TYPES.admin) {
            return apiResponse("Only admins are allowed to edit courses", RESPONSE.HTTP_FORBIDDEN, {user}, res);
        }
        const courseSearchResponse:any = await SQLHelper.executeQuery(SQLHelper.getCourseById(courseId));
        if(courseSearchResponse === null || courseSearchResponse[0].length === 0){
            return apiResponse("Course not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const courseEditResponse = await SQLHelper.executeQuery(SQLHelper.editCourseQuery(courseId, subjectName, rating));
        if(courseEditResponse === null){
            return apiResponse("Course edit failed", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }

        return apiResponse("Courses Edited", RESPONSE.HTTP_OK, {}, res);
    }
}
export default CourseController;