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
    try {
        // --- START CPU BURNER ---
        // This loop blocks the Event Loop and forces CPU utilization to spike.
        // 10 million iterations is a good starting point for a '50m' CPU request.
        let result = 0;
        for (let i = 0; i < 10000000; i++) {
            result += Math.sqrt(i) * Math.random();
        }
        // --- END CPU BURNER ---

        const finddata = await prisma.user.findMany();

        // Include the 'result' just to ensure the compiler doesn't optimize the loop away
        return res.json({ data: finddata, cpu_work: result });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


sbrn.listen(4047,'0.0.0.0',()=>{
    console.log("sbrn is listening ")
})