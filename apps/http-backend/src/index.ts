import express from "express";
import authRouter from "./routes/auth";
import authMiddleware from "./middleware/authMiddleware";
import roomRouter from "./routes/room";
import chatRouter from "./routes/chat";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin : "*",
    credentials: true,
  })
)
app.use(cookieParser());
app.use(express.json());


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/rooms", authMiddleware, roomRouter);
app.use("/api/v1/chat", authMiddleware, chatRouter);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
