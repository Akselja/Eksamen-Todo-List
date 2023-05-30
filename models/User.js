// imports
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "Username is required"],
        unique : [true, "Username must be unique"]
    },
    email : {
        type : String,
        required : [true, "Email is reqiured"],
        unique : [true, "Email must be unique"],
        lowercase : true,
        validate :  [isEmail, "Email must be valid"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [8, "Password must be at least 8 characters long"]
    }
});

// encrytion
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user) {
        console.log(password, user.password)
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        } else {
            // error message
            throw new Error("incorrect password");
        }
    } else {
        // error message
        throw new Error("incorrect email");
    }
    
}   

const User = mongoose.model("user", userSchema);

module.exports = User;