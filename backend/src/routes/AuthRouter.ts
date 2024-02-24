import { Router } from "express";
import AuthController from "../controllers/AuthController";

class AuthRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
    }
    postRoutes(){
        this.router.post("/createUser", AuthController.createUser);
        this.router.post("/loginUser", AuthController.loginUser);
    }
    getRoutes(){
        this.router.get("/getUserProfile", AuthController.getUserProfile);
    }
}
export default new AuthRouter().router;