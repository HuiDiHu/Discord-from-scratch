const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const Yup = require('yup')

const loginSchema = Yup.object({
    email: Yup.string()
        .required("Email is required!")
        .min(6, "Email too short!")
        .max(28, "Email too long!"),
    password: Yup.string()
        .required("Password is required!")
        .min(6, "Password too short!")
        .max(28, "Password too long!"),
});

const signupSchema = Yup.object({
    email: Yup.string()
        .required("Email is required!")
        .min(6, "Email too short!")
        .max(28, "Email too long!"),
    username: Yup.string()
        .required("Username is required!")
        .min(6, "Username too short!")
        .max(28, "Username too long!"),
    password: Yup.string()
        .required("Password is required!")
        .min(6, "Password too short!")
        .max(28, "Password too long!"),
});


const register = async (req, res) => {
    const formData = req.body;
    signupSchema.validate(formData)
        .then((valid) => {
            if (valid) {
                res.status(StatusCodes.OK).send('User Signed up!')
            }
        })
        .catch((error) => {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error.errors)
        })
}

const login = async (req, res) => {
    const formData = req.body;
    loginSchema.validate(formData)
        .then((valid) => {
            if (valid) {
                res.status(StatusCodes.OK).send('User logged in!')
            }
        })
        .catch((error) => {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error.errors)
        })
}

module.exports = {
    register,
    login
}