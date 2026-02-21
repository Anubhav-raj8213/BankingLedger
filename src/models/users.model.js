import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique:[true, "Email already exists"],
        trim:true,
        lowercase:true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    name:{
        type: String,
        required: [true, "Name is required"],
        trim:true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select:false,
    },
    
}, {timestamps:true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

console.log("User model loaded");

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema)
export default User;