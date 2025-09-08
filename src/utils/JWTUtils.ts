import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import config from "./configuration";
import { JWTExpireTime } from "common/enums/JWTExpireTime";

export class JwtUtils {
  private static secret = config.jwt_secret;

 public static generateToken(
    payload: object,
    expiresIn: JWTExpireTime
  ): string {
    const options: SignOptions = { expiresIn: expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  public static verifyToken(token: string): JwtPayload | string | null {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}
