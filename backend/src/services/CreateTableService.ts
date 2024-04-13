import SQLHelper from "../helpers/SQLHelper";
import PopulateDataService from "./PopulateDataService";

class CreateTableService{
    static async createTables(){

        //Deleting All Tables
        const dropAllTables = "DROP TABLE IF EXISTS ClassGroupRecordings;DROP TABLE IF EXISTS Grades;DROP TABLE IF EXISTS Assignment;DROP TABLE IF EXISTS ClassroomUsers; DROP TABLE IF EXISTS ClassroomGroups; DROP TABLE IF EXISTS Attendance;DROP TABLE IF EXISTS Users;DROP TABLE IF EXISTS Classrooms;DROP TABLE IF EXISTS Courses;";
        const dropAllTableResponse = await SQLHelper.executeQuery(dropAllTables);
        console.log("All Tables Deleted: ", dropAllTableResponse);


        //Creating Tables

        const userTable = "create table Users(userId varchar(10) primary key, firstName varchar(255), lastName varchar(255), email varchar(255) not null, password varchar(255) not null, userType Integer, address varchar(255), dob date, occupation varchar(255), studentIds varchar(100));";
        const userTableResponse = await SQLHelper.executeQuery(userTable);
        console.log("User Table Created: ", userTableResponse);

        const classroomTable = "create table Classrooms(classroomId varchar(10) primary key, className varchar(20) not null, createdAt date);";
        const classroomTableResponse = await SQLHelper.executeQuery(classroomTable);
        console.log("Classroom Table Created: ", classroomTableResponse);
        

        const courseTable = "create table Courses(courseId varchar(10) primary key, subjectName varchar(100) not null, rating float);";
        const courseTableResponse = await SQLHelper.executeQuery(courseTable);
        console.log("Course Table Created: ", courseTableResponse);

        const classroomGroupTable = "create table ClassroomGroups(classGroupId varchar(10), classroomId varchar(10), courseId varchar(10), zoomLink varchar(255), classStartTimings varchar(50), classDuration float, primary key(classGroupId, classroomId, courseId), foreign key(classroomId) references Classrooms(classroomId), foreign key(courseId) references Courses(courseId));";
        const classroomGroupTableResponse = await SQLHelper.executeQuery(classroomGroupTable);
        console.log("ClassroomGroup Table Created: ", classroomGroupTableResponse);

        const classroomUsersTable = "create table ClassroomUsers(userJoinedAt Date, userId varchar(10), classGroupId varchar(10), classroomId varchar(10), courseId varchar(10), primary key(classroomId, courseId, classGroupId, userId), foreign key (classGroupId, classroomId, courseId) references ClassroomGroups (classGroupId, classroomId, courseId), foreign key (userId) references Users(userId));";
        const classroomUsersTableResponse = await SQLHelper.executeQuery(classroomUsersTable);
        console.log("ClassroomUsers Table Created: ", classroomUsersTableResponse);
        
        const attendanceTable = "create table Attendance(studentId varchar(10), classroomId varchar(10), attendanceDate date, isParentsNotified Boolean, isPresent boolean, primary key(classroomId, studentId, attendanceDate), foreign key(classroomId) references Classrooms(classroomId), foreign key(studentId) references Users(userId));";
        const attendanceTableResponse = await SQLHelper.executeQuery(attendanceTable);
        console.log("Attendance Table Created: ", attendanceTableResponse);

        const assignmentTable = "create table Assignment(assignmentId varchar(10), classGroupId varchar(10), classroomId varchar(10), courseId varchar(10), foreign key (classGroupId, classroomId, courseId) references ClassroomGroups(classGroupId, classroomId, courseId), primary key(classroomId, courseId, classGroupId, assignmentId), googleFormLink varchar(255), maximumGrade Float);";
        const assignmentTableResponse = await SQLHelper.executeQuery(assignmentTable);
        console.log("Assignment Table Created: ", assignmentTableResponse);

        const gradesTable = "create table Grades (assignmentId varchar(10), userId varchar(10), classGroupId varchar(10), classroomId varchar(10), courseId varchar(10), grade float, remarks varchar(255), sentimentScore INT, isNotificationSent boolean, primary key (userId, classroomId, courseId, classGroupId, assignmentId), foreign key (classGroupId, classroomId, courseId, assignmentId) references Assignment(classGroupId, classroomId, courseId, assignmentId), foreign key (userId) references Users(userId));";
        const gradesTableResponse = await SQLHelper.executeQuery(gradesTable);
        console.log("Grades Table Created: ", gradesTableResponse);

        const classgroupRescordingsTable = "create table ClassGroupRecordings(recordingId varchar(10), classGroupId varchar(10), classroomId varchar(10), courseId varchar(10), foreign key (classGroupId, classroomId, courseId) references ClassroomGroups (classGroupId, classroomId, courseId), classDate Date, recordingLink varchar(255), primary key (recordingId, classGroupId, classroomId, courseId));";
        const classgroupRescordingsTableResponse = await SQLHelper.executeQuery(classgroupRescordingsTable);
        console.log("ClassGroupRecordings Table Created: ", classgroupRescordingsTableResponse);
        
        //Populating Data
        await CreateTableService.populateDate();
    }
    static async populateDate(){
        await PopulateDataService.populateUserDate();
        await PopulateDataService.populateClassroomData();
        await PopulateDataService.populateCourseData();
        await PopulateDataService.populateClassroomGroupData();
        await PopulateDataService.populateClassroomUserData();
        await PopulateDataService.populateAttendanceData();
        await PopulateDataService.populateAssignmentData();
        await PopulateDataService.populateGradesData();
    }
}
export default CreateTableService;