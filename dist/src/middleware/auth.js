"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = authentication;
exports.authorization = authorization;
const jwtUtils_1 = require("../utils/jwtUtils");
const helper_1 = require("../utils/helper");
async function authentication(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if (!token) {
        const error = new Error("Access denied, token missing");
        (0, helper_1.httpsError)(next, error, req, 401);
        return;
    }
    try {
        const decode = (0, jwtUtils_1.verifyToken)(token);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.user = decode;
        next();
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req, 403);
    }
}
function authorization(requiredRole) {
    return async (req, res, next) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userDetails = req.user;
            if (!userDetails) {
                throw new Error("Access Token Not Found");
            }
            if (userDetails.role === requiredRole || userDetails.role === "SUPERADMIN") {
                next();
            }
            else {
                throw new Error("Access Denied");
            }
        }
        catch (error) {
            (0, helper_1.httpsError)(next, error, req, 500);
        }
    };
}
