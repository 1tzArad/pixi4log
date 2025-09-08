import { Response } from "common/interfaces/response/Response";
import { dataSource } from "database/dataSource";
import { Posts } from "database/entity/Posts";
import { Authors } from "database/entity/Authors";
import { Repository } from "typeorm";
import Logger from "utils/Logger";

type AuthorIdentifier = {uuid: string} | {email: string} | {username: string} | {post: Posts}
export class AuthorManager{
    public static AuthorRepository: Repository<Authors> = dataSource.getRepository(Authors)
    private static logger: Logger = new Logger('Author-Manager')

    public static async createAuthor(username: string, email: string, password: string): Promise<Response>{}
    public static async editAuthor(identifier: AuthorIdentifier, newData: Partial<Authors>): Promise<Response>{}
    public static async deleteAuthor(identifier: AuthorIdentifier): Promise<Response>{}
    public static async sendAuthorRequest(email: string): Promise<Response>{}
    public static async getAuthors(): Promise<Response>{}
    public static async getAuthorByIdentifier(identifier: AuthorIdentifier): Promise<Response>{}
    public static async getAuthorPostsByIdentifier(identifier: AuthorIdentifier): Promise<Response>{}
    // public static async (): Promise<Response>{} 
}