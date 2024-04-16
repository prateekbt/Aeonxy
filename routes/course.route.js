import express from 'express';
import CourseController from '../controllers/course.Controller.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse, enrollCourse } = CourseController;

router.get('/',getCourses);

router.post('/',isAdmin,createCourse);

router.put('/:id',isAdmin,updateCourse);

router.delete('/:id',isAdmin,deleteCourse);

router.post('/enroll',enrollCourse);

export default router;
