import express from "express";
import connectDB from "./config/database.js"
import dotenv from "dotenv";
import QuestionRouter from "./routes/QuestionsRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", QuestionRouter);
connectDB()

app.listen(process.env.PORT, ()=>{
   console.log("server is active");
});

