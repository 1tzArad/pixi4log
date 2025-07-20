import { Router } from "express";
import { TagsController } from "../controllers/TagsController";
import Logger from "../utils/Logger";

const router = Router();

router.get("/", TagsController.getTags);
router.post("/new", TagsController.createTag);
router.post("/edit", TagsController.editTag);
router.post("/delete", TagsController.deleteTag);
router.get("/:identifier", TagsController.getTagByIdentifier);

export default {
    path: "/tags",
    router: router as Router
}