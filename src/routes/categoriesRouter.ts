import { Router } from "express";
import { CategoriesController } from "../controllers/CategoriesController";
import Logger from "../utils/Logger";

const router = Router();

router.get("/", CategoriesController.getCategories);
router.post("/new", CategoriesController.createCategory);
router.post("/edit", CategoriesController.editCategory);
router.post("/delete", CategoriesController.deleteCategory);
router.get("/:identifier", CategoriesController.getCategoryByIdentifier);

export default {
    path: "/category",
    router: router as Router
}