// import
const User = require("../models/User");
const Todolist = require("../models/Todolist");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// multer
const storage = multer.memoryStorage();

// controllers
    // get
module.exports.home_get = async (req, res) => {
    // try to connect to homepage
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("home", { pokomonList, email : decoded.email });
    } else {
        res.render("home", { pokomonList, email : undefined });
    }
}

// try to connect to login page
module.exports.login_get = (req, res) => {
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("login", { email : decoded.email });
    } else {
        res.render("login", { email : undefined });
    }
}

// try to connect to signup page
module.exports.signup_get = (req, res) => {
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("signup", { email : decoded.email });
    } else {
        res.render("signup", { email : undefined });
    }
}

module.exports.pokomonPost_get = (req, res) => {
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("pokomon", { email : decoded.email });
    } else {
        res.render("pokomon", { email : undefined });
    }
}

   // post
module.exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    // try signup
    try {
        const user = await User.create({ username, email, password });
        const token = createJWT(user.email);
        if(user) {
            res.status(201).cookie("jwt", token, {maxAge : 604800000, httpOnly : true}).redirect("/");
        }   
    } catch (err) {
        console.log(err);
        res.status(400).json({ error : err });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    // try login
    try {
        const user = await User.login( email, password );
        console.log(user);
        const token = createJWT(user.email);
        console.log(token);
        if(user) {
            res.status(200).cookie("jwt", token, {maxAge : 604800000, httpOnly : true}).redirect("/");
        }
    } catch (err) {
        res.status(400).json({ error : err });
    }
}

module.exports.todo_post = (req, res) => {
    
}


   // 404
module.exports.error404 = (req, res) => {
   res.render("404");
}

// JWT creation
const createJWT = (email) => {
    const secretKey = process.env.secretKey;
    const payload = {
        email
    }
    const newToken = jwt.sign(payload, secretKey, {
        algorithm : "HS256",
        expiresIn : "7d"
    })

    return newToken;
}

const getPokomons = async (filter) => {
    // gets pokomons and sorts them
    const pokomonList = await Chinpokomon.find({filter}).sort({ createdAt : -1 });
    // returns pokomons
    return pokomonList;
}