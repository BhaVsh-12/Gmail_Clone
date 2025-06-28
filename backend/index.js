import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import emailRoute from "./routes/email.route.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8080;
const app = express();


app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5174', 'https://gmail-clone-sandy.vercel.app'];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  
};

app.use(cors(corsOptions));


app.use("/api/v1/user", userRoute);
app.use("/api/v1/email", emailRoute);


app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
