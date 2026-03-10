import express from "express"
import cors from "cors"
import {prisma} from "./client.js"
import {imagekit} from './middleware/imagekit.js'
import multer from "multer"
import pkg from "pg"
import { withConsoleLog } from "effect/Logger"
const {Pool}=pkg 
const storage=multer.memoryStorage()
const upload=multer({storage: storage});

const sbrn=express()
sbrn.use(cors())
sbrn.use(express.json())

const connectionString=process.env.DATABASE_URL
if(!connectionString){
    console.log("conenction error . dbs not found")
}
const pool=new Pool({connectionString})


sbrn.post('/create-user',upload.single("image"),async(req,res)=>{
    try{
        const{username,salary,role}=req.body
let imageul=""
if(req.file){
    const upload=await imagekit.upload({
        file:req.file.buffer,
        fileName:`user_${Date.now()}.jpg`
    })
    imageul=upload.url
}

const createNewsuer=await prisma.user.create({
    data:{
         username:username,
                salary:Number(salary),
                role:role,
                imageurl:imageul
    }
})
return res.json(createNewsuer)
    }catch(error){
        console.log(error.message)
    }
})

sbrn.get("/get-alluser",async(req,res)=>{
    try{

        const fnduser=await prisma.user.findMany()
        return res.json(fnduser)
    }catch(error){
        withConsoleLog.log(error.message)
    }
})


sbrn.listen(5057,'0.0.0.0',()=>{
console.log("sbrn is listenning")
})