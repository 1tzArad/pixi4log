import { Errors } from "common/enums/Errors";
import { JWTExpireTime } from "common/enums/JWTExpireTime";
import { Response } from "common/interfaces/response/Response";
import { UserJWTTokenPayload } from "common/payloads/UserJWTTokenPayload";
import { dataSource } from "database/dataSource";
import { Posts } from "database/entity/Posts";
import { Users } from "database/entity/Users";
import { Repository } from "typeorm";
import { JwtUtils } from "utils/JWTUtils";
import Logger from "utils/Logger";
import { UserValidate } from "utils/validate";

type UserIdentifier = {uuid: string} | {email: string} | {username: string} | {post: Posts}
export class AuthorManager{
    public static UserRepository: Repository<Users> = dataSource.getRepository(Users)
    private static logger: Logger = new Logger('User-Manager')

    public static async createUser(username: string, email: string, password: string): Promise<Response>{
        // chcek username and email is exists or not
        if(await this.isEmailExists(email) || await this.isUsernameExists(username)) return {status: "error", error: {type: Errors.EXISTS, message: "a user with this username or email already exists!"}}
        // validate user
        const UserValidator = new UserValidate(email, username, password);
        const isValid = UserValidator.validate()
        if(!isValid) return { status: "error", error: { type: Errors.VALIDATION, message: UserValidator.errors.toString() } }
        // save user data into database
        const user = new Users()
        user.timestamp = Date.now()
        user.email = email;
        user.username = username;
        user.password = password;
        await this.UserRepository.save(user);
        // generate JWT token
        const JwtPayload: UserJWTTokenPayload = { email, username, password } 
        const token = JwtUtils.generateToken(JwtPayload, JWTExpireTime.FIVE_DAYS)
        return {
            status: "success",
            message: "User Created Successfully!",
            token: token
        }
    }
    public static async updateUser(identifier: UserIdentifier, newData: Partial<Users>): Promise<Response>{
        
    }
    public static async deleteUser(identifier: UserIdentifier): Promise<Response>{}
    public static async getUsers(): Promise<Response>{}
    public static async getUserByIdentifier(identifier: UserIdentifier): Promise<Response>{}
    public static async getUserPostsByIdentifier(identifier: UserIdentifier): Promise<Response>{}
    public static async isUsernameExists(username: string): Promise<boolean>{
        return await this.UserRepository.existsBy({username: username})
    }   
    public static async isEmailExists(email: string): Promise<boolean>{
        return await this.UserRepository.existsBy({ email: email })
    }
    // public static async (): Promise<Response>{} 
}