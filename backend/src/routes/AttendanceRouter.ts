import { Router } from "express";
import AttendanceController from "../controllers/AttendanceController";

class AttendanceRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
        this.putRoutes();
    }
    postRoutes(){
        this.router.post("/create", AttendanceController.addAttendanceForClassroom);

    }
    getRoutes(){
        this.router.get("/get", AttendanceController.getAttendanceForClassroom);
    }
    putRoutes(){
        this.router.put("/update", AttendanceController.editAttendanceForClassroom);
    }
}
export default new AttendanceRouter().router;