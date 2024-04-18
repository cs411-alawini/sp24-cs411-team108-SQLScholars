import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";
import { USER_TYPES } from "../constants/ServerConstants";
import SQLHelper from "../helpers/SQLHelper";

class ClassroomGroupController{
    constructor(){};

    static async linkCourseToClassroom(req, res, next){
        const userId = req.body.userId;
        const classroomId = req.body.classroomId;
        const courseId = req.body.courseId;
        const zoomLink = req.body.zoomLink;
        const classStartTimings = req.body.classStartTimings;
        const classDuration = req.body.classDuration;

        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.admin){
            return apiResponse("Only admins are allowed to linked groups", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        const courseResponse: any = await SQLHelper.executeQuery(await SQLHelper.getCourseById(courseId));
        if(courseResponse === null || courseResponse[0].length === 0){
            return apiResponse("Course not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomById(classroomId));
        if(classroomResponse === null || classroomResponse[0].length === 0){
            return apiResponse("Classroom not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomGroupResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupsByClassroomIdAndCourseId(classroomId, courseId));
        if(classroomGroupResponse[0].length > 0){
            return apiResponse("ClassroomGroup already exists", RESPONSE.HTTP_NOT_FOUND, {classroomGroup: classroomGroupResponse[0][0]}, res);
        }
        const classGroupCountResponse = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupCount());
        const classGroupCount = classGroupCountResponse[0][0].count;
        const classGroupId = `CGID${classGroupCount.toString().padStart(5, '0')}`;
        if(zoomLink === null || zoomLink === "" || classStartTimings === null || classStartTimings === "" || classDuration === null || classDuration === ""){
            return apiResponse("Please provide all the required details", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const classroomGroupInsertResponse: any = await SQLHelper.executeQuery(await SQLHelper.createClassroomGroup(classGroupId, classroomId, courseId, zoomLink, classStartTimings, classDuration));
        if(classroomGroupInsertResponse === null){
            return apiResponse("Error in linking Course to Classroom", RESPONSE.HTTP_INTERNAL_SERVER_ERROR, {}, res);
        }

        return apiResponse("Course added in Classroom", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async editClassroomGroups(req, res, next){
        const userId = req.body.userId;
        const classGroupId = req.body.classGroupId;

        const zoomLink = req.body.zoomLink;
        const classStartTimings = req.body.classStartTimings;
        const classDuration = req.body.classDuration;

        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.admin){
            return apiResponse("Only admins are allowed to edit groups", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        const classroomGroupResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupById(classGroupId));
        if(classroomGroupResponse === null || classroomGroupResponse[0].length === 0){
            return apiResponse("ClassroomGroup not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const updateFields: any = {};
        if(zoomLink){
            updateFields.zoomLink = zoomLink;
        }
        if(classStartTimings){
            updateFields.classStartTimings = classStartTimings;
        }
        if(classDuration){
            updateFields.classDuration = classDuration;
        }
        const classroomGroupUpdateResponse: any = await SQLHelper.executeQuery(await SQLHelper.editClassroomGroup(classGroupId, updateFields));
        if(classroomGroupUpdateResponse === null){
            return apiResponse("Error in editing ClassroomGroup", RESPONSE.HTTP_INTERNAL_SERVER_ERROR, {}, res);
        }
        return apiResponse("ClassroomGroup Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async addStudentToClassroomGroup(req, res, next){
        const userId = req.body.userId;
        const classGroupId = req.body.classGroupId;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.student){
            return apiResponse("Only students are allowed to join groups", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        const classroomGroupResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupById(classGroupId));
        if(classroomGroupResponse === null || classroomGroupResponse[0].length === 0){
            return apiResponse("ClassroomGroup not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomGroup = classroomGroupResponse[0][0];
        const classroomGroupCheckResponse: any = await SQLHelper.executeQuery(await SQLHelper.checkIfClassroomGroupExistsForUserId(userId, classGroupId));
        if(classroomGroupCheckResponse[0].length > 0){
            return apiResponse("Student already present in the ClassroomGroup", RESPONSE.HTTP_NOT_FOUND, {classroomGroup: classroomGroupCheckResponse[0][0]}, res);
        }
        const userJoinedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const classroomUsersCreateResponse: any = await SQLHelper.executeQuery(await SQLHelper.joinClassroomGroup(userId, classGroupId,classroomGroup.classroomId, classroomGroup.courseId, userJoinedAt));
        if(classroomUsersCreateResponse === null){
            return apiResponse("Error in adding Student to ClassroomGroup", RESPONSE.HTTP_INTERNAL_SERVER_ERROR, {}, res);
        }
        return apiResponse("Student added in the classroomGroup", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async removeStudentFromClassroomGroup(req, res, next){
        const userId = req.body.userId;
        const classGroupId = req.body.classGroupId;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.student){
            return apiResponse("Only students are allowed to join groups", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        const classroomGroupResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupById(classGroupId));
        if(classroomGroupResponse === null || classroomGroupResponse[0].length === 0){
            return apiResponse("ClassroomGroup not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomGroup = classroomGroupResponse[0][0];
        const classroomGroupCheckResponse: any = await SQLHelper.executeQuery(await SQLHelper.checkIfClassroomGroupExistsForUserId(userId, classGroupId));
        if(classroomGroupCheckResponse[0].length === 0){
            return apiResponse("Student not present in the ClassroomGroup", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomUsersDeleteResponse: any = await SQLHelper.executeQuery(await SQLHelper.leaveClassroomGroup(userId, classGroupId));
        if(classroomUsersDeleteResponse === null){
            return apiResponse("Error in removing Student from ClassroomGroup", RESPONSE.HTTP_INTERNAL_SERVER_ERROR, {}, res);
        }
        return apiResponse("ClassroomGroup Student Removed", RESPONSE.HTTP_OK, {}, res);
    }

    static async fetchAllClassroomGroupsForUser(req, res, next){
        const userId = req.query.userId;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse.length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        var classroomGroups;
        
        if(user.userType === USER_TYPES.student || user.userType === USER_TYPES.teacher){
            const classroomGroupsResponse = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupsForStudent(userId));
            classroomGroups = classroomGroupsResponse[0];
        } else if(user.userType === USER_TYPES.admin){
            const classroomGroupsResponse = await SQLHelper.executeQuery(await SQLHelper.getAllClassroomGroupsForAdmin());
            classroomGroups = classroomGroupsResponse[0];
        } else if(user.userType === USER_TYPES.parent){
            classroomGroups = [];
            if(user.studentIds === null || user.studentIds === ""){
                return apiResponse("No Student linked to the Parent", RESPONSE.HTTP_OK, {classroomGroups: []}, res);
            }
            const userIds = user.studentIds.split(";");
            for(var i = 0; i < userIds.length; i++){
                const classroomGroupsResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupsForStudent(userIds[i]));
                for(const classroomGroup of classroomGroupsResponse[0]){
                    classroomGroup.userId = userIds[i];
                    classroomGroups.push(classroomGroup);
                }
            }
        }
        return apiResponse("ClassroomGroups Fetched", RESPONSE.HTTP_OK, {classroomGroups}, res);
    }

    static async fetchStudentsAnalyticsForParents(req, res, next){
        const userId = req.query.userId;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.parent){
            return apiResponse("Only parents are allowed to fetch student data", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        var data = [];
        
        const userIds = user.studentIds.split(";");
        if(userIds.length === 0){
            return apiResponse("No Student linked to the Parent", RESPONSE.HTTP_OK, {data}, res);
        }
        for(var i = 0; i < userIds.length; i++){
            data[i] = {
                assignmentGrades: [],
                attendance: [],
                userData: {}
            };
            const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userIds[i]));
            if(userResponse[0].length > 0){
                data[i].userData = userResponse[0][0];
            }
            const assignmentGradesResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupsForParentsChild(userIds[i]));
            if(assignmentGradesResponse[0].length > 0){
                data[i].assignmentGrades = assignmentGradesResponse[0];
            }
            const attendanceResponse: any = await SQLHelper.executeQuery(await SQLHelper.getAttendanceForStudent(userIds[i]));
            if(attendanceResponse[0].length > 0){
                data[i].attendance = attendanceResponse[0];
            }
        }
        return apiResponse("Student Analytics Fetched", RESPONSE.HTTP_OK, data, res);
    }

    static async fetchClassroomGroupDetails(req, res, next){
        const classGroupId = req.query.classGroupId;
        const classroomGroupResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupsByClassgroupId(classGroupId));
        if(classroomGroupResponse === null || classroomGroupResponse[0].length === 0){
            return apiResponse("ClassroomGroup not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomGroup = classroomGroupResponse[0][0];
        return apiResponse("ClassroomGroup Details Fetched", RESPONSE.HTTP_OK, {classroomGroup}, res);
    }


    static async addClassroomGroupRecordings(req, res, next){
        const userId = req.body.userId;
        const classGroupId = req.body.classGroupId;
        const recordingLink = req.body.recordingLink;
        const classDate = req.body.classDate;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.teacher){
            return apiResponse("Only teachers are allowed to add recordings", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        const classroomGroupResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupById(classGroupId));
        if(classroomGroupResponse === null || classroomGroupResponse[0].length === 0){
            return apiResponse("ClassroomGroup not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomGroup = classroomGroupResponse[0][0];
        const classroomGroupRecordingCountResponse = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupRecordingCount(classGroupId));
        const recordingCount = classroomGroupRecordingCountResponse[0][0].count;
        const recordingId = `CRID${recordingCount.toString().padStart(5, '0')}`;
        if(recordingLink === null || recordingLink === "" || classDate === null || classDate === ""){
            return apiResponse("Please provide all the required details", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const classroomGroupRecordingInsertResponse: any = await SQLHelper.executeQuery(await SQLHelper.addClassroomGroupRecording(recordingId, classGroupId, classroomGroup.classroomId, classroomGroup.courseId, classDate, recordingLink));
        if(classroomGroupRecordingInsertResponse === null){
            return apiResponse("Error in adding recording", RESPONSE.HTTP_INTERNAL_SERVER_ERROR, {}, res);
        }
        return apiResponse("ClassroomGroup Recording Added", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async editClassroomGroupRecordings(req, res, next){
        const userId = req.body.userId;
        const recordingId = req.body.recordingId;
        const recordingLink = req.body.recordingLink;
        const classDate = req.body.classDate;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.teacher){
            return apiResponse("Only teachers are allowed to edit recordings", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        const classroomGroupRecordingResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupRecordingById(recordingId));
        if(classroomGroupRecordingResponse === null || classroomGroupRecordingResponse[0].length === 0){
            return apiResponse("ClassroomGroup Recording not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        if(recordingLink === null && classDate === null){
            return apiResponse("Please provide at least recordingLink or classDate to edit", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const updateFields: any = {};
        if(recordingLink){
            updateFields.recordingLink = recordingLink;
        }
        if(classDate){
            updateFields.classDate = classDate;
        }
        const classroomGroupRecordingUpdateResponse: any = await SQLHelper.executeQuery(await SQLHelper.editClassroomGroupRecording(recordingId, updateFields));
        if(classroomGroupRecordingUpdateResponse === null){
            return apiResponse("Error in editing ClassroomGroup Recording", RESPONSE.HTTP_INTERNAL_SERVER_ERROR, {}, res);
        }
        return apiResponse("ClassroomGroup Recording Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async deleteClassroomGroupRecordings(req, res, next){
        const userId = req.body.userId;
        const recordingId = req.body.recordingId;
        const userResponse: any = await SQLHelper.executeQuery(await SQLHelper.getUserById(userId));
        if(userResponse === null || userResponse[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const user = userResponse[0][0];
        if(user.userType !== USER_TYPES.teacher){
            return apiResponse("Only teachers are allowed to delete recordings", RESPONSE.HTTP_UNAUTHORIZED, {}, res);
        }
        const classroomGroupRecordingResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupRecordingById(recordingId));
        if(classroomGroupRecordingResponse === null || classroomGroupRecordingResponse[0].length === 0){
            return apiResponse("ClassroomGroup Recording not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomGroupRecordingDeleteResponse: any = await SQLHelper.executeQuery(await SQLHelper.deleteClassroomGroupRecording(recordingId));
        if(classroomGroupRecordingDeleteResponse === null){
            return apiResponse("Error in deleting ClassroomGroup Recording", RESPONSE.HTTP_INTERNAL_SERVER_ERROR, {}, res);
        }
        return apiResponse("ClassroomGroup Recording Deleted", RESPONSE.HTTP_OK, {}, res);
    }

    static async fetchClassroomGroupRecordings(req, res, next){
        const classGroupId = req.query.classGroupId;
        const classroomGroupRecordingResponse: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupRecordingsByClassgroupId(classGroupId));
        if(classroomGroupRecordingResponse === null || classroomGroupRecordingResponse[0].length === 0){
            return apiResponse("ClassroomGroup Recording not found", RESPONSE.HTTP_NOT_FOUND, {}, res);
        }
        const classroomGroupRecordings = classroomGroupRecordingResponse[0];
        return apiResponse("ClassroomGroup Recordings Fetched", RESPONSE.HTTP_OK, {classroomGroupRecordings}, res);
    }
}
export default ClassroomGroupController;