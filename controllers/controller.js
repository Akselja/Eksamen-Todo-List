// import
const User = require("../models/User");
const TodoList = require("../models/Todolist");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { ObjectId } = require("bson");
 
// controllers
    // get

module.exports.welcome_get = (req, res) => {
    // try to connect to welcome page
    if (req.cookies.jwt !== undefined) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.redirect("/" + decoded.email);
    } else {
        res.render("welcome", { email : undefined, admin : undefined });
    }
}

module.exports.home_get = async (req, res) => {
    // try to connect to homepage
    if (req.params.user) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);

        // gets todo list
        const todoList = getTodos(decoded.email);

        res.render("home", { email : decoded.email, admin : decoded.admin, todoList });

    } else if (req.cookies.jwt !== undefined) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.redirect("/" + decoded.email);
    } else {
        res.redirect("/");
    }
}

// try to connect to login page
module.exports.login_get = (req, res) => {
    if (req.cookies.jwt !== undefined) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("login", { email : decoded.email, admin : decoded.admin });
    } else {
        res.render("login", { email : undefined, admin : undefined });
    }
}

// try to connect to signup page
module.exports.signup_get = (req, res) => {
    if (req.cookies.jwt !== undefined) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("signup", { email : decoded.email, admin : decoded.admin });
    } else {
        res.render("signup", { email : undefined, admin : undefined });
    }
}

module.exports.veileder_get = (req, res) => {
    if (req.cookies.jwt !== undefined) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);

        // authorization
        if (decoded.admin === true) {

            res.render("veileder", { email : decoded.email, admin : decoded.admin });
        } else {
            res.status(401).json({ message : "Unauthorized" });
        }
    } else {
        res.status(401).json({ message : "Unauthorized" });
    }
}

module.exports.logout_get = (req, res) => {
    if (req.cookies.jwt !== undefined) {
        const token = createJWT("", "");
        res.status(200).cookie("jwt", token, {maxAge : 1, httpOnly : true}).redirect("/");
    } else {
        res.status(400);
    }
}

module.exports.todoList_get = async (req, res) => {
    if (req.cookies.jwt !== undefined) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);

        const todoList = await getTodos(decoded.email); // gets todolist for updating the frontend

        res.status(200).json({ todoList });
    } else {
        res.status(500);
    }
    
}

   // post
module.exports.signup_post = async (req, res) => {
    const { email, password, retry } = req.body;
    // try signup
    try {    
        if (password === retry) { // checks if password matches repeat password
            const user = await User.create({ email, password, admin : false });
            const token = createJWT(user.email, user.admin);
            if(user) {
                res.status(201).cookie("jwt", token, {maxAge : 604800000, httpOnly : true}).json({ result : "Success" });
            }
        } else {
            res.status(400).json({ error : "Passwords must match" });
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
        const token = createJWT(user.email, user.admin);
        if(user) {
            res.status(200).cookie("jwt", token, {maxAge : 604800000, httpOnly : true}).json({ result : "Success" });
        }
    } catch (err) {
        res.status(400).json({ errors : err.toString() });
    }
}

module.exports.todo_post = async (req, res) => {
    const { message } = req.body;

    // try adding and updating todos
    try {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        const todo = await TodoList.create({ author : decoded.email, message });

        res.status(201).json({ newEntry : todo });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error : err });
    }
}

module.exports.delete_post = async (req, res) => {
    const { id } = req.body;

    if (req.cookies.jwt !== undefined) {
        try {
            // convert id string to ObjectId type object
            const _id = new ObjectId(id);

            // finding selected entry for authorizing
            const emailAuth = await TodoList.findOne({ _id });

            // authorize
            const cookie = req.cookies.jwt;
            const decoded = jwt.verify(cookie, process.env.secretKey)
            if(emailAuth.author === decoded.email) {

                // delete selected entry
                const deletedTodo = await TodoList.findOneAndDelete({ _id });
                res.status(200).json({ deletedTodo });
            } else {
                res.status(401).json({ message : "Unauthorized" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message : "Internal Server Error", err : "Error: " + err });
        }
    } else {
        res.status(401).json({ message : "Unauthorized" });
    }

}

   // 404
module.exports.error404 = (req, res) => {
    if (req.cookies.jwt !== undefined) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("404", { email : decoded.email, admin : decoded.admin });
    } else {
        res.render("404", { email : undefined, admin : undefined });
    }
}



// JWT creation
const createJWT = (email, admin) => {
    const secretKey = process.env.secretKey;
    const payload = {
        email,
        admin
    }
    const newToken = jwt.sign(payload, secretKey, {
        algorithm : "HS256",
        expiresIn : "7d"
    })

    return newToken;
}

const getTodos = async (filter) => {
    // gets list and sorts it
    const todoList = await TodoList.find({ author : filter }).sort({ createdAt : -1 });
    // returns list
    return todoList;
}