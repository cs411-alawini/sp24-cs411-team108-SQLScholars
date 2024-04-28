import { Router } from "express";
import ClassroomGroupController from "../controllers/ClassroomGroupController";
import AssignmentController from "../controllers/AssignmentController";

class AssignmentRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
        this.putRoutes();
    }
    postRoutes(){
        this.router.post("/create", AssignmentController.createGroupAssignment);
        this.router.post("/delete", AssignmentController.deleteGroupAssignment);
        this.router.post("/addGrade", AssignmentController.addAssignmentGrade);
    }
    getRoutes(){
        this.router.get("/getAssignments", AssignmentController.fetchGroupAssignment);
        this.router.get("/getAssignmentGrades", AssignmentController.fetchAssignmentGrades);
    }
    putRoutes(){
        this.router.put("/edit", AssignmentController.editGroupAssignment);
        this.router.put("/editGrade", AssignmentController.editAssignmentGrade);
    }
}
export default new AssignmentRouter().router;