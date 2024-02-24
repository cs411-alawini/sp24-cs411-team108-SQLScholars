import { Router } from "express";
import ClassroomController from "../controllers/ClassroomController";

class ClassroomRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
    }
    postRoutes(){
        this.router.post("/create", ClassroomController.createClassroom);
    }
    getRoutes(){
        this.router.get("/fetch", ClassroomController.getClassrooms);

    }
}
export default new ClassroomRouter().router;