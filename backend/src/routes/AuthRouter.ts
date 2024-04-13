import { Router } from "express";
import UserController from "../controllers/UserController";

class AuthRouter{
    public router: Router;
    constructor(){
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
        this.putRoutes();
    }
    postRoutes(){
        this.router.post("/signup", UserController.signupUser);
        this.router.post("/login", UserController.loginUser);
    }
    getRoutes(){
        this.router.get("/getProfile", UserController.getUserProfile);
        this.router.get("/search", UserController.searchInUsers);
    }
    putRoutes(){
        this.router.put("/edit", UserController.editUserDetails);
    }
}
export default new AuthRouter().router;