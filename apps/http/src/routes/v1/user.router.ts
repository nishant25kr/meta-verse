import { Router } from "express";
import { UpdateMetadataSchema } from "../../types/index.js";
import client from "@repo/db"
import { userMiddleware } from "../../middlewares/user.js";

export const userRouter = Router()

userRouter.post("/metadata", userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body)
    console.log("data of avatar to update", parsedData.data)
    if (!parsedData.success) {
        return res.status(400).json({ message: "Validation failed" })
    }

    if (!req.userId) {
        return res.status(400).json({ message: "Unauthorized" })
    }

    try {
        const avatar = await client.avatar.findUnique({
            where:{
                id: parsedData.data.avatarId
            }
        })
        console.log("avatar:",avatar)
        console.log("user",req.userId)

        if(!avatar){
            return res.status(400).json({
                message: "avatar not available"
            })
        }

        await client.user.update({
            where: {
                username: req.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        })

        return res.status(200).json({ message: "Metadata Updated" })
    } catch (error) {
        return res.status(400).json({
            message: "Invalid avatar id"
        });
    }
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