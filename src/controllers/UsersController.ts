import { Request, Response } from "express";
import Logger from "../utils/Logger";
import { Errors } from "../common/enums/Errors";
import { UserManager } from "../managers/UserManager";

const logger = new Logger("Users-Controller");

export class UsersController {
    public static async getUsers(req: Request, res: Response) {
        try {
            const fields: (keyof typeof UserManager["UserRepository"]["target"])[] = req.query.fields
                ? (req.query.fields as string).split(",") as any
                : [];
            const response = await UserManager.getUsers(fields);
            res.status(response.status === "success" ? 200 : 400).json(response);
        } catch (e) {
            logger.error((e as Error).message);
            res.status(500).json({ status: "error", error: { type: Errors.SERVERERROR, message: "Internal server error" } });
        }
    }

    public static async getUserByIdentifier(req: Request, res: Response) {
        try {
            const identifierRaw = req.params.identifier;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let identifier: any = {};
            if (uuidRegex.test(identifierRaw)) {
                identifier.uuid = identifierRaw;
            } else if (emailRegex.test(identifierRaw)) {
                identifier.email = identifierRaw;
            } else {
                identifier.username = identifierRaw;
            }

            const users = await UserManager.getUserByIdentifier(identifier);
            if (!users || (Array.isArray(users) && users.length === 0)) {
                return res.status(404).json({ status: "error", error: { type: Errors.NOTFOUND, message: "user not found." } });
            }
            return res.json({ status: "success", data: users });
        } catch (e) {
            logger.error((e as Error).message);
            return res.status(500).json({ status: "error", error: { type: Errors.SERVERERROR, message: "Internal server error." } });
        }
    }

    public static async createUser(req: Request, res: Response) {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ status: "error", error: { message: "username, email and password are required" } });
        }
        try {
            const response = await UserManager.createUser(username, email, password);
            res.status(response.status === "success" ? 201 : 400).json(response);
        } catch (e) {
            logger.error((e as Error).message);
            res.status(500).json({ status: "error", error: { type: Errors.SERVERERROR, message: "Internal server error" } });
        }
    }

    public static async updateUser(req: Request, res: Response) {
        const { identifier, newData } = req.body;
        if (!identifier || typeof newData !== "object") {
            return res.status(400).json({ status: "error", error: { message: "identifier and newData are required" } });
        }
        try {
            const response = await UserManager.updateUser(identifier, newData);
            res.status(response.status === "success" ? 200 : 400).json(response);
        } catch (e) {
            logger.error((e as Error).message);
            res.status(500).json({ status: "error", error: { type: Errors.SERVERERROR, message: "Internal server error" } });
        }
    }

    public static async deleteUser(req: Request, res: Response) {
        const { identifier } = req.body;
        if (!identifier) {
            return res.status(400).json({ status: "error", error: { message: "identifier is required" } });
        }
        try {
            const response = await UserManager.deleteUser(identifier);
            res.status(response.status === "success" ? 200 : 400).json(response);
        } catch (e) {
            logger.error((e as Error).message);
            res.status(500).json({ status: "error", error: { type: Errors.SERVERERROR, message: "Internal server error" } });
        }
    }
}


