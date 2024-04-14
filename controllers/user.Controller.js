import { user } from '../models/product.model.js';
import bcrypt from 'bcrypt';
import passwordValidator from 'password-validator';
import validator from 'validator';
import axios from 'axios';
import router from '../routes/user.route.js';

//Function to validate email
function validateEmail(email) {
    return validator.isEmail(email);
}

// Password validation schema
const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8) // Minimum length 8 characters
  .is().max(100) // Maximum length 100 characters
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits() // Must have digits
  .has().not().spaces(); // Should not have spaces

// Resend.com API key
const RESEND_API_KEY = 're_LagABq2J_FNQu5GMLtyY8U1xZpfxs4sLm';

//Function to send an email using Resend.com
async function sendConfirmationEmail(email, confirmationToken) {
    try {
        const response = await axios.post('https://api.resend.io/v1/email/send', {
            apiKey: RESEND_API_KEY,
            subject: 'Confirm your email address',
            body: `Hi,\n\nPlease click the following link to confirm your email address: http://aeonxy.example.com/api/user/confirm/${confirmationToken}`,
            recipients: [{email}], 
        });

        if (response.data.success) {
            console.log('Email sent successfully.');
        } else{
            console.error('Failed to send email', response.data.error);
        }
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

const addUser = async (req,res) => {
    try{
        const { name, email, password, role} = req.body;

        //Check if the email is valid
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        //Check if the email already exists
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: "USer already exists" });
        }
        // Check if password meets strength requirements
        if (!passwordSchema.validate(password)) {
             return res.status(400).json({ message: "Password does not meet strength requirements" });
         }
        // Hash the password
        const encryptPassword = await bcrypt.hash(password, 10);

        // Generate confirmation token
        const confirmationToken = generateConfirmationToken();

        // Send confirmation email
        await sendConfirmationEmail(email, confirmationToken);

        //create a new user
         const newUser = new user({
            name,
            email,
            password: encryptPassword,
            confirmationToken,
            role:'user'
        }); await newUser.save();


        res.status(201).json(newUser); 
    }
    catch (error){
        res.status(500).json({message: error.message});
    }    
}

// Function to generate a confirmation token
function generateConfirmationToken () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Confirm user's email address
const confirmToken = async (req, res) => {
    try {
        const { confirmationToken } = req.params;

        // Find user by confirmation token
        const userToUpdate = await user.findOne({ confirmationToken });

        if (!userToUpdate) {
            return res.status(400).json({ message: "Invalid confirmation token" });
        }

        // Update user's email confirmation status
        userToUpdate.confirmationToken = null;
        userToUpdate.confirmed = true;
        await userToUpdate.save();

        res.status(200).json({ message: "Email confirmed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//GET USER API

const getUser = async (req,res) => {
    try{
        const User = await user.find({});
        res.status(200).json(User);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

//UPDATE USER API

const updateUser = async (req,res) => {
    try{
        const {id} = req.params;
        const particularUser = await user.findByIdAndUpdate(id,req.body)
    
        if (!particularUser) {
            return res.status(500).json({message: error.message});
        }
        const updatedUser = await user.findById(id);
        res.status(200).json(updatedUser);
        }
        catch (error) {
            res.status(500).json({error: error.message});
        }
}

const deleteUser = async (req,res) => {
    try{
        const {id} =req.params;
        const deleteUser = await user.findByIdAndDelete(id);

        if(!deleteUser) {
            return res.status(200).json({message:"USer Not Found"});
        };
    }catch (error) {
        res.status(500).json({error:error.message});
    }    
}

export default {
    addUser,
    confirmToken,
    getUser,
    updateUser,
    deleteUser,
}