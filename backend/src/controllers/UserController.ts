import RESPONSE from "../constants/ResponseConstants";
import { USER_TYPES } from "../constants/ServerConstants";
import { apiResponse } from "../helpers/ApiResponse";
import SQLHelper from "../helpers/SQLHelper";

class AuthController{
    constructor(){}

    static async signupUser(req, res, next){
        try{
            const body = req.body;
            const firstName = body.firstName;
            const lastName = body.lastName;
            const email = body.email;
            const password = body.password;
            const userType = body.userType;
            const address = body.address;
            const dob = body.dob;
            const response: any = await SQLHelper.executeQuery(SQLHelper.emailCheckQuery(email));
            if(response[0].length != 0 || response === null){
                return apiResponse("User email already exists", RESPONSE.HTTP_BAD_REQUEST, {email}, res);
            }
            const userCountResponse = await SQLHelper.executeQuery(await SQLHelper.getStudentCount(userType));
            const userCount = userCountResponse[0][0].count;
            let userId;
            if (userType === USER_TYPES.student) {
                userId = `UID${userCount.toString().padStart(5, '0')}`;
            } else if(userType === USER_TYPES.teacher){
                userId = `TID${userCount.toString().padStart(5, '0')}`;
            } else if(userType === USER_TYPES.parent){
                userId = `PID${userCount.toString().padStart(5, '0')}`;
            } else if(userType === USER_TYPES.admin){
                userId = `AID${userCount.toString().padStart(5, '0')}`;
            } else {
                return apiResponse("Invalid user type", RESPONSE.HTTP_BAD_REQUEST, {userType}, res);
            }
            const userCreateResponse: any = await SQLHelper.executeQuery(SQLHelper.createUserQuery(userId, firstName, lastName, email, password, userType, address, dob));
            if(userCreateResponse === null){
                return apiResponse("User not created. Please try again", RESPONSE.HTTP_BAD_REQUEST, {}, res);
            }
            const fetchUserResponse = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
            if(fetchUserResponse === null){
                return apiResponse("Error occurred. Please try again later", RESPONSE.HTTP_BAD_REQUEST, {}, res);
            }
            return apiResponse("User created", RESPONSE.HTTP_CREATED, {user: fetchUserResponse[0][0]}, res);
        } catch(error){
            next(error)
        }
    }

    static async loginUser(req, res, next){
        const body = req.body;
        const email = body.email;
        const password = body.password;
        const response: any = await SQLHelper.executeQuery(SQLHelper.emailCheckQuery(email));
        if(response[0].length === 0 || response === null){
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {email}, res);
        }
        const user = response[0][0];
        if(user.password !== password){
            return apiResponse("Incorrect password", RESPONSE.HTTP_BAD_REQUEST, {email}, res);
        }

        return apiResponse("User Login Successful", RESPONSE.HTTP_OK, {user}, res);
    }
    
    static async getUserProfile(req, res, next){
        const userId = req.query.userId;
        const response: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if(response[0].length === 0 || response === null){
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {userId}, res);
        }
        const user = response[0][0];
        return apiResponse("User Profile", RESPONSE.HTTP_OK, {user}, res);
    }

    static async editUserDetails(req, res, next){
        const body = req.body;
        const userId = body.userId;
        const firstName = body.firstName;
        const lastName = body.lastName;
        const email = body.email;
        const password = body.password;
        const userType = body.userType;
        const address = body.address;
        const dob = body.dob;

        const updateFields: any = {};
        if (firstName) {
            updateFields.firstName = firstName;
        }
        if (lastName) {
            updateFields.lastName = lastName;
        }
        if (email) {
            updateFields.email = email;
        }
        if (password) {
            updateFields.password = password;
        }
        if (userType) {
            updateFields.userType = userType;
        }
        if (address) {
            updateFields.address = address;
        }
        if (dob) {
            updateFields.dob = dob;
        }
        const checkUser: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if(checkUser === null || checkUser[0].length === 0){
            return apiResponse("User not found", RESPONSE.HTTP_BAD_REQUEST, {userId}, res);
        }
        const response: any = await SQLHelper.executeQuery(SQLHelper.editUserQuery(userId, updateFields));
        if(response === null){
            return apiResponse("User Details not edited", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const fetchUserResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(userId));
        if(fetchUserResponse === null || fetchUserResponse[0].length === 0){
            return apiResponse("Error occurred. Please try again later", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        }
        const user = fetchUserResponse[0][0];       
        return apiResponse("User Details Edited", RESPONSE.HTTP_OK, {user}, res);
    }

    static async searchInUsers(req, res, next){
        const searchQuery = req.query.query;
        const userType = req.query.userType;
        const response: any = await SQLHelper.executeQuery(SQLHelper.searchUserQuery(searchQuery, userType));
        if(response === null){
            return apiResponse("Error occurred. Please try again later", RESPONSE.HTTP_BAD_REQUEST, {}, res);
        } else if(response[0].length === 0){
            return apiResponse("No user found", RESPONSE.HTTP_BAD_REQUEST, {searchQuery}, res);
        }

        return apiResponse("Users searched", RESPONSE.HTTP_OK, {users: response[0]}, res);
    }

}
export default AuthController;