//mock test for index.js 

import request from "supertest"
import {jest} from "@jest/globals"
import { clerkMiddleware, requireAuth } from "@clerk/express"



jest.unstable_mockModule("@clerk/express",()=>({
    clerkMiddleware:()=>(req,res,next)=>next(),
    requireAuth:()=>(req,res,next)=>{
        req.auth={userId:"suborna_love"}
    next()
    }
}))

jest.unstable_mockModule("@prisma/client",()=>{
    return{
        PrismaClient:class{
            constructor(){
                this.user={
                    findUnique:jest.fn(),
                    create:jest.fn()
                }
                this.post={
                    create:jest.fn(),
                    findUnique:jest.fn(),
                    findMany:jest.fn(),
                    deleteMany:jest.fn()
                }
            }
        }
    }
})

jest.unstable_mockModule('./user.js',()=>({
    default:jest.fn().mockResolvedValue({id:"suborna_from_db"})
}))

const {prisma} =await import ("./client.js")
const {app} =await import ("./index.js")

describe("Mock unit test for indecx.js",()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    })

    test("mock create post",async()=>{
        prisma.post.create.mockResolvedValue({
            title:"post_1",
            content:"i love suborna very much",
            authorId:"suborna_from_db" 
        })

        const req=await request(app)
        .post("/create-post")
        .send({
             title:"post_1",
            content:"i love suborna very much",
        })

        expect(req.status).toBe(200)
        expect(prisma.post.create).toHaveBeenCalledWith({
            data:{
                title:"post_1",
            content:"i love suborna very much",
            authorId:"suborna_from_db"
            }
        })
    })

    test("testing findmany post",async()=>{
        prisma.post.findMany.mockResolvedValue([
            {id:"post_1",title:"emu",content:"i love emu so much"},
            {id:"post_2",title:"suborna-love123",content:"she is damn cute broo"},
            {id:3,title:"oni_47",content:"oni is my heart"}
        ])

        const req=await request(app)
        .get("/get-post")
        
        expect(req.status).toBe(200)
        expect(prisma.post.findMany).toHaveBeenCalled()
        expect(req.body).toHaveLength(3)
    })


    test("deleting the post",async()=>{
        prisma.post.deleteMany.mockResolvedValue({count:3})

        const req=await request(app)
        .delete("/delete-post")
        .send({id:"post_1"})
        expect(req.status).toBe(200)
        expect(prisma.post.deleteMany).toHaveBeenCalled()
        expect(prisma.post.deleteMany).toHaveBeenCalledWith({
            where:{
                id:"post_1",
                authorId:"suborna_love"
            }
        })
    })
})
