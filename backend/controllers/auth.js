const { StatusCodes } = require('http-status-codes')
const pool = require('../db/connect')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { jwtSign, jwtVerify, getJwt } = require('./jwt/jwtAuth')
const redisClient = require('../redis')

const register = async (req, res) => {
    const { email, username, password } = req.body;
    const existingUser = await pool.query(
        "SELECT email from USERS WHERE email=$1",
        [email]
    )
    if (existingUser.rowCount === 0) {
        //register
        const salt = await bcrypt.genSalt(10);
        const passhash = await bcrypt.hash(password, salt);
        const user = await pool.query(
            "INSERT INTO USERS(username, email, passhash, userid) values($1,$2,$3,$4) RETURNING id, username, email, userid, profilePicture",
            [username, email, passhash, uuidv4()]
        );
        const userData = {
            id: user.rows[0].id,
            username: user.rows[0].username,
            email,
            profile: user.rows[0].profilepicture ? user.rows[0].profilepicture.toString('base64') : "",
            userid: user.rows[0].userid
        }
        const {profile, ...userDataWithoutProfile} = userData;
        jwtSign(
            {
                ...userDataWithoutProfile
            },
            process.env.JWT_SECRET,
            { expiresIn: "14d" }
        ).then(token => {
            res.status(StatusCodes.OK).json({ loggedIn: true, ...userData, token })
        }).catch(error => {
            console.log(error);
            res.status(StatusCodes.OK).json({
                loggedIn: false,
                status: "Something went wrong, please try again later."
            })
        });
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({
            loggedIn: false,
            emailErrMsg: "Email already taken!"
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await pool.query(
        "SELECT * FROM USERS u WHERE u.email=$1",
        [email]
    )
    if (user.rowCount > 0) {
        const isSamePassword = await bcrypt.compare(password, user.rows[0].passhash)
        if (isSamePassword) {
            const userData = {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email,
                profile: user.rows[0].profilepicture ? user.rows[0].profilepicture.toString('base64') : "",
                userid: user.rows[0].userid
            }
            const {profile, ...userDataWithoutProfile} = userData;
            jwtSign(
                {
                    ...userDataWithoutProfile
                },
                process.env.JWT_SECRET,
                { expiresIn: "14d" }
            ).then(token => {
                res.status(StatusCodes.OK).json({ loggedIn: true, ...userData , token })
            }).catch(error => {
                console.log(error);
                res.status(StatusCodes.OK).json({
                    loggedIn: false,
                    status: "Something went wrong, please try again later."
                })
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                loggedIn: false,
                emailErrMsg: "Invalid email or password!",
            })
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({
            loggedIn: false,
            emailErrMsg: "Invalid email or password!",
        })
    }
}

const verifyLogin = async (req, res) => {
    const token = getJwt(req);
    if (!token || token === 'null') {
        res.status(StatusCodes.OK).json({ loggedIn: false });
        return;
    }
    jwtVerify(token, process.env.JWT_SECRET)
        .then(async (decoded) => {
            const profile_picture = await redisClient.hget(
                `user:${decoded.userid}`,
                'profile'
            )
            res.status(StatusCodes.OK).json({ loggedIn: true, ...decoded, profile: profile_picture, token });
        })
        .catch(error => {
            //console.log(error)
            res.status(StatusCodes.OK).json({ loggedIn: false });
        })
}

module.exports = {
    register,
    login,
    verifyLogin
}