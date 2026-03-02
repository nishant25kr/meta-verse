import z from "zod";

export const SignUpSchema = z.object({
username: z.string().email(),
    password: z.string().min(8),
    type: z.enum(["user","admin"])
})

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string().min(8)
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

export const CreateSpaceSchema = z.object({
    name:z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string(),

})

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.string(),
    y: z.string()
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.string(),
    height: z.string(),
    static: z.boolean()
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string()
})

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string()
})

export const CreateMapSchema = z.object({
    thumbnail:z.string(),
    dimensions: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.string(),
        y: z.string()
    }))
})







