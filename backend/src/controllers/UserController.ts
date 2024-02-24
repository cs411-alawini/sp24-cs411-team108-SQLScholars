import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";

class AuthController{
    constructor(){}

    static async signupUser(req, res, next){
        return apiResponse("User created", RESPONSE.HTTP_CREATED, {}, res);
    }

    static async loginUser(req, res, next){
        return apiResponse("User Login Successful", RESPONSE.HTTP_OK, {}, res);
    }
    
    static async getUserProfile(req, res, next){
        return apiResponse("User Profile", RESPONSE.HTTP_OK, {}, res);
    }

    static async editUserDetails(req, res, next){
        return apiResponse("User Details Edited", RESPONSE.HTTP_OK, {}, res);
    }

    static async searchInUsers(req, res, next){
        return apiResponse("Student searched", RESPONSE.HTTP_OK, {}, res);
    }

}
export default AuthController;