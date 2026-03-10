import express from "express"
import cors from "cors"


const app=express()
app.use(express.json())
app.use(cors())

app.get("/suborna",async(req,res)=>{
    res.json({
        message:"i love you suborna"
    })
})

app.listen(3075,()=>{
    console.log("sbrn is listening")
})