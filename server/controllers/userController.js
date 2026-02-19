import { body } from "express-validator"
import { validateRequest } from "../configs/validateRequest.js"
import { hash } from "bcryptjs"
import prismaService from "../services/prismaService.js";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuid } from "uuid"
import passport from "../configs/passsportLocalConfigs.js";

import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = prismaService.getClient();

const validateUserName = [
    body('firstname').trim().notEmpty().withMessage("First name cannot be empty.").bail()
        .isLength({ min: 4, max: 16 }).withMessage("First name length to be between 4 and 16.")
        .escape(),
    body("lastname").trim().notEmpty().withMessage("Last name cannot be empty.").bail()
        .isLength({ min: 4, max: 16 }).withMessage("Last name length to be between 4 and 16.")
        .escape(),
]

const validateUserCredentials = [
    body("username").trim().notEmpty().withMessage("Username cannot be empty.").bail()
        .isLength({ min: 4, max: 16 }).withMessage("Username length to be between 4 and 16.")
        .escape(),
    body("password").trim().notEmpty().withMessage("Password cannot be empty").bail()
        .isLength({ min: 8, max: 128 }).withMessage("Password length to be between 8 and 128.")
        .escape()
]

function getChangedFields(existing, incoming) {
    const changes = {};
    for (const key in incoming) {
        if (incoming[key] !== existing[key]) {
            changes[key] = incoming[key];
        }
    }
    return changes;
}

export const registerUser = [
    validateUserName, validateUserCredentials,
    validateRequest, expressAsyncHandler(async (req, res) => {
        const { firstname, lastname, username, password } = req.body
        
        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username: username }
        });

        if (existingUser) {
            return res.status(400).json({
                err: [{
                    msg: "Username already exists"
                }]
            });
        }

        const hashedPass = await hash(password, 8);
        const createdUser = await prisma.user.create({
            data: {
                id: uuid(),
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: hashedPass
            }
        })
        const { id, username: uname, firstname: fname, lastname: lname, createdAt } = createdUser;
        res.status(200).json({
            user: {
                id,
                username: uname,
                firstname: fname,
                lastname: lname,
                createdAt
            }
        })
    })
]

export const loginUser = [(req, res, next) => {
    console.log("Login endpoint hit at:", new Date().toISOString());
    next();
  }, validateUserCredentials, validateRequest,
    expressAsyncHandler(async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ err: [info] });

            req.logIn(user, (err) => {
                if (err) return next(err);
                const { id, username: uname, firstname: fname, lastname: lname, createdAt } = user;
                res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id,
                        username: uname,
                        firstname: fname,
                        lastname: lname,
                        createdAt
                    }
                });
            });
        })(req, res, next);
    })
]

export const logoutUser = expressAsyncHandler((req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout(function (err) {
            if (err) {
                return res.status(500).json({ message: 'Logout failed', error: err.message });
            }

            req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.status(200).json({ message: 'Logout successful' });
            });
        });
    }else{
        res.status(401).json({ message: 'User is not authenticated' });
    }
})

export const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            message: "User authenticated"
        })
    }
    res.status(401).json({
        message: "User is not authenticated"
    })
}

export const getCurrentUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        const { id, username: uname, firstname: fname, lastname: lname, createdAt } = req.user;
        return res.status(200).json({
            user: {
                id,
                username: uname,
                firstname: fname,
                lastname: lname,
                createdAt
            }
        })
    }
    res.status(401).json({
        message: "User is not authenticated"
    })
}

export const updateUser = [
    validateUserName, validateUserCredentials, validateRequest,
    expressAsyncHandler(async (req, res) => {
        const existingUser = await prisma.user.findUnique({
            where: { id: req.body.id }
        });
        if (!existingUser) {
            return res.status(400).json({
                err: {
                    msg: "No such user exists."
                }
            })
        }
        const changes = getChangedFields(existingUser, req.body)
        let updatedUser;
        if (Object.keys(changes).length > 0) {
            updatedUser = await prisma.user.update({
                where: { id: req.body.id },
                data: changes
            });
        }
        if (updatedUser) {
            const { id, username: uname, firstname: fname, lastname: lname, createdAt } = updatedUser;
            res.status(200).json({
                user: {
                    id,
                    username: uname,
                    firstname: fname,
                    lastname: lname,
                    createdAt
                }
            })
        } else {
            res.status(200).json({ user: null })
        }
    })
]

export const deleteUser = expressAsyncHandler(async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.body.id
        }
    })
    res.status(200).json({ deleted: true })
})
