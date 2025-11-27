import express from "express";
import connectDB from "./config/database.js"
import dotenv from "dotenv";
import cors from "cors"
import QuestionRouter from "./routes/QuestionsRoutes.js";
dotenv.config();

const app = express();


const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", QuestionRouter);
connectDB()

app.listen(process.env.PORT, ()=>{
   console.log("server is active");
});

