import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the user name"]
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
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        confirmationToken: String,
        cofirmed: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: true,
    }
);

const user = mongoose.model("user", UserSchema);

export {user};