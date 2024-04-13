import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import AuthRouter from "./routes/AuthRouter";
import ClassroomRouter from "./routes/ClassroomRouter";
import CourseRouter from "./routes/CourseRouter";
import ClassroomGroupRouter from "./routes/ClassroomGroupRouter";
import AssignmentRouter from "./routes/AssignmentRouter";
import AttendanceRouter from "./routes/AttendanceRouter";
import CreateTableService from "./services/CreateTableService";
import PopulateDataService from "./services/PopulateDataService";
dotenv.config();

const app = express();

export const sqlPool = mysql.createPool({
    host: '104.197.111.142',
    user: 'root',
    password: 'illinicms@2024',
    database: 'illinicms',
    multipleStatements: true,
    waitForConnections: true,
}).promise();

// CreateTableService.createTables();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", AuthRouter);
app.use("/api/classroom", ClassroomRouter);
app.use("/api/course", CourseRouter);
app.use("/api/classroomgroup", ClassroomGroupRouter);
app.use("/api/assignment", AssignmentRouter);
app.use("/api/attendance", AttendanceRouter);

app.listen(process.env.PORT, ()=>{
    console.log("Server connected to port", process.env.PORT);
});
