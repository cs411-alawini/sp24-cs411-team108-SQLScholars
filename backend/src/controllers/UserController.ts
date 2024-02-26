import RESPONSE from "../constants/ResponseConstants";
import { apiResponse } from "../helpers/ApiResponse";
import SQLHelper from "../helpers/SqlHelper";

class AuthController{
    constructor(){}

    static async signupUser(req, res, next){
        try{
            const body = req.body;
            const firstName = body.firstName;
            const lastName = body.lastName;
            const email = body.email;
            const password = body.password;
            const parentEmail1 = body.parentEmail1;
            const parentEmail2 = body.parentEmail2;
    
            const response: any = await SQLHelper.executeQuery(SQLHelper.emailCheckQuery(email));
            if(response[0].length != 0){
                return apiResponse("User email already exists", RESPONSE.HTTP_BAD_REQUEST, {email}, res);
            }

            return apiResponse("User created", RESPONSE.HTTP_CREATED, {}, res);
        } catch(error){
            next(error)
        }
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