
import request from "supertest"
import {jest} from "@jest/globals"
import Uservar from "./user";
import { clerkMiddleware, requireAuth } from "@clerk/express";

jest.unstable_mockModule("@clerk/express",()=>({
    clerkMiddleware:()=>(req,res,next)=>next(),
    requireAuth:()=>(req,res,next)=>{
req.auth={userId:"suborna"},
next()
}})
)
const{app} =await import('./index.js')
const {prisma} =await import ("./client.js")


describe("index.js intigration test",()=>{
    beforeAll(async()=>{
        await prisma.$connect()
    })
    beforeEach(async()=>{
        await prisma.post.deleteMany({})
        await prisma.user.deleteMany({})
    })
    afterAll(async()=>{
        await prisma.$disconnect()
    })

    test("test creating post ",async()=>{
        const req=await request(app)
        .post("/create-post")
        .send({
            title:"post_1",
            content:"i love you emu so much",
            authorId:"suborna"
        })
        expect(req.status).toBe(200)
        expect(req.body.title).toBe("post_1")
        const findinthedb=await prisma.post.findFirst({
where:{
    title:"post_1"
}
        })
        expect(findinthedb).toBeDefined()
        
    })


    test("testing get-post",async()=>{
        const seeduser=await prisma.user.create({
            data:{id:"suborna"}
        })
        await prisma.post.create({
            data:{
                 title:"post_2",
            content:"i love you suborna so much",
            authorId:"suborna"
            }
        })
        const req=await request(app)
        .get("/get-post")

            expect(req.status).toBe(200)
    expect(req.body).toHaveLength(1)
    })

    test("test delete post",async()=>{
        const seedcrt =await prisma.user.create({
            data:{
                id:"suborna"
            }
        })
        const seedpost=await prisma.post.create({
            data:{
                title:'tobe deleted',
                content:"buy",
                authorId:"suborna"
            }
        })
        const req=await request(app)
        .delete("/delete-post")
        .send({
            id:seedpost.id
        })
expect(req.status).toBe(200)
const count=await prisma.post.count()
expect(count).toBe(0)

    })

})