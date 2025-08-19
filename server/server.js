import express from "express";
import dotenv from "dotenv"
import cors from 'cors'
import { userRouters } from "./routes/userRouters.js";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "./configs/passsportLocalConfigs.js";
import { fileRouter } from "./routes/fileRouter.js";
import { folderRouter }from "./routes/folderRouter.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

const prisma = new PrismaClient()

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV,
    credentials: true
}))

app.use(
  session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/api/v1/user", userRouters)
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/folders", folderRouter);

app.use((err, req, res, next)=>{
    res.status(500).send({
        err: err,
        message: "Internal Server Error"
    })
})

app.listen(PORT, ()=>{
    console.log(`Listening to port: ${PORT}`)
})