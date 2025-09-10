import { Router } from "express";
import { PostsController } from "../controllers/PostsController";
import Logger from "../utils/Logger";
import authMiddleware from "../middlewares/routes/authMiddleware";

const router = Router();

router.get("/", PostsController.getPosts);
router.get("/:identifier", PostsController.getPostByIdentifier);
router.post("/new", authMiddleware, PostsController.createPost);
router.post("/edit", authMiddleware, PostsController.editPost);
router.post("/delete", authMiddleware, PostsController.deletePost);
router.post("/category/change", authMiddleware, PostsController.changePostCategory);

export default {
    path: "/posts",
    router: router as Router
}
