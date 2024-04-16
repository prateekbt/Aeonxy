// enrollment.controller.js
import Enrollment from '../models/enrollment.model.js';
import axios from 'axios'; // Import axios for sending emails

const enrollUserInCourse = async (req, res) => {
    try {
        const { userId } = req.body;
        const courseId = req.params.courseId;

        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });

        if (existingEnrollment) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }

        // Create a new enrollment
        const newEnrollment = new Enrollment({
            userId,
            courseId,
        });
        await newEnrollment.save();

        // Send confirmation email using Resend.com
        await sendConfirmationEmail(req.body.email, `You have successfully enrolled in the course with ID: ${courseId}`);

        res.status(201).json({ message: "User enrolled in the course successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Function to send confirmation email using Resend.com
const sendConfirmationEmail = async (email, message) => {
    try {
        const RESEND_API_KEY = 're_LagABq2J_FNQu5GMLtyY8U1xZpfxs4sLm'; // Replace with your Resend.com API key

        const response = await axios.post('https://api.resend.io/v1/email/send', {
            apiKey: RESEND_API_KEY,
            subject: 'Course Enrollment Confirmation',
            body: message,
            recipients: [{ email }],
        });

        if (response.data.success) {
            console.log('Email sent successfully.');
        } else {
            console.error('Failed to send email', response.data.error);
        }
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

export default {
    enrollUserInCourse,
}
