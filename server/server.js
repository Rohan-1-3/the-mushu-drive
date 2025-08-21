import express from "express";
import dotenv from "dotenv"
import cors from 'cors'
import { userRouters } from "./routes/userRouters.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "./configs/passsportLocalConfigs.js";
import { fileRouter } from "./routes/fileRouter.js";
import { folderRouter }from "./routes/folderRouter.js";
import prismaService from "./services/prismaService.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

// Use the optimized global PrismaClient instance
const prisma = prismaService.getClient();

app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV,
    credentials: true
}))

app.use(
  session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 5 * 60 * 1000, // Increased from 2 minutes to reduce DB hits
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

// Graceful shutdown
const gracefulShutdown = async () => {
    await prismaService.disconnect();
    process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(PORT, ()=>{
    console.log(`Listening to port: ${PORT}`)
})