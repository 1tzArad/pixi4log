import { Request, Response } from "express";
import { CategoriesManager } from "../managers/categoriesManager";
import Logger from "../utils/Logger";
import {Errors} from "../common/enums/Errors";

const logger = new Logger("Categories-Controller");

export class CategoriesController {
    public static async getCategories(req: Request, res: Response) {
        try {
            const response = await CategoriesManager.getCategories();
            res.status(response.status === "success" ? 200 : 400).json(response);
        } catch {
            res.status(500).json({ status: "error", error: { message: "Internal server error" } });
        }
    }

    public static async createCategory(req: Request, res: Response) {
        const { name, fancyName, icon } = req.body;
        if (!name || !fancyName || !icon) {
            return res.status(400).json({ status: "error", error: { message: "name, fancyName and icon are required" } });
        }
        const response = await CategoriesManager.createCategory(name, fancyName, icon);
        res.status(response.status === "success" ? 201 : 400).json(response);
    }

    public static async editCategory(req: Request, res: Response) {
        const { identifier, newData } = req.body

        if (!identifier || typeof newData !== "object") {
            return res.status(400).json({ status: "error", error: { message: "identifier and newData are required" } });
        }

        logger.debug(`Edit identifier: ${JSON.stringify(identifier)}, newData: ${JSON.stringify(newData)}`);

        let response;
        if ("uuid" in identifier) {
            response = await CategoriesManager.editCategoryByUUID(identifier.uuid, newData);
        } else if ("name" in identifier) {
            response = await CategoriesManager.editCategoryByName(identifier.name, newData);
        } else if ("post" in identifier) {
            try {
                const category = await CategoriesManager.findCategoryOrFail({ post: identifier.post });
                response = await CategoriesManager.editCategory(category, newData);
            } catch (e) {
                response = { status: "error", error: { message: "Category not found for given post" } };
            }
        } else {
            return res.status(400).json({ status: "error", error: { message: "Invalid identifier" } });
        }

        res.status(response.status === "success" ? 200 : 400).json(response);
    }

    public static async deleteCategory(req: Request, res: Response) {
        const identifier = req.body.identifier;

        if (!identifier) {
            return res.status(400).json({ status: "error", error: { message: "identifier is required" } });
        }

        logger.debug(`Delete identifier: ${JSON.stringify(identifier)}`);

        let response;
        if ("uuid" in identifier) {
            response = await CategoriesManager.deleteCategoryByUUID(identifier.uuid);
        } else if ("name" in identifier) {
            response = await CategoriesManager.deleteCategoryByName(identifier.name);
        } else if ("post" in identifier) {
            try {
                const category = await CategoriesManager.findCategoryOrFail({ post: identifier.post });
                response = await CategoriesManager.deleteCategory(category);
            } catch (e) {
                response = { status: "error", error: { message: "Category not found for given post" } };
            }
        } else {
            return res.status(400).json({ status: "error", error: { message: "Invalid identifier" } });
        }

        res.status(response.status === "success" ? 200 : 400).json(response);
    }

    public static async getCategoryByIdentifier(req: Request, res: Response) {
        try {
            const { identifier } = req.params;
            let category;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (uuidRegex.test(identifier)) {
                category = await CategoriesManager.findCategory({ uuid: identifier });
            } else {
                category = await CategoriesManager.findCategory({ name: identifier });
            }

            if (!category) {
                return res.status(404).json({ status: "error", error: { type: Errors.NOTFOUND, message: "Category not found." } });
            }

            return res.json({ status: "success", data: category });
        } catch (error) {
            return res.status(500).json({ status: "error", error: { type: Errors.SERVERERROR, message: "Internal server error." } });
        }
    }
}
