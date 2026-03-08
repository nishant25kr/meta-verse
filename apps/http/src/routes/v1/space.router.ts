import { Router } from "express";
import { CreateSpaceSchema, DeleteSpaceSchema } from "../../types/index.js";
import client from "@repo/db"
import { userMiddleware } from "../../middlewares/user.js";

export const spaceRouter = Router()

spaceRouter.post("/", userMiddleware, async (req, res) => {

    const parsedData = CreateSpaceSchema.safeParse(req.body)


    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    try {

        if (!req.userId) {
            return res.status(400).json({
                message: "Not autho"
            })
        }

        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: Number(parsedData.data.width),
                height: Number(parsedData.data.height),
                creatorId: req.userId
            }
        })

        if (!space) {
            return res.status(400).json({
                message: "Error while saving space"
            })
        }

        return res.status(200).json({
            spaceId: space.id
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }

})

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
    try {

        const parsedData = DeleteSpaceSchema.safeParse(req.params)
        if (!parsedData.success) {

            return res.status(400).json({
                message: "Validation failed"
            })
        }

        const spaceId = parsedData.data.spaceId;


        

        const space = await client.space.findUnique({
            where:{
                id:spaceId
            }
        })
        if(!space){
            return res.status(400).json({
                message:'Space not found'
            })
        }

        if(!(space?.creatorId === req.userId)){
            return res.status(400).json({
                message:"unautho user"
            })
        }

        const deleteSpace = await client.space.delete({
            where: {
                id: spaceId
            }
        });

        return res.status(200).json({
            message: "Deleted successfully",
            space: deleteSpace
        });

    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

spaceRouter.get("/:spaceId", async (req, res) => {
    const spaceId = req.params.spaceId as string;

    if (!spaceId) {
        return res.status(400).json({
            message: "no spaceId"
        })
    }

    const space = await client.space.findUnique({
        where: {
            id: spaceId
        }
    });

    if (!space) {
        return res.status(400).json({
            message: "Invalid id"
        })
    }

    return res.status(200).json({
        space: space
    })
})

spaceRouter.get("/all", async (req, res) => {
    const spaces = await client.space.findMany()
    if (!spaces) {
        return res.status(400).json({
            message: "Spaces not available"
        })
    }

    res.status(200).json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            dimensions: s.width + "x" + s.height,
            thumbnails: s.thumbnail

        }))
    })
})

// spaceRouter.post("/element", (req, res) => {

// })

// spaceRouter.delete("/element", (req, res) => {

// })