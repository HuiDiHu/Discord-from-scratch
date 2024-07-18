const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const Yup = require('yup')
const pool = require('../db/connect')
const bcrypt = require('bcryptjs')

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


const register = async (req, res) => {
    const { email, username, password } = req.body;
    signupSchema.validate({ email, username, password })
    .then(async (valid) => {
        if (valid) {
            const existingUser = await pool.query(
                "SELECT email from users WHERE email=$1",
                [ email ]
            )
            if (existingUser.rowCount === 0) {
                //register
                const salt = await bcrypt.genSalt(10);
                const passhash = await bcrypt.hash(password, salt);
                //TODO: once the users table is updated (to include things like profile), update the pool.query to include them (remember to add $4, $5,...)
                const user = await pool.query(
                    "INSERT INTO users(username, email, passhash) values($1,$2,$3) RETURNING id, username, email",
                    [ username, email, passhash ]
                )
                //stores the session data which will persist
                req.session.user = { 
                    username,
                    id: user.rows[0].id 
                }
                //TODO: update this too once updated users table is implemented
                res.status(StatusCodes.CREATED).json({ loggedIn: true, user: {
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    email: user.rows[0].email,
                } })
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    loggedIn: false,
                    emailErrMsg: "Email already taken!"
                })
            }
        }
    })
    .catch((error) => {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error.errors)
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    loginSchema.validate({ email, password })
        .then(async (valid) => {
            if (valid) {
                //TODO: update this too once updated users table is implemented
                const user = await pool.query(
                    "SELECT id, email, username, passhash FROM users u WHERE u.email=$1",
                    [ email ]
                )
                if (user.rowCount > 0) {
                    const isSamePassword = await bcrypt.compare(password, user.rows[0].passhash)
                    if (isSamePassword) {
                        req.session.user = {
                            username: user.rows[0].username,
                            id: user.rows[0].id 
                        }
                        //TODO: update this too once updated users table is implemented
                        res.status(StatusCodes.OK).json({ loggedIn: true, user: {
                            id: user.rows[0].id,
                            username: user.rows[0].username,
                            email: user.rows[0].email,
                        } })
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            loggedIn: false,
                            emailErrMsg: "Invalid email or password!",
                        })
                    }
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        loggedIn: false,
                        emailErrMsg: "User doesn't exist!"
                    })
                }
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