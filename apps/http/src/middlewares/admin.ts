import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config.js"
import { NextFunction, Request, Response } from "express"

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing" })
    }

    const token = header.split(" ")[1] 

    if (!token) {
  return res.status(401).json({ message: "Token malformed" });
}

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD);

        if (typeof decoded === "string") {
            return res.status(401).json({ message: "Invalid token" });
        }

        if (decoded.role !== "admin") {
            return res.status(401).json({ message: "Invalid you are not admim" });
        }

        req.userId = decoded.userId;
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}