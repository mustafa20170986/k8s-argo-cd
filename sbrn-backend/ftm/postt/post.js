import express  from "express"
import multer from "multer"
import cors from "cors"
//import {prisma} from "../../client.js"
import {prisma} from "./client.js"
import pkg from 'pg'
//import{imagekit} from "../../middleware/imagekit.js"
import { imagekit } from "./middleware/imagekit.js"
const {Pool} = pkg
const storage=multer.memoryStorage()
const upload=multer({ storage:storage});
const sbrn=express()

sbrn.use(cors({
    origin: "*"
}))
sbrn.use(express.json())


const connectionString= process.env.DATABASE_URL
if(!connectionString){
    console.log("connectiion string is not founded")
}
const pool =new Pool({connectionString})


sbrn.post("/add-user",upload.single("image"),async(req,res)=>{
    try{
        const{username,salary,role}=req.body
let imageul=""
if(req.file){
    const uploadres=await imagekit.upload({
        file:req.file.buffer,
        fileName:`user_${Date.now()}.jpeg`
    })
    imageul=uploadres.url
}
        const newuser=await prisma.user.create({
            data:{
               
                username:username,
                salary:Number(salary),
                role:role,
                imageurl:imageul
            }
        })
        return res.json(newuser)
    }catch(error){
        console.log(error.message)
    }
})





sbrn.listen(4045,'0.0.0.0',()=>{
    console.log("sbrn is listening ")
})