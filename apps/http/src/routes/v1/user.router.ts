import { Router } from "express";
import { UpdateMetadataSchema } from "src/types/index.js";
import client from "@repo/db"
import { userMiddleware } from "src/middlewares/user.js";

export const userRouter = Router()

userRouter.post("/metadata", userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body)

    if (!parsedData.success) {
        return res.status(400).json({ message: "Validation failed" })
    }

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    await client.user.update({
        where: {
            username: req.userId
        },
        data: {
            avatarId: parsedData.data.avatarId
        }
    })

    res.json({ message: "Metadata Updated" })
})

userRouter.post("/metadata/bulk", async (req, res) => {
    const userIdString = (req.query.ids ?? "[]") as string

    let userIds: string[] = []

    try {
        userIds = JSON.parse(userIdString)
    } catch {
        return res.status(400).json({ message: "Invalid ids format" })
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "No user ids provided" })
    }

    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            avatar: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})