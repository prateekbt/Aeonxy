import { Course } from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import isAdmin from '../middleware/isAdmin.js';
const getCourses = async (req, res) => {
    try {
        const { category, level, popularity, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (level) filter.level = level;
        if (popularity) filter.popularity = { $gte: parseInt(popularity) };

        const skip = (page - 1) * limit;

        const courses = await Course.find(filter)
            .sort({ popularity: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await Course.countDocuments(filter);

        res.status(200).json({
            totalCourses: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            courses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Controller function to create a new course
const createCourse = async (req, res) => {
    try {
        // Check if the user is an admin
        isAdmin(req, res, async () => { 
            // Logic for creating a new course
            const { title, category, level } = req.body;

            // Create a new course instance
            const newCourse = new Course({
                title,
                category,
                level
            });

            // Save the new course to the database
            const savedCourse = await newCourse.save();

            // Respond with the created course
            res.status(201).json(savedCourse);
        });
    } catch (error) {
        // Error handling
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update an existing course
const updateCourse = async (req, res) => {
    try {
        // Check if the user is an admin
        isAdmin(req, res, async () => {
            // Logic for updating a course
            const { id } = req.params;
            const { title, category, level } = req.body;

            // Find the course by ID and update it
            const updatedCourse = await Course.findByIdAndUpdate(id, {
                title,
                category,
                level
            }, { new: true });

            // If the course is not found, return a 404 error
            if (!updatedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Respond with the updated course
            res.status(200).json(updatedCourse);
        });
    } catch (error) {
        // Error handling
        res.status(500).json({ message: error.message });
    }
};

// Controller function to delete an existing course
const deleteCourse = async (req, res) => {
    try {
        // Check if the user is an admin
        isAdmin(req, res, async () => {
            // Logic for deleting a course
            const { id } = req.params;

            // Find the course by ID and delete it
            const deletedCourse = await Course.findByIdAndDelete(id);

            // If the course is not found, return a 404 error
            if (!deletedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Respond with a success message
            res.status(200).json({ message: 'Course deleted successfully' });
        });
    } catch (error) {
        // Error handling
        res.status(500).json({ message: error.message });
    }
};

// Controller function to enroll in a course
const enrollCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'User is already enrolled in the course' });
        }

        // Create a new enrollment record
        const newEnrollment = new Enrollment({ userId, courseId });
        await newEnrollment.save();

        res.status(201).json(newEnrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export default { getCourses, createCourse, updateCourse, deleteCourse, enrollCourse};
