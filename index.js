import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'


import postRoutes from './routes/post.js'
import authRoutes from './routes/auth.js'

const app = express();
dotenv.config();


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/auth', authRoutes);
app.use('/posts',postRoutes);
app.get('/',(req, res)=>{
  res.send('APP is Running')
})
// MongoDb cloud connection

const PORT = process.env.PORT || 5000;

const options = {
  maxPoolSize: 10, // Maintain  up to 10 Socket connections.
  serverSelectionTimeoutMs: 60000, //Keep Trying to send operations for 60s.
  socketTimeoutMs: 120000, //Close Socket after 120s of inactivity.
  useNewUrlParser: true // it is deprecated to avoid unnecessory warnings
};

mongoose
  .connect(process.env.CONNECTION_URL, options)
  .then(() => app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`)))
  .catch((err) => console.log(err));

