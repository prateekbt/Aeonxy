
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req,res) => {
    res.status(200).json({message:"Hell Yeah"});
    console.log("hahahha got you");
});

app.listen(port,() =>{
    console.log(`Listening @ ${port}`);
});