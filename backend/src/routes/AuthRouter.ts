import { Router } from "express";
import AuthController from "../controllers/AuthController";

class AuthRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
        this.putRoutes();
    }
    postRoutes(){
        this.router.post("/signupUser", AuthController.signupUser);
        this.router.post("/loginUser", AuthController.loginUser);
    }
    getRoutes(){
        this.router.get("/getUserProfile", AuthController.getUserProfile);
    }
    putRoutes(){
        this.router.put("/editUser", AuthController.editUserDetails);
    }
}
export default new AuthRouter().router;