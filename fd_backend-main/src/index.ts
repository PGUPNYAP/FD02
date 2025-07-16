import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
// import studentRoutes from './routes/studentRoutes';
import libraryRouter from './routes/libraryRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());


app.get('/', (req, res) => {
  res.json({ message: 'Focus Desk Backend Running' });
});

// app.use('/api/students', studentRoutes);
app.use('/api/library',libraryRouter)

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
