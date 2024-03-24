import { sqlPool } from "../index";

class SQLHelper{
    constructor(){};

    static async executeQuery(query: string){
        return await sqlPool.query(query);
    }
    static emailCheckQuery(email: String){
        return `SELECT * FROM USERS where emailId=${email}`;
    }
}
export default SQLHelper;