import express  from "express"
import cors from "cors"
//import {prisma} from "../../client.js"
import {prisma} from './client.js'
import pkg from 'pg'
const {Pool} = pkg

const sbrn=express()
sbrn.use(cors())
sbrn.use(express.json())

sbrn.get("/get-userdata",async(req,res)=>{
    try{
const finddata=await prisma.user.findMany()

return res.json(finddata)
    }catch(error){
        console.log(error.message)
    }
})


sbrn.listen(4053,'0.0.0.0',()=>{
    console.log("sbrn is listening ")
})