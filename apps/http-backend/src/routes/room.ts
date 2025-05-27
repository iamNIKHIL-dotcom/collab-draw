import express, { Router } from "express";
import { createRoom, getRoom, getAllRooms, joinRoom } from "../controllers/room";
import authMiddleware from "../middleware/authMiddleware";

const router: Router = express.Router();

router.get("/", getAllRooms);
router.post("/create-room", createRoom);
router.get("/:slug", getRoom);

router.post("/join", authMiddleware, joinRoom);

export default router;
