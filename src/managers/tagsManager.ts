import { EntityNotFoundError, Repository } from "typeorm";
import { Tags } from "../database/entity/Tags";
import { dataSource } from "../database/dataSource";
import { Response } from "../common/interfaces/response/Response";
import { Errors } from "../common/enums/Errors";
import { Posts } from "../database/entity/Posts";
import Logger from "../utils/Logger";
import logger from "../utils/Logger";

type TagsIdentifier = { uuid: string } | { name: string } | { post: Posts };
export class TagsManager {
  public static TagsRepository = dataSource.getRepository(Tags);
  private static logger = new Logger("Tags-Manager");

  public static async createTag(
    name: string,
    fancyName: string,
    icon: string
  ): Promise<Response> {
    this.logger.debug(`createTag called with name=${name}`);
    if (await this.findTag({ name })) {
      this.logger.debug(`Tag with name=${name} already exists`);
      return {
        status: "error",
        error: {
          type: Errors.EXISTS,
          message: "this Tag name already exists.",
        },
      };
    }
    const Tag = new Tags();
    Tag.fancyName = fancyName;
    Tag.icon = icon;
    Tag.name = name;
    await this.TagsRepository.save(Tag);
    this.logger.debug(`Tag created: name=${name}`);
    return { status: "success", message: "Tag Created Successfully!" };
  }

  public static async editTagByName(
    TagName: string,
    newData: Partial<Tags>
  ): Promise<Response> {
    this.logger.debug(`editTagByName called with TagName=${TagName}`);
    try {
      const Tag = await this.findTagOrFail({ name: TagName });
      await this.TagsRepository.save({ ...Tag, ...newData });
      this.logger.debug(`Tag updated by name: ${TagName}`);
      return {
        status: "success",
        message: "Tag has been updated successfully",
      };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        this.logger.debug(`Tag not found by name: ${TagName}`);
        return {
          status: "error",
          error: { type: Errors.NOTFOUND, message: "Tag Not Found!" },
        };
      }
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async editTagByUUID(
    uuid: string,
    newData: Partial<Tags>
  ): Promise<Response> {
    this.logger.debug(`editTagByUUID called with uuid=${uuid}`);
    try {
      const Tag = await this.TagsRepository.findOneByOrFail({ uuid });
      await this.TagsRepository.save({ ...Tag, ...newData });
      this.logger.debug(`Tag updated by uuid: ${uuid}`);
      return {
        status: "success",
        message: "Tag has been updated successfully",
      };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        this.logger.debug(`Tag not found by uuid: ${uuid}`);
        return {
          status: "error",
          error: { type: Errors.NOTFOUND, message: "Tag Not Found!" },
        };
      }
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async editTag(
    Tag: Tags,
    newData: Partial<Tags>
  ): Promise<Response> {
    this.logger.debug(`editTag called with Tag uuid=${Tag.uuid}`);
    try {
      await this.TagsRepository.save({ ...Tag, ...newData });
      this.logger.debug(`Tag updated by entity uuid=${Tag.uuid}`);
      return {
        status: "success",
        message: "Tag has been updated successfully",
      };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async deleteTagByName(name: string): Promise<Response> {
    this.logger.debug(`deleteTagByName called with name=${name}`);
    try {
      const Tag = await this.findTagOrFail({ name });
      await this.TagsRepository.remove(Tag);
      this.logger.debug(`Tag deleted by name: ${name}`);
      return { status: "success", message: "Tag deleted successfully" };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        this.logger.debug(`Tag not found to delete by name: ${name}`);
        return {
          status: "error",
          error: { type: Errors.NOTFOUND, message: "Tag not found!" },
        };
      }
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async deleteTagByUUID(uuid: string): Promise<Response> {
    this.logger.debug(`deleteTagByUUID called with uuid=${uuid}`);
    try {
      const Tag = await this.findTagOrFail({ uuid });
      await this.TagsRepository.remove(Tag);
      this.logger.debug(`Tag deleted by uuid: ${uuid}`);
      return { status: "success", message: "Tag deleted successfully" };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        this.logger.debug(`Tag not found to delete by uuid: ${uuid}`);
        return {
          status: "error",
          error: { type: Errors.NOTFOUND, message: "Tag not found!" },
        };
      }
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async deleteTag(Tag: Tags): Promise<Response> {
    this.logger.debug(`deleteTag called with Tag uuid=${Tag.uuid}`);
    try {
      await this.TagsRepository.remove(Tag);
      this.logger.debug(`Tag deleted by entity uuid=${Tag.uuid}`);
      return { status: "success", message: "Tag deleted successfully" };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async getTags(): Promise<Response> {
    this.logger.debug("getTags called");
    try {
      const Tags = await this.TagsRepository.find({ relations: ["posts"] });
      this.logger.debug(`Fetched ${Tags.length} Tags`);
      return { status: "success", data: Tags };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async getTagsByPost(post: Posts): Promise<Response> {
    this.logger.debug(`getTagsByPost called for post id=${post.id}`);
    try {
      const Tags = await this.TagsRepository.createQueryBuilder("tag")
        .leftJoinAndSelect("tag.posts", "post")
        .where("post.id = :id", { id: post.id })
        .getMany();

      this.logger.debug(`Fetched ${Tags.length} Tags for post id=${post.id}`);
      return { status: "success", data: Tags };
    } catch (e) {
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async findTagOrFail(identifier: TagsIdentifier): Promise<Tags> {
    this.logger.debug(
      `findTagOrFail called with identifier=${JSON.stringify(identifier)}`
    );
    if ("uuid" in identifier) {
      return await this.TagsRepository.findOneByOrFail({
        uuid: identifier.uuid,
      });
    } else if ("name" in identifier) {
      return await this.TagsRepository.findOneByOrFail({
        name: identifier.name,
      });
    } else if ("post" in identifier) {
      return await this.TagsRepository.createQueryBuilder("tag")
        .leftJoin("tag.posts", "post")
        .where("post.id = :id", { id: identifier.post.id })
        .getOneOrFail();
    } else {
      this.logger.error("Invalid identifier passed to findTagOrFail");
      throw new Error("Invalid Identifier");
    }
  }

  public static async findTagWithError(
    identifier: TagsIdentifier
  ): Promise<Response & { data?: Tags }> {
    this.logger.debug(
      `findTagWithError called with identifier=${JSON.stringify(identifier)}`
    );
    try {
      const Tag = await this.findTagOrFail(identifier);
      this.logger.debug("Tag found");
      return { status: "success", data: Tag };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        this.logger.debug("Tag not found");
        return {
          status: "error",
          error: { type: Errors.NOTFOUND, message: "Tag not found!" },
        };
      }
      this.logger.error((e as Error).message);
      return {
        status: "error",
        error: { type: Errors.SERVERERROR, message: (e as Error).message },
      };
    }
  }

  public static async findTag(
    identifier: TagsIdentifier
  ): Promise<Tags | null> {
    this.logger.debug(
      `findTag called with identifier=${JSON.stringify(identifier)}`
    );
    try {
      const repo = dataSource.getRepository(Tags);

      let where: any = {};
      if ("uuid" in identifier) {
        where.uuid = identifier.uuid;
      } else if ("name" in identifier) {
        where.name = identifier.name;
      } else {
        throw new Error("Invalid Tag identifier");
      }

      const Tag = await repo.findOne({
        where,
        relations: ["posts"],
        order: {
          posts: {
            timestamp: "DESC",
          },
        },
      });

      if (!Tag) {
        this.logger.debug("Tag not found");
        return null;
      }

      return Tag;
    } catch (e) {
      this.logger.debug("Tag not found");
      return null;
    }
  }
}
