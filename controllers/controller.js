// import
const User = require("../models/User");
const Todolist = require("../models/Todolist");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// controllers
    // get

module.exports.welcome_get = (req, res) => {
    // try to connect to welcome page
    if (req.cookies) {
        res.redirect("/:user");
    } else {
        res.render("welcome", { email : undefined });
    }
}

module.exports.home_get = async (req, res) => {
    // try to connect to homepage
    if (req.cookies) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("home", { email : decoded.email });
    } else {
        res.render("home", { email : undefined });
    }
}

// try to connect to login page
module.exports.login_get = (req, res) => {
    if (req.cookies) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("login", { email : decoded.email });
    } else {
        res.render("login", { email : undefined });
    }
}

// try to connect to signup page
module.exports.signup_get = (req, res) => {
    if (req.cookies) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("signup", { email : decoded.email });
    } else {
        res.render("signup", { email : undefined });
    }
}

module.exports.veileder_get = (req, res) => {
    if (req.cookies) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("veileder", { email : decoded.email });
    } else {
        res.render("veileder", { email : undefined });
    }
}

   // post
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    // try signup
    try {
        const user = await User.create({ email, password });
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
    const { message } = req.body;

    try {
        const jwt = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        const todo = Todolist.create({ author : decoded.email, message });
        res.status(201).json({ todo });
    } catch (err) {
        res.status(500).json({ error : err });
    }
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
    const todoList = await TodoList.find({filter}).sort({ createdAt : -1 });
    // returns pokomons
    return todoList;
}