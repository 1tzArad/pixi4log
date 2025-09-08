import { createHash } from "crypto";

export class HashUtils{
    public hashSHA256(data: string): string{
        return createHash('sha-256')
        .update(data)
        .digest('hex')
    }
}