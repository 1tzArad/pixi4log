import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "../../utils/JWTUtils";
import Logger from "../../utils/Logger";
import { Errors } from "../../common/enums/Errors";

const logger = new Logger("Auth-Middleware");

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        const raw = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        if (!raw) {
            return res.status(401).json({ status: "error", error: { type: Errors.UNAUTHORIZED, message: "Authorization header missing" } });
        }

        const parts = raw.split(" ");
        const token = parts.length === 2 ? parts[1] : raw;
        if (!token) {
            return res.status(401).json({ status: "error", error: { type: Errors.UNAUTHORIZED, message: "Invalid authorization header" } });
        }

        const payload = JwtUtils.verifyToken(token);
        if (!payload || typeof payload === "string") {
            return res.status(401).json({ status: "error", error: { type: Errors.UNAUTHORIZED, message: "Invalid or expired token" } });
        }

        req.user = payload;
        return next();
    } catch (e) {
        logger.error((e as Error).message);
        return res.status(500).json({ status: "error", error: { type: Errors.SERVERERROR, message: "Internal server error" } });
    }
}


