// enrollment.route.js
import express from 'express';
import enrollmentController from '../controllers/enrollment.Controller.js';

const router = express.Router();

// Route to enroll a user in a course
router.post('/courses/:courseId/enroll', enrollmentController.enrollUserInCourse);

export default router;
