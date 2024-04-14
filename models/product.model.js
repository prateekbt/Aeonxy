import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the user name"],
        },

        email:{
            type: String,
            required: true,
            unique: true,
        },

        password:{
            type: String,
            required: true,
        
        },
        profilePicture: {
            type: String,
        },
    }, 
    {
        timestamps: true,
    }
);

const user = mongoose.model("user", UserSchema);

export {user};