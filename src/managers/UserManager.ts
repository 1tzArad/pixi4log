import { Errors } from "common/enums/Errors";
import { JWTExpireTime } from "common/enums/JWTExpireTime";
import { Response } from "common/interfaces/response/Response";
import { UserJWTTokenPayload } from "common/payloads/UserJWTTokenPayload";
import { dataSource } from "database/dataSource";
import { Posts } from "database/entity/Posts";
import { Users } from "database/entity/Users";
import { Repository } from "typeorm";
import { isDataView } from "util/types";
import { JwtUtils } from "utils/JWTUtils";
import Logger from "utils/Logger";
import { UserValidate } from "utils/validate";

type UserIdentifier =
  | { uuid: string }
  | { email: string }
  | { username: string }
  | { post: Posts };
export class UserManager {
  public static UserRepository: Repository<Users> =
    dataSource.getRepository(Users);
  private static logger: Logger = new Logger("User-Manager");

  public static async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<Response> {
    // chcek username and email is exists or not
    if (
      (await this.isEmailExists(email)) ||
      (await this.isUsernameExists(username))
    )
      return {
        status: "error",
        error: {
          type: Errors.EXISTS,
          message: "a user with this username or email already exists!",
        },
      };
    // validate user
    const UserValidator = new UserValidate(email, username, password);
    const isValid = UserValidator.validate();
    if (!isValid)
      return {
        status: "error",
        error: {
          type: Errors.VALIDATION,
          message: UserValidator.errors.toString(),
        },
      };
    // save user data into database
    const user = new Users();
    user.timestamp = Date.now();
    user.email = email;
    user.username = username;
    user.password = password;
    await this.UserRepository.save(user);
    // generate JWT token
    const JwtPayload: UserJWTTokenPayload = { email, username, password };
    const token = JwtUtils.generateToken(JwtPayload, JWTExpireTime.FIVE_DAYS);
    return {
      status: "success",
      message: "User Created Successfully!",
      token: token,
    };
  }
  public static async updateUser(
    identifier: UserIdentifier,
    newData: Partial<Users>
  ): Promise<Response> {
    try {
      const user = await this.getUserByIdentifier(identifier);
      await this.UserRepository.save({ ...user, ...newData });
      return { status: "success", message: "User Updated Successfully!" };
    } catch (error) {
      this.logger.error((error as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.SERVERERROR,
          message: "An error occurred while updating the user.",
        },
      };
    }
  }
  public static async deleteUser(
    identifier: UserIdentifier
  ): Promise<Response> {
    try {
      const user = await this.getUserByIdentifier(identifier);
      if (Array.isArray(user)) {
        await this.UserRepository.remove(user);
      } else {
        await this.UserRepository.remove([user]);
      }
      return { status: "success", message: "User Deleted Successfully!" };
    } catch (error) {
      this.logger.error((error as Error).message);
      return {
        status: "error",
        error: {
          type: Errors.SERVERERROR,
          message: "An error occurred while deleting the user.",
        },
      };
    }
  }

  public static async getUsers(
    fields: (keyof Users)[] = []
  ): Promise<Response> {
    try {
      const qb = this.UserRepository.createQueryBuilder(
        "user"
      ).leftJoinAndSelect("user.posts", "posts");
      if (fields.length) {
        qb.select(fields.map((field) => `user.${field}`));
      }
      const users = await qb.getMany();
      return { status: "success", data: users };
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

  public static async getUserByIdentifier(
    identifier: UserIdentifier
  ): Promise<Users | Users[]> {
    const qb = this.UserRepository.createQueryBuilder("user").leftJoinAndSelect(
      "user.posts",
      "post"
    );
    if ("email" in identifier) {
      return await qb
        .where("user.email = :email", { email: identifier.email })
        .getMany();
    } else if ("post" in identifier) {
      return await qb
        .where("post.id = :postID", { postUUID: identifier.post.id })
        .getMany();
    } else if ("username" in identifier) {
      return await qb
        .where("user.username = :username", { username: identifier.username })
        .getMany();
    } else if ("uuid" in identifier) {
      return await qb
        .where("user.uuid = :uuid", { uuid: identifier.uuid })
        .getMany();
    } else {
      this.logger.error("Invalid identifier passed to findPostByIdentifier");
      throw new Error("Invalid identifier");
    }
  }

  public static async isUsernameExists(username: string): Promise<boolean> {
    return await this.UserRepository.existsBy({ username: username });
  }
  public static async isEmailExists(email: string): Promise<boolean> {
    return await this.UserRepository.existsBy({ email: email });
  }
}
