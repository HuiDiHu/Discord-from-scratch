const Yup = require('yup')
const { StatusCodes } = require('http-status-codes')

const loginSchema = Yup.object({
    email: Yup.string()
        .required("Email is required!")
        .min(6, "Email too short!")
        .max(28, "Email too long!"),
    password: Yup.string()
        .required("Password is required!")
        .min(6, "Password too short!")
        .max(28, "Password too long!")
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
        .max(28, "Password too long!")
});

const validateForm = (formType) => (req, res, next) => {
    const { email, username, password } = req.body;
    if (formType === 'register') {
        signupSchema.validate({ email, username, password })
            .then((valid) => {
                if (valid) {
                    next()
                } else {
                    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send("Invalid form")
                }
            })
            .catch((error) => {
                res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error.errors)
            })
    } else {
        loginSchema.validate({ email, password })
            .then((valid) => {
                if (valid) {
                    next()
                } else {
                    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send("Invalid form")
                }
            })
            .catch((error) => {
                res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error.errors)
            })
    }
}

module.exports = validateForm