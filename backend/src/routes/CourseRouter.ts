import { Router } from "express";
import CourseController from "../controllers/CourseController";

class CourseRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
    }
    postRoutes(){
        this.router.post("/create", CourseController.createCourse);
    }
    getRoutes(){
        this.router.get("/fetch", CourseController.getCourses);

    }
    putRoutes(){
        this.router.put("/editCourse", CourseController.editCourses);
    }
}
export default new CourseRouter().router;