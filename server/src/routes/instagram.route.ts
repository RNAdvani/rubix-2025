import express from "express"
import { upload } from "../services/multer"
import { postSingleInstagram } from "../controllers/instagram.controller"

const router = express.Router()


router.post("/post-single",upload.single("image"),postSingleInstagram)




export {router as instagramRoutes}