import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import AuthRouter from "./routes/AuthRouter";
dotenv.config();

const app = express();

export const sqlPool = mysql.createPool({
    host: '34.28.239.39',
    user: 'root',
    password: 'panshuljindal',
    database: 'illinicms'
}).promise()

app.use("/api/auth", AuthRouter);
app.use("/api/classroom", AuthRouter);

app.listen(process.env.PORT, ()=>{
    console.log("Server connected to port", process.env.PORT);
})
