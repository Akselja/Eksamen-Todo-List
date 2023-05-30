// imports
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "Email must be unique"],
        lowercase : true,
        validate :  [isEmail, "Email must be valid"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [8, "Password must be at least 8 characters long"]
    },
    admin : {
        type : Boolean,
        required : true,
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
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        } else {
            // error message
            throw new Error("Incorrect password");
        }
    } else {
        // error message
        throw new Error("Incorrect email");
    }
    
}   

const User = mongoose.model("user", userSchema);

module.exports = User;