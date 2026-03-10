import express from "express"
import cors from "cors"
const app=express()
app.use(express.json())
app.use(cors())

app.get("/hellow",async(req,res)=>{
    res.json({msg:"hellow form the backend"})
})

app.listen(2017,()=>{
    console.log("emu si listening 2017")
})