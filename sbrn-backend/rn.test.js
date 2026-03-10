import { clerkMiddleware, requireAuth } from '@clerk/express'
import {jest} from '@jest/globals'

//import { Prisma, PrismaClient } from '@prisma/client'
import request from 'supertest'

//mock clerk 

jest.unstable_mockModule('@clerk/express',()=>({
  clerkMiddleware:()=>(req,res,next)=>next(),
  requireAuth:()=>(req,res,next)=>{
req.auth={userId:"test_user123"}
next()
  }
})
)


//mock prisma 

jest.unstable_mockModule('@prisma/client',()=>{
return{
  PrismaClient:class{
    constructor(){
      this.user={
        deleteMany:jest.fn(),
        findMany:jest.fn(),
        create:jest.fn()
      }
      this.post={
         deleteMany:jest.fn(),
        findMany:jest.fn(),
        create:jest.fn()
      }
    }
  }
}
})

jest.unstable_mockModule('./user.js',()=>({
  default:jest.fn().mockResolvedValue({id:"db_123"})
}))
const{app} =await import('./index.js')
//follow the singletone pattern 
const{prisma} =await import('./client.js')

describe("testing req",()=>{


  beforeEach(()=>{
    jest.clearAllMocks()
  })


  test("mock create ",async()=>{
prisma.post.create.mockResolvedValue({
  id:'post_123',
  title:'emu',
  content:'she is damn cute'
})

const res=await request(app)
.post("/create-post")
.send({
  title:"emu",
  content:"she is damn cute"
})

expect(res.body.title).toBe("emu")
expect(res.status).toBe(200)
expect(prisma.post.create).toHaveBeenCalledWith({
  data:{
    title:"emu",
    content:"she is damn cute",
    authorId:"db_123"
  }
})
  })


  test("testing the get request",async()=>{
    prisma.post.findMany.mockResolvedValue([
      {id:"12",title:"post_1223"},
      {id:"23",title:"post_6472"}
    ])
const res=await request(app).get("/get-post")
expect(res.status).toBe(200)
expect(prisma.post.findMany).toHaveBeenCalled()
expect(res.body).toHaveLength(2)

  })

test("testing delete request",async()=>{
  prisma.post.deleteMany.mockResolvedValue({count:2})

  const res=await request(app).delete("/delete-post")
  .send({id:"post_1223"})
  expect(res.status).toBe(200)
  expect(prisma.post.deleteMany).toHaveBeenCalled()
  expect(prisma.post.deleteMany).toHaveBeenCalledWith({
    where:{
      id:"post_1223",
    authorId:"test_user123"
    }
  })
})


})
