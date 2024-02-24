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
        this.router.post("/search", UserController.searchInUsers);
    }
    getRoutes(){
        this.router.get("/getProfile", UserController.getUserProfile);
    }
    putRoutes(){
        this.router.put("/edit", UserController.editUserDetails);
    }
}
export default new AuthRouter().router;