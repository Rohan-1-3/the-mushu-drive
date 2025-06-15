import express from "express";
import dotenv from "dotenv"
import { userRouters } from "./routes/userRouters.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use("/api/v1/user", userRouters)


app.use((err, req, res, next)=>{
    res.status(500).send({
        err: err,
        message: "Internal Server Error"
    })
})

app.listen(PORT, ()=>{
    console.log(`Listening to port: ${PORT}`)
})