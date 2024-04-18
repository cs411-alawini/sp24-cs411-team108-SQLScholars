import { Router } from "express";
import ClassroomGroupController from "../controllers/ClassroomGroupController";

class ClassroomGroupRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
        this.putRoutes();
    }
    postRoutes(){
        this.router.post("/create", ClassroomGroupController.linkCourseToClassroom);
        this.router.post("/addRecording", ClassroomGroupController.addClassroomGroupRecordings);
        this.router.post("/deleteRecording", ClassroomGroupController.deleteClassroomGroupRecordings);

        this.router.post("/addStudent", ClassroomGroupController.addStudentToClassroomGroup);
        this.router.post("/removeStudent", ClassroomGroupController.removeStudentFromClassroomGroup);
    }
    getRoutes(){
        this.router.get("/getAll", ClassroomGroupController.fetchAllClassroomGroupsForUser);
        this.router.get("/getStudentAnalytics", ClassroomGroupController.fetchStudentsAnalyticsForParents)
        this.router.get("/getDetails", ClassroomGroupController.fetchClassroomGroupDetails);
        this.router.get("/getRecordings", ClassroomGroupController.fetchClassroomGroupRecordings);
    }
    putRoutes(){
        this.router.put("/edit", ClassroomGroupController.editClassroomGroups);
        this.router.put("/editRecording", ClassroomGroupController.editClassroomGroupRecordings);
    }
}
export default new ClassroomGroupRouter().router;