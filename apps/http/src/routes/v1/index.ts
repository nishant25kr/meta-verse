import { Router } from "express";
import { adminRouter } from "./admin.router.js";
import { userRouter } from "./user.router.js";
import { spaceRouter } from "./space.router.js";

export const router = Router()

router.get("/signup",(req,res)=>{
    res.json({message:"signup"})
})

router.post("/signin",(req,res)=>{

})

router.post("/elements",(req,res)=>{

})

router.post("/avatars",(req,res)=>{

})

router.use("/user",userRouter)
router.use("/user",spaceRouter)
router.use("/user",adminRouter)