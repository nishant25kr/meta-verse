import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin.js";
import { CreateAvatarSchema } from "../../types/index.js";
import client from "@repo/db"

export const adminRouter = Router()
console.log("Admin router loaded")

// adminRouter.post("/element",(req,res)=>{

// })

// adminRouter.put("/element/:elementId",(req,res)=>{

// })

adminRouter.post("/avatar", adminMiddleware, async (req, res) => {

    const parsedData = CreateAvatarSchema.safeParse(req.body)

    if (!parsedData.success) {
        console.log("validation failed")
        return res.status(400).json({
            message: "Validation fialed"
        })
    }

    try {

        const avatar = await client.avatar.create({
            data: {
                imageUrl: parsedData.data.imageUrl,
                name: parsedData.data.name
            }
        })

        return res.status(200).json({
            avatarId: avatar.id
        })

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
})

// adminRouter.get("/map",(req,res)=>{

// })