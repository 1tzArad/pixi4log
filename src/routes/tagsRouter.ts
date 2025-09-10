import { Router } from "express";
import { TagsController } from "../controllers/TagsController";
import Logger from "../utils/Logger";
import authMiddleware from "../middlewares/routes/authMiddleware";

const router = Router();

router.get("/", TagsController.getTags);
router.post("/new", authMiddleware, TagsController.createTag);
router.post("/edit", authMiddleware, TagsController.editTag);
router.post("/delete", authMiddleware, TagsController.deleteTag);
router.get("/:identifier", TagsController.getTagByIdentifier);

export default {
    path: "/tags",
    router: router as Router
}