import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res, next)=>{
    res.send("Hello World!");
    next();
    return;
})
app.listen(process.env.PORT, ()=>{
    console.log("Server connected to port", process.env.PORT);
})
