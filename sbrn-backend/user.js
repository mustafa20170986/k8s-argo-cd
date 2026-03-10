import express from "express"
import cors from "cors" 
import { PrismaPg } from "@prisma/adapter-pg"
import { prisma } from "./client"
const connectionString = process.env.DATABASE_URL
const adapter =new PrismaPg({connectionString})
//export const prisma =new PrismaClient({adapter})
const app=express()
app.use(cors())
app.use(express.json())

 async function Uservar(userid){

    let finduser=await prisma.user.findUnique({
        where:{id:userid}
    })

    if(!finduser){
        finduser=await prisma.user.create({
            data:{
                id:userid
            }
        })
    }
    return finduser
}
export default Uservar