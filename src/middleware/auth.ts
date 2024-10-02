import { NextFunction, Request, Response } from "express";
import { JWT_PAYLOAD, verifyToken } from "../utils/jwtUtils";
import { httpsError } from "../utils/helper";

export async function authentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader
    if (!token) {
        const error = new Error("Access denied, token missing")
        httpsError(next, error, req, 401)
        return
    }
    try {
        const decode = verifyToken(token) as JWT_PAYLOAD

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).user = decode
        next()
    } catch (error) {
        httpsError(next, error, req, 403)
    }
}

export function authorization(requiredRole: 'USER' | 'ADMIN' | 'SUPERADMIN') {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userDetails = (req as any).user
            if (!userDetails) {
                throw new Error("Access Token Not Found")
            }
            if (userDetails.role === requiredRole || userDetails.role === "SUPERADMIN") {
                next();
            } else {
                throw new Error("Access Denied")
            }
        } catch (error) {
            httpsError(next, error, req, 500)
        }
    }
}

