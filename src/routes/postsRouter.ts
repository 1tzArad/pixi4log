import { Router } from "express";
import { PostsController } from "../controllers/PostsController";
import Logger from "../utils/Logger";

const router = Router();

router.get("/", PostsController.getPosts);
router.get("/:identifier", PostsController.getPostByIdentifier);
router.post("/new", PostsController.createPost);
router.post("/edit", PostsController.editPost);
router.post("/delete", PostsController.deletePost);
router.post("/category/change", PostsController.changePostCategory);

export default {
    path: "/posts",
    router: router as Router
}
