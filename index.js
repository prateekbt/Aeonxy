import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';
import courseRoute from './routes/course.route.js';

const app = express();
const port = 3000;


// middleware
app.use(express.json());

//Routes
app.use('/api/user/register',userRoute);

app.use('/api/courses', courseRoute);

app.get('/', (req,res) => {
    res.status(200).json({message:"YUUUHUUUUUU"});
});

mongoose.connect('mongodb+srv://prateekbt:WwSAXC4470tI6jkp@userbackend.fv8dvno.mongodb.net/?retryWrites=true&w=majority&appName=UserBackend')
.then(() => {
    console.log('Connected!');
    app.listen(port, () =>{
    console.log(`Listening @ ${port}`);
            });
})
.catch(() => {
    console.log('Failed');
})
    