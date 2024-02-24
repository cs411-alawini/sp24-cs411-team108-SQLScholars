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
    }
    getRoutes(){
        this.router.get("/fetch", ClassroomGroupController.fetchClassroomGroupsForUser);
    }
    putRoutes(){
        this.router.put("/edit", ClassroomGroupController.editClassroomGroups);
    }
}
export default new ClassroomGroupRouter().router;