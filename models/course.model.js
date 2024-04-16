import mongoose from 'mongoose';

const CourseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            required: true
        },
        popularity: {
            type: Number,
            default: 0
        },
        // You can add more fields as needed
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model("Course", CourseSchema);

export { Course };