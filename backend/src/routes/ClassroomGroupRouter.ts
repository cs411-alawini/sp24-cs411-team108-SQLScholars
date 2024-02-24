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
    }
    getRoutes(){
        this.router.get("/fetch", ClassroomGroupController.fetchClassroomGroupsForUser);
    }
    putRoutes(){
        this.router.put("/edit", ClassroomGroupController.editClassroomGroups);
        this.router.put("/editRecording", ClassroomGroupController.editClassroomGroupRecordings);
    }
}
export default new ClassroomGroupRouter().router;