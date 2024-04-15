import { USER_TYPES } from "../constants/ServerConstants";
import SQLHelper from "../helpers/SQLHelper";
import { faker } from '@faker-js/faker';

class PopulateDataService{
    constructor(){};

    static async populateUserDate(){
        //Populate Student User Data
        var mainStudentQuery = "";
        for(let i=0; i<1000; i++){
            const userId = `UID${i.toString().padStart(5, '0')}`;
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const userType = USER_TYPES.student;
            const address = faker.location.streetAddress();
            const dob = faker.date.past().toISOString().split('T')[0];
            const query = `insert into Users(userId, firstName, lastName, email, password, userType, address, dob) values("${userId}","${firstName}", "${lastName}", "${email}", "${password}", ${userType}, "${address}", "${dob}");`;
            mainStudentQuery += query;
            
        }
        const executeStudentQuery = await SQLHelper.executeQuery(mainStudentQuery);
        if(executeStudentQuery == null){
            console.log("Error in Populating Student Data", executeStudentQuery);
        } else {
            console.log("User Student Data Populated: ", executeStudentQuery);
        }

        //Populate Teacher User Data
        var mainTeacherQuery = "";
        for(let i=0; i<100; i++){
            const userId = `TID${i.toString().padStart(5, '0')}`;
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const userType = USER_TYPES.teacher;
            const address = faker.location.streetAddress();
            const dob = faker.date.past().toISOString().split('T')[0];
            const query = `insert into Users(userId, firstName, lastName, email, password, userType, address, dob) values("${userId}","${firstName}", "${lastName}", "${email}", "${password}", ${userType}, "${address}", "${dob}");`;
            mainTeacherQuery += query;
            
        }
        const executeTeacherQuery = await SQLHelper.executeQuery(mainTeacherQuery);
        if(executeTeacherQuery == null){
            console.log("Error in Populating Teacher Data", executeTeacherQuery);
        } else {
            console.log("Teacher Data Populated: ", executeTeacherQuery);
        }

        //Populate Parent User Data
        var mainParentQuery = "";
        for(let i=0; i<500; i++){
            const userId = `PID${i.toString().padStart(5, '0')}`;
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const userType = USER_TYPES.parent;
            const address = faker.location.streetAddress();
            const dob = faker.date.past().toISOString().split('T')[0];
            const occupation = faker.person.jobTitle();
            const studentIds = `UID${(i*2).toString().padStart(5, '0')};UID${(i*2+1).toString().padStart(5, '0')}`;
            const query = `insert into Users(userId, firstName, lastName, email, password, userType, address, dob, occupation, studentIds) values("${userId}","${firstName}", "${lastName}", "${email}", "${password}", ${userType}, "${address}", "${dob}", "${occupation}", "${studentIds}");`;
            mainParentQuery += query;
            
        }
        const executeParentQuery = await SQLHelper.executeQuery(mainParentQuery);
        if(executeTeacherQuery == null){
            console.log("Error in Populating Parent Data", executeParentQuery);
        } else {
            console.log("Parent Student Data Populated: ", executeParentQuery);
        }
    }

    static async populateClassroomNames(){
        //Random Classroom Names
        var classroomNames = [];

        for (let i = 1; i <= 12; i++) {
            for (let j = 65; j < 65 + 12; j++) {
                const className = `${i}-${String.fromCharCode(j)}`;
                classroomNames.push(className);
            }
        }
        return classroomNames;
    }

    static async populateClassroomData(){
        //Populate Classroom Data
        var mainClassroomQuery = "";

        const classroomNames = await PopulateDataService.populateClassroomNames();
        for(let i=0; i<144; i++){
            const classroomId = `CLID${i.toString().padStart(5, '0')}`;
            const className = classroomNames[i];
            const createdAt =new Date().toISOString().slice(0, 19).replace('T', ' ');
            const query = `insert into Classrooms(classroomId, className, createdAt) values("${classroomId}", "${className}", "${createdAt}");`;
            mainClassroomQuery += query;
        }

        const executeClassroomQuery = await SQLHelper.executeQuery(mainClassroomQuery);
        if(executeClassroomQuery == null){
            console.log("Error in Populating Classroom Data", executeClassroomQuery);
        } else {
            console.log("Classroom Data Populated: ", executeClassroomQuery);
        }
    }

    static async populateCourseData(){
        //Populate Course Data
        var mainCourseQuery = "";
        const courses = ["Mathematics", "Science", "Social Studies", "English", "Computer Science", "Physical Education", "Art", "Music", "Dance", "Drama", "History", "Geography", "Physics", "Chemistry", "Biology", "Economics", "Political Science", "Psychology", "Sociology", "Philosophy", "Anthropology", "Archaeology", "Linguistics", "Criminology", "Law", "Public Administration", "Business Administration", "Accounting", "Finance", "Marketing", "Management", "Human Resource Management", "Operations Management", "Supply Chain Management", "Information Technology", "Data Science", "Machine Learning", "Artificial Intelligence", "Cyber Security", "Computers"];
        for(let i=0; i<40; i++){
            const courseId = `CID${i.toString().padStart(5, '0')}`;
            const subjectName = courses[i];
            const rating = faker.number.float({min: 4,max: 10, fractionDigits: 2});
            const query = `insert into Courses(courseId, subjectName, rating) values("${courseId}", "${subjectName}", ${rating});`;
            mainCourseQuery += query;
        }
        const executeCourseQuery = await SQLHelper.executeQuery(mainCourseQuery);
        if(executeCourseQuery == null){
            console.log("Error in Populating Course Data", executeCourseQuery);
        } else {
            console.log("Course Data Populated: ", executeCourseQuery);
        }
    }
    static async populateClassroomGroupData(){
        //Populate Classroom Group Data
        var mainClassroomGroupQuery = "";
        for(let i=0; i<143; i++){
            const classroomId = `CLID${i.toString().padStart(5, '0')}`;
            for(let j=0; j<8; j++){
                const classGroupId = `CGID${((i * 7)+j).toString().padStart(5, '0')}`;
                const courseId = `CID${(((i * 7) + j)%39).toString().padStart(5, '0')}`;
                const zoomLink = faker.internet.url();
                const classStartTimings = faker.date.between({from: '2022-01-01T08:00:00', to: '2022-01-01T15:00:00'}).toISOString().slice(11, 19);
                const classDuration = faker.number.float({min: 1,max: 3, fractionDigits: 2});
                const query = `insert into ClassroomGroups(classGroupId, classroomId, courseId, zoomLink, classStartTimings, classDuration) values("${classGroupId}", "${classroomId}", "${courseId}", "${zoomLink}", "${classStartTimings}", ${classDuration});`;
                mainClassroomGroupQuery += query;
            }
        }
        const executeClassroomGroupQuery = await SQLHelper.executeQuery(mainClassroomGroupQuery);
        if(executeClassroomGroupQuery == null){
            console.log("Error in Populating Classroom Group Data", executeClassroomGroupQuery);
        } else {
            console.log("Classroom Group Data Populated: ", executeClassroomGroupQuery);
        }
    }

    static async populateClassroomUserData(){
        //Populate Classroom Users Data
        var mainClassroomUsersQuery = "";
        for(let i=0; i<1000; i++){
            const userJoinedAt = new Date('2024-02-28').toISOString().split('T')[0];
            const userId = `UID${(i).toString().padStart(5, '0')}`;
            const classroomId = `CLID${faker.number.int({min: 0, max: 143}).toString().padStart(5, '0')}`;
            const executeClassroomGroupsData: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupsByClassroomId(classroomId));
            if(executeClassroomGroupsData == null || executeClassroomGroupsData[0].length <= 3){
                console.log("Error in Fetching Classroom Groups Data", executeClassroomGroupsData);
                continue;
            }
            for(let j=0; j<executeClassroomGroupsData[0].length-3; j++){
                const classGroupId = executeClassroomGroupsData[0][j].classGroupId;
                const courseId = executeClassroomGroupsData[0][j].courseId;
                const query = `insert into ClassroomUsers(userJoinedAt, userId, classGroupId, classroomId, courseId) values("${userJoinedAt}", "${userId}", "${classGroupId}", "${classroomId}", "${courseId}");`;
                mainClassroomUsersQuery += query;
            }
        }
        const executeClassroomUsersQuery = await SQLHelper.executeQuery(mainClassroomUsersQuery);
        if(executeClassroomUsersQuery == null){
            console.log("Error in Populating Classroom Users Data", executeClassroomUsersQuery);
        } else {
            console.log("Classroom Users Data Populated: ", executeClassroomUsersQuery);
        }
    }

    static async populateAttendanceData(){
        //Populate Attendance Data
        var mainAssignmentQuery = "";
        for(let i=0; i<1000; i++){
            const studentId = `UID${(i).toString().padStart(5, '0')}`;
            const executeUserClassroomData: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomIdByUserId(studentId, 1));
            if(executeUserClassroomData == null || executeUserClassroomData[0].length == 0){
                console.log(`Error in Fetching Classroom Data: ${studentId}`, executeUserClassroomData);
                continue;
            }
            const classroomId = executeUserClassroomData[0][0].classroomId;
            for(var j=0; j<6; j++){
                const attendanceDate = new Date(`2024-02-${(j+1).toString().padStart(2, '0')}`).toISOString().split('T')[0];
                const isParentsNotified = faker.datatype.boolean();
                const isPresent = faker.datatype.boolean();
                const query = `insert into Attendance(studentId, classroomId, attendanceDate, isParentsNotified, isPresent) values("${studentId}", "${classroomId}", "${attendanceDate}", ${isParentsNotified}, ${isPresent});`;
                mainAssignmentQuery += query;
            }
        }
        const executeAssignmentQuery = await SQLHelper.executeQuery(mainAssignmentQuery);
        if(executeAssignmentQuery == null){
            console.log("Error in Populating Attendance Data", executeAssignmentQuery);
        } else {
            console.log("Attendance Data Populated: ", executeAssignmentQuery);
        } 
    }


    static async populateAssignmentData(){
        //Populate Assignment Data
        var mainAssignmentQuery = "";
        for(let i=0; i<300; i++){
            const randomClassroomGroup = `CGID${(faker.number.int({min: 0, max: 143})).toString().padStart(5, '0')}`;
            const executeRandomClassroomGroupData: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomGroupById(randomClassroomGroup));
            if(executeRandomClassroomGroupData == null || executeRandomClassroomGroupData[0].length == 0){
                console.log(`Error in Fetching Classroom Group Data: ${randomClassroomGroup}`, executeRandomClassroomGroupData);
                continue;
            }
            const classroomId = executeRandomClassroomGroupData[0][0].classroomId;
            const courseId = executeRandomClassroomGroupData[0][0].courseId;
            const assignmentId = `AID${(i).toString().padStart(5, '0')}`;
            const googleFormLink = faker.internet.url();
            const maximumGrade = faker.number.float({min: 50,max: 100, multipleOf: 10});
            const query = `insert into Assignment(assignmentId, classGroupId, classroomId, courseId, googleFormLink, maximumGrade) values("${assignmentId}", "${randomClassroomGroup}", "${classroomId}", "${courseId}", "${googleFormLink}", ${maximumGrade});`;
            mainAssignmentQuery += query;
        }
        const executeAssignmentQuery = await SQLHelper.executeQuery(mainAssignmentQuery);
        if(executeAssignmentQuery == null){
            console.log("Error in Populating Assignment Data", executeAssignmentQuery);
        } else {
            console.log("Assignment Data Populated: ", executeAssignmentQuery);
        }
    }

    static async populateGradesData(){
        var mainGradesQuery = "";
        const executeAllAssignmentsData: any = await SQLHelper.executeQuery(await SQLHelper.getAllAssignments());
        if(executeAllAssignmentsData == null || executeAllAssignmentsData[0].length == 0){
            console.log("Error in Fetching Assignments Data", executeAllAssignmentsData);
            return;
        }
        for(let i=0; i<executeAllAssignmentsData[0].length; i++){
            const classGroupId = executeAllAssignmentsData[0][i].classGroupId;
            const classroomId = executeAllAssignmentsData[0][i].classroomId;
            const courseId = executeAllAssignmentsData[0][i].courseId;
            const executeAllClassroomGroupUsersData: any = await SQLHelper.executeQuery(await SQLHelper.getClassroomUsersByClassGroupId(classGroupId));
            if(executeAllClassroomGroupUsersData == null || executeAllClassroomGroupUsersData[0].length == 0){
                console.log(`Error in Fetching Classroom Group Users Data: ${classGroupId}`, executeAllClassroomGroupUsersData);
                continue;
            }
            for(let j=0; j<executeAllClassroomGroupUsersData[0].length; j++){
                const userId = executeAllClassroomGroupUsersData[0][j].userId;
                const grade = faker.number.float({min: 30,max: executeAllAssignmentsData[0][i].maximumGrade, multipleOf: 1});
                const remarks = faker.lorem.sentence();
                const sentimentScore = faker.number.int({min: 0, max: 2});
                const isNotificationSent = faker.datatype.boolean();
                const assignmentId = executeAllAssignmentsData[0][i].assignmentId;
                const query = `insert into Grades(assignmentId, userId, classGroupId, classroomId, courseId, grade, remarks, sentimentScore, isNotificationSent) values("${assignmentId}", "${userId}", "${classGroupId}", "${classroomId}", "${courseId}", ${grade}, "${remarks}", ${sentimentScore}, ${isNotificationSent});`;
                mainGradesQuery += query;
            }
        }
        const executeGradesQuery = await SQLHelper.executeQuery(mainGradesQuery);
        if(executeGradesQuery == null){
            console.log("Error in Populating Grades Data", executeGradesQuery);
        } else {
            console.log("Grades Data Populated: ", executeGradesQuery);
        }
    }
}
export default PopulateDataService;
