import { Router } from "express";
import ClassroomController from "../controllers/ClassroomController";

class ClassroomRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
        this.putRoutes();
    }
    postRoutes(){
        this.router.post("/create", ClassroomController.createClassroom);
    }
    getRoutes(){
        this.router.get("/fetch", ClassroomController.getClassrooms);
    }
    putRoutes(){
        this.router.put("/editUser", ClassroomController.editClassroom);
    }
}
export default new ClassroomRouter().router;