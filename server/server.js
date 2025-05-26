import dotenv from 'dotenv';

dotenv.config();

import reviewsRouter from './routes/reviews.routes.js'
import authRouter from './routes/auth.routes.js'
import profileRouter from './routes/profile.routes.js'
import express from 'express';
import cors from 'cors'; 


const PORT = process.env.PORT || 3001;
const app = express(); 

app.use(cors());
app.use(express.json())
app.use('/reviews', reviewsRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`Сервер прослуховується на порті ${PORT}`);
})