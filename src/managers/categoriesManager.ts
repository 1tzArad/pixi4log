import {EntityNotFoundError, Repository} from "typeorm";
import {Categories} from "../database/entity/Categories";
import {dataSource} from "../database/dataSource";
import {Response} from "../common/interfaces/response/Response";
import {Errors} from "../common/enums/Errors";
import {Posts} from "../database/entity/Posts";
import Logger from "../utils/Logger";
import logger from "../utils/Logger";

type CategoriesIdentifier = { uuid: string } | { name: string } | { post: Posts }
export class CategoriesManager {
    private static CategoriesRepository = dataSource.getRepository(Categories);
    private static logger = new Logger("Categories-Manager");

    public static async createCategory(name: string, fancyName: string, icon: string): Promise<Response> {
        this.logger.debug(`createCategory called with name=${name}`);
        if (await this.findCategory({ name })) {
            this.logger.debug(`Category with name=${name} already exists`);
            return { status: "error", error: { type: Errors.EXISTS, message: "this category name already exists." } };
        }
        const category = new Categories();
        category.fancyName = fancyName;
        category.icon = icon;
        category.name = name;
        await this.CategoriesRepository.save(category);
        this.logger.debug(`Category created: name=${name}`);
        return { status: 'success', message: "Category Created Successfully!" };
    }

    public static async editCategoryByName(categoryName: string, newData: Partial<Categories>): Promise<Response> {
        this.logger.debug(`editCategoryByName called with categoryName=${categoryName}`);
        try {
            const category = await this.findCategoryOrFail({ name: categoryName });
            await this.CategoriesRepository.save({ ...category, ...newData });
            this.logger.debug(`Category updated by name: ${categoryName}`);
            return { status: 'success', message: "Category has been updated successfully" };
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                this.logger.debug(`Category not found by name: ${categoryName}`);
                return { status: "error", error: { type: Errors.NOTFOUND, message: "Category Not Found!" } };
            }
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async editCategoryByUUID(uuid: string, newData: Partial<Categories>): Promise<Response> {
        this.logger.debug(`editCategoryByUUID called with uuid=${uuid}`);
        try {
            const category = await this.CategoriesRepository.findOneByOrFail({ uuid });
            await this.CategoriesRepository.save({ ...category, ...newData });
            this.logger.debug(`Category updated by uuid: ${uuid}`);
            return { status: 'success', message: "Category has been updated successfully" };
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                this.logger.debug(`Category not found by uuid: ${uuid}`);
                return { status: "error", error: { type: Errors.NOTFOUND, message: "Category Not Found!" } };
            }
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async editCategory(category: Categories, newData: Partial<Categories>): Promise<Response> {
        this.logger.debug(`editCategory called with category uuid=${category.uuid}`);
        try {
            await this.CategoriesRepository.save({ ...category, ...newData });
            this.logger.debug(`Category updated by entity uuid=${category.uuid}`);
            return { status: 'success', message: "Category has been updated successfully" };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async deleteCategoryByName(name: string): Promise<Response> {
        this.logger.debug(`deleteCategoryByName called with name=${name}`);
        try {
            const category = await this.findCategoryOrFail({ name });
            await this.CategoriesRepository.remove(category);
            this.logger.debug(`Category deleted by name: ${name}`);
            return { status: "success", message: "Category deleted successfully" };
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                this.logger.debug(`Category not found to delete by name: ${name}`);
                return { status: "error", error: { type: Errors.NOTFOUND, message: "Category not found!" } };
            }
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async deleteCategoryByUUID(uuid: string): Promise<Response> {
        this.logger.debug(`deleteCategoryByUUID called with uuid=${uuid}`);
        try {
            const category = await this.findCategoryOrFail({ uuid });
            await this.CategoriesRepository.remove(category);
            this.logger.debug(`Category deleted by uuid: ${uuid}`);
            return { status: "success", message: "Category deleted successfully" };
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                this.logger.debug(`Category not found to delete by uuid: ${uuid}`);
                return { status: "error", error: { type: Errors.NOTFOUND, message: "Category not found!" } };
            }
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async deleteCategory(category: Categories): Promise<Response> {
        this.logger.debug(`deleteCategory called with category uuid=${category.uuid}`);
        try {
            await this.CategoriesRepository.remove(category);
            this.logger.debug(`Category deleted by entity uuid=${category.uuid}`);
            return { status: "success", message: "Category deleted successfully" };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async getCategories(): Promise<Response> {
        this.logger.debug("getCategories called");
        try {
            const categories = await this.CategoriesRepository.find({ relations: ["posts"] });
            this.logger.debug(`Fetched ${categories.length} categories`);
            return { status: "success", data: categories };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async getCategoriesByPost(post: Posts): Promise<Response> {
        this.logger.debug(`getCategoriesByPost called for post id=${post.id}`);
        try {
            const categories = await this.CategoriesRepository.find({
                where: { posts: { id: post.id } },
                relations: ["posts"]
            });
            this.logger.debug(`Fetched ${categories.length} categories for post id=${post.id}`);
            return { status: "success", data: categories };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async findCategoryOrFail(identifier: CategoriesIdentifier): Promise<Categories> {
        this.logger.debug(`findCategoryOrFail called with identifier=${JSON.stringify(identifier)}`);
        if ('uuid' in identifier) {
            return await this.CategoriesRepository.findOneByOrFail({ uuid: identifier.uuid });
        } else if ('name' in identifier) {
            return await this.CategoriesRepository.findOneByOrFail({ name: identifier.name });
        } else if ('post' in identifier) {
            return await this.CategoriesRepository.findOneByOrFail({ posts: identifier.post });
        } else {
            this.logger.error("Invalid identifier passed to findCategoryOrFail");
            throw new Error("Invalid Identifier");
        }
    }

    public static async findCategoryWithError(identifier: CategoriesIdentifier): Promise<Response & { data?: Categories }> {
        this.logger.debug(`findCategoryWithError called with identifier=${JSON.stringify(identifier)}`);
        try {
            const category = await this.findCategoryOrFail(identifier);
            this.logger.debug("Category found");
            return { status: "success", data: category };
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                this.logger.debug("Category not found");
                return { status: "error", error: { type: Errors.NOTFOUND, message: "Category not found!" } };
            }
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: (e as Error).message } };
        }
    }

    public static async findCategory(identifier: CategoriesIdentifier): Promise<Categories | null> {
    this.logger.debug(`findCategory called with identifier=${JSON.stringify(identifier)}`);
    try {
        const repo = dataSource.getRepository(Categories);

        let where: any = {};
        if ("uuid" in identifier) {
            where.uuid = identifier.uuid;
        } else if ("name" in identifier) {
            where.name = identifier.name;
        } else {
            throw new Error("Invalid category identifier");
        }

        const category = await repo.findOne({
            where,
            relations: ["posts"],
            order: {
                posts: {
                    timestamp: "DESC"
                }
            }
        });

        if (!category) {
            this.logger.debug("Category not found");
            return null;
        }

        return category;
    } catch (e) {
        this.logger.debug("Category not found");
        return null;
    }
}

}
