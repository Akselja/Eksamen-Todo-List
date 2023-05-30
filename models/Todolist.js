// imports
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    author : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true,
    }
}, { timestamps : true }); 

const TodoList = mongoose.model("todo", todoSchema);

module.exports = TodoList;