import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { allMessages, sendMessage, deleteMessage, clearChat } from "../controllers/messageController.js";

const router = express.Router();

router.route("/:chatId").get(isLoggedIn, allMessages);
router.route("/").post(isLoggedIn, sendMessage);
router.route("/clear/:chatId").delete(isLoggedIn, clearChat);
router.route("/:messageId").delete(isLoggedIn, deleteMessage);

export default router;
