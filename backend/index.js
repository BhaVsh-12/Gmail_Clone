import express from "express"; // react style
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import emailRoute from "./routes/email.route.js";

dotenv.config({});
connectDB();
const PORT = process.env.PORT || 8080;
const app = express();

// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'https://gmail-clone-sandy.vercel.app'];
      if (allowedOrigins.includes(origin) || !origin) { // Allow requests with no origin (like mobile apps)
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  
app.use(cors(corsOptions));

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/email", emailRoute);

app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`);
});