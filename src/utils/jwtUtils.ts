import "dotenv/config"
import jwt from "jsonwebtoken"
const SECRET_KEY = process.env.JWT_SECRET!

export interface JWT_PAYLOAD {
    id: number,
    email: string,
    role: 'USER' | 'ADMIN' | "SUPERADMIN"
}

export const generateToken = (payload: JWT_PAYLOAD) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {

    try {
        const decode = jwt.verify(token, SECRET_KEY);


        return decode
    } catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};

