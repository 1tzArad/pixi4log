import { TagsManager } from "./tagsManager";
import { Response } from "../common/interfaces/response/Response";
import { Posts } from "../database/entity/Posts";
import { dataSource } from "../database/dataSource";
import { escapeHtml } from "../utils/functions";
import { Errors } from "../common/enums/Errors";
import { Tags } from "../database/entity/Tags";
import Logger from "../utils/Logger";

type PostIdentifier = { uuid: string } | { timestamp: number } | { tag: Tags };

export class PostsManager {
  public static PostsRepository = dataSource.getRepository(Posts);
  private static logger = new Logger("Posts-Manager");

  public static async createPost(
    content: string,
    tagNames: string[]
  ): Promise<Response> {
    this.logger.debug(`createPost called with tagNames=${tagNames.join(",")}`);
    try {
      const tags = await TagsManager.TagsRepository.find({
        where: tagNames.map((name) => ({ name })),
      });

      if (tags.length !== tagNames.length) {
        const foundNames = tags.map((t) => t.name);
        const missingTags = tagNames.filter(
          (name) => !foundNames.includes(name)
        );
        this.logger.debug(`Tags not found: ${missingTags.join(", ")}`);
        return {
          status: "error",
          error: {
            type: Errors.NOTFOUND,
            message: `Tags not found: ${missingTags.join(", ")}`,
          },
        };
      }

      const post = new Posts();
      post.content = escapeHtml(content);
      post.timestamp = Date.now();
      post.tags = tags;

      await this.PostsRepository.save(post);
      this.logger.debug("Post created successfully");
      return {
        status: "success",
        message: "Post created successfully!",
      };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.SERVERERROR,
          message: "An error occurred while creating the post.",
        },
      };
    }
  }

  public static async editPost(
    identifier: PostIdentifier,
    newdata: Partial<Posts>
  ): Promise<Response> {
    this.logger.debug(
      `editPost called with identifier=${JSON.stringify(identifier)}`
    );
    try {
      const post = await this.findPostByIdentifier(identifier);
      await this.PostsRepository.save({ ...post, ...newdata });
      this.logger.debug("Post updated successfully");
      return { status: "success", message: "Post updated successfully!" };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.SERVERERROR,
          message: "An error occurred while updating the post.",
        },
      };
    }
  }

  public static async deletePost(
    identifier: PostIdentifier
  ): Promise<Response> {
    this.logger.debug(
      `deletePost called with identifier=${JSON.stringify(identifier)}`
    );
    try {
      const post = await this.findPostByIdentifier(identifier);
      if (Array.isArray(post)) {
        await this.PostsRepository.remove(post);
      } else {
        await this.PostsRepository.remove([post]);
      }
      this.logger.debug("Post deleted successfully");
      return { status: "success", message: "Post deleted successfully!" };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.SERVERERROR,
          message: "An error occurred while deleting the post.",
        },
      };
    }
  }

  public static async getPosts(
    fields: (keyof Posts)[] = []
  ): Promise<Response> {
    this.logger.debug(`getPosts called with fields=[${fields.join(", ")}]`);
    try {
      const qb = this.PostsRepository.createQueryBuilder(
        "post"
      ).leftJoinAndSelect("post.tags", "tags");
      if (fields.length) {
        qb.select(fields.map((field) => `post.${field}`));
      }
      const posts = await qb.getMany();
      this.logger.debug(`Fetched ${posts.length} posts`);
      return { status: "success", data: posts };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.SERVERERROR,
          message: "Failed to retrieve posts.",
        },
      };
    }
  }

  public static async getPostByTimestamp(timestamp: string): Promise<Response> {
    this.logger.debug(`getPostByTimestamp called with timestamp=${timestamp}`);
    try {
      const timestampInt = parseInt(timestamp);
      const post = await this.findPostByIdentifier({ timestamp: timestampInt });
      this.logger.debug("Post found by timestamp");
      return { status: "success", data: post };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.NOTFOUND, message: "Post not found." },
      };
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
      return {
        status: "error",
        error: { type: Errors.NOTFOUND, message: "Post not found." },
      };
    }
  }

  public static async getPostBytag(tag: Tags): Promise<Response> {
    this.logger.debug(`getPostBytag called with tag uuid=${tag.uuid}`);
    try {
      const post = await this.findPostByIdentifier({ tag });
      this.logger.debug("Post found by tag");
      return { status: "success", data: post };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.NOTFOUND,
          message: "Post not found in this tag.",
        },
      };
    }
  }

  public static async getPostBytagName(tagName: string): Promise<Response> {
    this.logger.debug(`getPostBytagName called with tagName=${tagName}`);
    try {
      const tag = await TagsManager.findTag({ name: tagName });
      if (!tag) {
        this.logger.debug(`tag not found: ${tagName}`);
        return {
          status: "error",
          error: { type: Errors.NOTFOUND, message: "tag not found." },
        };
      }
      return await this.getPostBytag(tag);
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.SERVERERROR,
          message: "An error occurred while finding the post.",
        },
      };
    }
  }

  public static async findPostByIdentifier(
    identifier: PostIdentifier
  ): Promise<Posts | Posts[]> {
    this.logger.debug(
      `findPostByIdentifier called with identifier=${JSON.stringify(
        identifier
      )}`
    );

    const qb = this.PostsRepository.createQueryBuilder(
      "post"
    ).leftJoinAndSelect("post.tags", "tag");

    if ("uuid" in identifier) {
      return await qb
        .where("post.id = :uuid", { uuid: identifier.uuid })
        .getMany();
    } else if ("timestamp" in identifier) {
      return await qb
        .where("post.timestamp = :timestamp", {
          timestamp: identifier.timestamp,
        })
        .getMany();
    } else if ("tag" in identifier) {
      return await qb
        .where("tag.uuid = :uuid", { uuid: identifier.tag.uuid })
        .getMany();
    } else {
      this.logger.error("Invalid identifier passed to findPostByIdentifier");
      throw new Error("Invalid identifier");
    }
  }
}
