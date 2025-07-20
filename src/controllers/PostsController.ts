import { Request, Response } from "express";
import { PostsManager } from "../managers/postsManager";
import { TagsManager } from "../managers/tagsManager";
import Logger from "../utils/Logger";

const logger = new Logger("Posts-Controller");

export class PostsController {
    public static async getPosts(req: Request, res: Response) {
        try {
            const fields: (keyof typeof PostsManager["PostsRepository"]["target"])[] = req.query.fields
                ? (req.query.fields as string).split(",") as any
                : [];
            logger.debug(`Fields requested: ${fields.join(", ")}`);
            const response = await PostsManager.getPosts(fields);
            res.status(response.status === "success" ? 200 : 400).json(response);
        } catch {
            res.status(500).json({ status: "error", error: { message: "Internal server error" } });
        }
    }

    public static async getPostByIdentifier(req: Request, res: Response) {
        try {
            const identifierRaw = req.params.identifier;
            let identifier: any = {};
            if (/^[0-9a-fA-F-]{36}$/.test(identifierRaw)) {
                identifier.uuid = identifierRaw;
            } else {
                identifier.timestamp = identifierRaw;
            }
            const response = await PostsManager.getPostByUUID(identifier.uuid || "");
            if (response.status === "error") {
                const respByTimestamp = await PostsManager.getPostByTimestamp(identifier.timestamp || "");
                return res.status(respByTimestamp.status === "success" ? 200 : 404).json(respByTimestamp);
            }
            res.status(200).json(response);
        } catch (e) {
            logger.error((e as Error).message);
            res.status(500).json({ status: "error", error: { message: "Internal server error" } });
        }
    }

    public static async createPost(req: Request, res: Response) {
  const { content, tagNames } = req.body;

  if (!content || !Array.isArray(tagNames) || tagNames.length === 0) {
    return res.status(400).json({
      status: "error",
      error: { message: "content and at least one tagName are required" },
    });
  }

  try {
    const response = await PostsManager.createPost(content, tagNames);
    res.status(response.status === "success" ? 201 : 400).json(response);
  } catch (e) {
    logger.error((e as Error).message);
    res.status(500).json({
      status: "error",
      error: { message: "Internal server error" },
    });
  }
}

    public static async editPost(req: Request, res: Response) {
        const { newData, identifier } = req.body

        if (!identifier || typeof newData !== "object") {
            return res.status(400).json({ status: "error", error: { message: "identifier and newData are required" } });
        }
        logger.debug(`Edit identifier: ${JSON.stringify(identifier)}, newData: ${JSON.stringify(newData)}`);

        const response = await PostsManager.editPost(identifier, newData);
        res.status(response.status === "success" ? 200 : 400).json(response);
    }

    public static async deletePost(req: Request, res: Response) {
        const identifier = req.body.identifier;

        if (!identifier) {
            return res.status(400).json({ status: "error", error: { message: "identifier is required" } });
        }
        logger.debug(`Delete identifier: ${JSON.stringify(identifier)}`);

        const response = await PostsManager.deletePost(identifier);
        res.status(response.status === "success" ? 200 : 400).json(response);
    }

    public static async changePostCategory(req: Request, res: Response) {
        const { postIdentifier, newCategoryIdentifier } = req.body;

        if (!postIdentifier || !newCategoryIdentifier) {
            return res.status(400).json({ status: "error", error: { message: "postIdentifier and newCategoryIdentifier are required" } });
        }

        try {
            const post = await PostsManager.findPostByIdentifier(postIdentifier);
            if (!post) return res.status(404).json({ status: "error", error: { message: "Post not found" } });

            const tag = await TagsManager.findTag(newCategoryIdentifier);
            if (!tag) return res.status(404).json({ status: "error", error: { message: "Category not found" } });

            const response = await PostsManager.editPost(postIdentifier, { tags: [tag] });
            res.status(response.status === "success" ? 200 : 400).json(response);
        } catch (e) {
            logger.error((e as Error).message);
            res.status(500).json({ status: "error", error: { message: "Internal server error" } });
        }
    }
}
