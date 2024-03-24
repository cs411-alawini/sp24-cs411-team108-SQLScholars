import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import AuthRouter from "./routes/AuthRouter";
import ClassroomRouter from "./routes/ClassroomRouter";
import CourseRouter from "./routes/CourseRouter";
import ClassroomGroupRouter from "./routes/ClassroomGroupRouter";
import AssignmentRouter from "./routes/AssignmentRouter";
import AttendanceRouter from "./routes/AttendanceRouter";
dotenv.config();

const app = express();

export const sqlPool = mysql.createPool({
    host: '34.28.239.39',
    user: 'root',
    password: 'panshuljindal',
    database: 'illinicms'
}).promise()

app.use("/api/user", AuthRouter);
app.use("/api/classroom", ClassroomRouter);
app.use("/api/course", CourseRouter);
app.use("/api/classroomgroup", ClassroomGroupRouter);
app.use("/api/assignment", AssignmentRouter);
app.use("/api/attendance", AttendanceRouter);

app.listen(process.env.PORT, ()=>{
    console.log("Server connected to port", process.env.PORT);
});
