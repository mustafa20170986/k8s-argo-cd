import {jest} from "@jest/globals"
//import { PrismaClient } from "@prisma/client"
//import { create } from "domain"


jest.unstable_mockModule('@prisma/client',()=>{
  return{
    PrismaClient:class{
      constructor(){
        this.user={
          findUnique:jest.fn(),
          create:jest.fn()
        };
      }
    }
  }
});

const {prisma} =await import ("./client.js")
const{default: Uservar}=await import ('./user.js')

describe("tesing uservar",()=>{

  beforeEach(()=>{
    jest.clearAllMocks
  })
  test("tesing user verfivation",async()=>{
prisma.user.findUnique.mockResolvedValue({id:"suborna"})
const result =await Uservar('suborna')

expect(result.id).toBe('suborna')

  })
})