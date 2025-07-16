import { CategoriesManager } from "./categoriesManager";
import { Response } from "../common/interfaces/response/Response";
import { EntityNotFoundError, Repository } from "typeorm";
import { Posts } from "../database/entity/Posts";
import { dataSource } from "../database/dataSource";
import { escapeHtml } from "../utils/functions";
import { Errors } from "../common/enums/Errors";
import { Categories } from "../database/entity/Categories";
import Logger from "../utils/Logger";

type PostIdentifier = { uuid: string } | { timestamp: number } | { category: Categories }

export class PostsManager {
    public static PostsRepository = dataSource.getRepository(Posts);
    private static logger = new Logger("Posts-Manager");

    public static async createPost(content: string, categoryName: string): Promise<Response> {
        this.logger.debug(`createPost called with categoryName=${categoryName}`);
        try {
            const category = await CategoriesManager.findCategory({ name: categoryName });
            if (!category) {
                this.logger.debug(`Category not found: ${categoryName}`);
                return { status: 'error', error: { type: Errors.NOTFOUND, message: "Category Not Found" } };
            }

            const post = new Posts();
            post.category = category;
            post.content = escapeHtml(content);
            post.timestamp = Date.now()

            await this.PostsRepository.save(post);
            this.logger.debug("Post created successfully");
            return { status: "success", message: "Post created successfully!" };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: 'error', error: { type: Errors.SERVERERROR, message: "An error occurred while creating the post." } };
        }
    }

    public static async editPost(identifier: PostIdentifier, newdata: Partial<Posts>): Promise<Response> {
        this.logger.debug(`editPost called with identifier=${JSON.stringify(identifier)}`);
        try {
            const post = await this.findPostByIdentifier(identifier);
            await this.PostsRepository.save({ ...post, ...newdata });
            this.logger.debug("Post updated successfully");
            return { status: 'success', message: "Post updated successfully!" };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: "An error occurred while updating the post." } };
        }
    }

    public static async deletePost(identifier: PostIdentifier): Promise<Response> {
        this.logger.debug(`deletePost called with identifier=${JSON.stringify(identifier)}`);
        try {
            const post = await this.findPostByIdentifier(identifier);
            await this.PostsRepository.remove(post);
            this.logger.debug("Post deleted successfully");
            return { status: "success", message: "Post deleted successfully!" };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: "An error occurred while deleting the post." } };
        }
    }

    public static async getPosts(fields: (keyof Posts)[] = []): Promise<Response> {
        this.logger.debug(`getPosts called with fields=[${fields.join(", ")}]`);
        try {
            const qb = this.PostsRepository.createQueryBuilder("post").leftJoinAndSelect("post.category", "category");
            if (fields.length) {
                qb.select(fields.map(field => `post.${field}`));
            }
            const posts = await qb.getMany();
            this.logger.debug(`Fetched ${posts.length} posts`);
            return { status: "success", data: posts };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.SERVERERROR, message: "Failed to retrieve posts." } };
        }
    }

    public static async getPostByTimestamp(timestamp: string): Promise<Response> {
        this.logger.debug(`getPostByTimestamp called with timestamp=${timestamp}`);
        try {
            const timestampInt = parseInt(timestamp)
            const post = await this.findPostByIdentifier({ timestamp: timestampInt });
            this.logger.debug("Post found by timestamp");
            return { status: "success", data: post };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.NOTFOUND, message: "Post not found." } };
        }
    }

    public static async getPostByUUID(uuid: string): Promise<Response> {
        this.logger.debug(`getPostByUUID called with uuid=${uuid}`);
        try {
            const post = await this.findPostByIdentifier({ uuid });
            this.logger.debug("Post found by uuid");
            return { status: "success", data: post };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.NOTFOUND, message: "Post not found." } };
        }
    }

    public static async getPostByCategory(category: Categories): Promise<Response> {
        this.logger.debug(`getPostByCategory called with category uuid=${category.uuid}`);
        try {
            const post = await this.findPostByIdentifier({ category });
            this.logger.debug("Post found by category");
            return { status: "success", data: post };
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: "error", error: { type: Errors.NOTFOUND, message: "Post not found in this category." } };
        }
    }

    public static async getPostByCategoryName(categoryName: string): Promise<Response> {
        this.logger.debug(`getPostByCategoryName called with categoryName=${categoryName}`);
        try {
            const category = await CategoriesManager.findCategory({ name: categoryName });
            if (!category) {
                this.logger.debug(`Category not found: ${categoryName}`);
                return { status: 'error', error: { type: Errors.NOTFOUND, message: "Category not found." } };
            }
            return await this.getPostByCategory(category);
        } catch (e) {
            this.logger.error((e as Error).message);
            return { status: 'error', error: { type: Errors.SERVERERROR, message: "An error occurred while finding the post." } };
        }
    }

    public static async findPostByIdentifier(identifier: PostIdentifier): Promise<Posts> {
        this.logger.debug(`findPostByIdentifier called with identifier=${JSON.stringify(identifier)}`);
        if ('uuid' in identifier) {
            return await this.PostsRepository.findOneByOrFail({ id: identifier.uuid });
        } else if ('timestamp' in identifier) {
            return await this.PostsRepository.findOneByOrFail({ timestamp: identifier.timestamp });
        } else if ('category' in identifier) {
            return await this.PostsRepository.createQueryBuilder("post")
                .leftJoinAndSelect("post.category", "category")
                .where("category.uuid = :uuid", { uuid: identifier.category.uuid })
                .getOneOrFail();
        } else {
            this.logger.error("Invalid identifier passed to findPostByIdentifier");
            throw new Error("Invalid identifier");
        }
    }
}
