import { body } from "express-validator"
import { validateRequest } from "../configs/validateRequest"


const validateUserName = [
    body('firstname').trim().notEmpty().withMessage("First name cannot be empty.").bail()
    .isLength({min: 4, max: 16}).withMessage("First name length to be between 4 and 16.")
    .escape(),
    body("lastname").trim().notEmpty().withMessage("Last name cannot be empty.").bail()
    .isLength({min: 4, max: 16}).withMessage("Last name length to be between 4 and 16.")
    .escape(),
]

const validateUserCredentials = [
    body("username").trim().notEmpty().withMessage("Username cannot be empty.").bail()
    .isLength({min: 4, max: 16}).withMessage("Username length to be between 4 and 16.")
    .escape(),
    body("password").trim().notEmpty().withMessage("Password cannot be empty").bail()
    .isLength({min: 8 }).withMessage("Password length to be between 8 and 16.")
    .escape()
]

export const registerUser= [
    validateUserName, validateUserCredentials,
    validateRequest,
]

export const loginUser = [validateUserCredentials, validateRequest]