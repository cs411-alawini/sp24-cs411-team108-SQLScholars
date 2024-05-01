import RESPONSE from "../constants/ResponseConstants";
import { USER_TYPES } from "../constants/ServerConstants";
import { apiResponse } from "../helpers/ApiResponse";
import FetchSentiment from "../helpers/FetchSentiment";
import SQLHelper from "../helpers/SQLHelper";

class AssignmentController{
    constructor(){};

    static async createGroupAssignment(req, res, next){
        const userId = req.body.userId;
        const classGroupId = req.body.classGroupId;
        const googleFormLink = req.body.googleFormLink;
        const maximumGrade = req.body.maximumGrade;

        const userResponse = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user = userResponse[0][0];
        if (user.userType !== USER_TYPES.teacher) {
            return apiResponse("Only teachers can create assignments", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const classGroupResponse = await SQLHelper.executeQuery(SQLHelper.getClassroomGroupById(classGroupId));
        if (classGroupResponse === null) {
            return apiResponse("Class group not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const classGroup = classGroupResponse[0][0];
        const assignmentResponse = await SQLHelper.executeQuery(SQLHelper.getAllAssignmentsCount());
        if (assignmentResponse === null) {
            return apiResponse("Error in fetching assignments", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const latestAssignmentId = assignmentResponse[0][0].latestAssignmentId;
        const assignmentCount =  parseInt(latestAssignmentId.slice(3)) + 1;
        const assignmentId = `AID${(assignmentCount).toString().padStart(5, '0')}`;
        const createAssignmentResponse = await SQLHelper.executeQuery(SQLHelper.createAssignment(assignmentId, classGroupId, classGroup.classroomId, classGroup.courseId, googleFormLink, maximumGrade));
        if (createAssignmentResponse === null) {
            return apiResponse("Error in creating assignment", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Assignment created", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async deleteGroupAssignment(req, res, next){
        const userId = req.body.userId;
        const assignmentId = req.body.assignmentId;
        const userResponse = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user = userResponse[0][0];
        if (user.userType !== USER_TYPES.teacher) {
            return apiResponse("Only teachers can delete assignments", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignmentResponse: any = await SQLHelper.executeQuery(SQLHelper.getAssignmentById(assignmentId));
        if (assignmentResponse === null || assignmentResponse[0].length === 0) {
            return apiResponse("Assignment not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignment = assignmentResponse[0][0];
        const deleteAssignmentResponse: any = await SQLHelper.executeQuery(SQLHelper.deleteAssignment(assignmentId));
        if (deleteAssignmentResponse === null) {
            return apiResponse("Error in deleting assignment", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Assignment deleted", RESPONSE.HTTP_OK, {}, res);
    }

    static async editGroupAssignment(req, res, next){
        const userId = req.body.userId;
        const assignmentId = req.body.assignmentId;
        const googleFormLink = req.body.googleFormLink;
        const maximumGrade = req.body.maximumGrade;
        const userResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null || userResponse[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user = userResponse[0][0];
        if (user.userType !== USER_TYPES.teacher) {
            return apiResponse("Only teachers can edit assignments", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignmentResponse: any = await SQLHelper.executeQuery(SQLHelper.getAssignmentById(assignmentId));
        if (assignmentResponse === null || assignmentResponse[0].length === 0) {
            return apiResponse("Assignment not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignment = assignmentResponse[0][0];
        const updateFields: any = {};
        if (googleFormLink !== undefined) {
            updateFields.googleFormLink = googleFormLink;
        }
        if (maximumGrade !== undefined) {
            updateFields.maximumGrade = maximumGrade;
        }
        const editAssignmentResponse: any = await SQLHelper.executeQuery(SQLHelper.editAssignment(assignmentId, updateFields));
        if (editAssignmentResponse === null || editAssignmentResponse[0].affectedRows === 0) {
            return apiResponse("Error in editing assignment", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Assignment edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async addAssignmentGrade(req, res, next){
        const userId = req.body.userId;
        const assignmentId = req.body.assignmentId;
        const grade = req.body.grade;
        const remarks = req.body.remarks;
        const isNotificationSent = false;
        const userResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null || userResponse[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignmentResponse: any = await SQLHelper.executeQuery(SQLHelper.getAssignmentById(assignmentId));
        if (assignmentResponse === null || assignmentResponse[0].length === 0) {
            return apiResponse("Assignment not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignment = assignmentResponse[0][0];
        const assignmentGradeResponse: any = await SQLHelper.executeQuery(SQLHelper.getAssignmentGradeByAssignmentIdAndUserId(assignmentId, userId));
        if (assignmentGradeResponse === null) {
            return apiResponse("Error in fetching assignment grade", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        if (assignmentGradeResponse[0].length !== 0) {
            return apiResponse("Grade already added", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }

        //Check sentimentScore using sentiment analysis
        let sentimentScore;
        try{
            const response: any= await FetchSentiment.fetchSentiment(remarks)
            if(response.prediction === undefined){
                sentimentScore = 1;
            } else {
                sentimentScore = response.prediction;
            }
        } catch (error){
            sentimentScore = 1;
        }
        
        const assignmentCreateResponse = await SQLHelper.executeQuery(SQLHelper.createAssignmentGrade(assignmentId, userId, assignment.classGroupId, assignment.classroomId, assignment.courseId, grade, remarks, sentimentScore, isNotificationSent));
        if (assignmentCreateResponse === null) {
            return apiResponse("Error in grading assignment", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }

        return apiResponse("Assignment Graded", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async editAssignmentGrade(req, res, next){
        const assignmentId = req.body.assignmentId;
        const userId = req.body.userId;
        const remarks = req.body.remarks;
        const userResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if (userResponse === null || userResponse[0].length === 0) {
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignmentResponse: any = await SQLHelper.executeQuery(SQLHelper.getAssignmentById(assignmentId));
        if (assignmentResponse === null || assignmentResponse[0].length === 0) {
            return apiResponse("Assignment not found", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        let sentimentScore;
        try{
            const response: any= await FetchSentiment.fetchSentiment(remarks)
            if(response.prediction === undefined){
                sentimentScore = 1;
            } else {
                sentimentScore = response.prediction;
            }
        } catch (error){
            sentimentScore = 1;
        }
        const assignment = assignmentResponse[0][0];
        const editAssignmentGradeResponse: any = await SQLHelper.executeQuery(SQLHelper.editAssignmentGrade(assignmentId, userId, assignment.classGroupId, assignment.classroomId, assignment.courseId, req.body.grade,remarks, sentimentScore));
        if (editAssignmentGradeResponse === null) {
            return apiResponse("Error in editing assignment grade", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        return apiResponse("Assignment Grade Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async fetchGroupAssignment(req, res, next){
        const classGroupId = req.query.classGroupId;
        const userId = req.query.userId;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse('User not found', RESPONSE.HTTP_BAD_REQUEST, {userId}, res);
        }
        const user = userResponse[0][0];
        const assignmentsResponse: any = await SQLHelper.executeQuery(SQLHelper.getAssignmentsByClassGroupId(classGroupId));
        if (assignmentsResponse === null) {
            return apiResponse("Error in fetching assignments", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignments = assignmentsResponse[0];
        if(user.userType === USER_TYPES.student){
            for(let i=0; i<assignments.length ;i++){
                const assignmentGradesResponse: any= await SQLHelper.executeQuery(SQLHelper.getAssignmentGradeByAssignmentIdAndUserId(assignments[i].assignmentId, user.userId));
                if(assignmentGradesResponse === null || assignmentGradesResponse[0].length === 0){

                } else {
                    console.log(assignmentGradesResponse[0][0].grade);
                    assignments[i].userGrade = assignmentGradesResponse[0][0].grade;
                }
            }
        }
        return apiResponse("Assignments Fetched", RESPONSE.HTTP_OK, {assignments}, res);
    }

    static async fetchAssignmentGrades(req, res, next){
        const assignmentId = req.query.assignmentId;
        const userId = req.query.userId;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse('User not found', RESPONSE.HTTP_BAD_REQUEST, {userId}, res);
        }
        const user = userResponse[0][0];
        let assignmentGradesResponse: any;
        if(user.userType === USER_TYPES.student){
            assignmentGradesResponse= await SQLHelper.executeQuery(SQLHelper.getAssignmentGradeByAssignmentIdAndUserId(assignmentId, userId));
        } else {
            assignmentGradesResponse= await SQLHelper.executeQuery(SQLHelper.getAssignmentGradesByAssignmentId(assignmentId));
        }
        if (assignmentGradesResponse === null) {
            return apiResponse("Error in fetching assignment grades", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const assignmentGrades = assignmentGradesResponse[0];
        return apiResponse("Assignment Grades Fetched", RESPONSE.HTTP_OK, {assignmentGrades}, res);
    }
}
export default AssignmentController;