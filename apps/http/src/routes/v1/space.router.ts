import { Router } from "express";
import { CreateSpaceSchema } from "../../types/index.js";
import client from "@repo/db"

export const spaceRouter = Router()

spaceRouter.post("/", async (req, res) => {
    const parsedData = CreateSpaceSchema.safeParse(req.body)
    console.log(parsedData.data)
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    try {

        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parsedData.data.width,
                height: parsedData.data.height,
                mapId: parsedData.data.mapId
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

spaceRouter.delete("/:spaceId", async (req, res) => {
    const spaceId = req.params.spaceId

    if (!spaceId) {
        return res.status(400).json({
            message: "invalid input"
        })
    }

    try {
        await client.space.delete({
            where: {
                id: spaceId
            }
        })

        return res.status(200)

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }

})

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