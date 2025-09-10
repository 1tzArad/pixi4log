import { Router } from "express";
import { UsersController } from "../controllers/UsersController";
import authMiddleware from "../middlewares/routes/authMiddleware";

const router = Router();

router.get("/", UsersController.getUsers);
router.get("/:identifier", UsersController.getUserByIdentifier);
router.post("/new", UsersController.createUser);
router.post("/edit", authMiddleware, UsersController.updateUser);
router.post("/delete", authMiddleware, UsersController.deleteUser);

export default {
    path: "/users",
    router: router as Router
}


