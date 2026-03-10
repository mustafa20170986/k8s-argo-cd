import{jest} from "@jest/globals"
import{prisma} from "./cleint.js"
import Uservar from "./user.js"

describe("intigraiton test for user ver",()=>{
  beforeAll(async()=>{
    await prisma.$connect()
  })
  beforeEach(async()=>{
    await prisma.user.deleteMany()
  })
  afterEach(async()=>{
    jest.clearAllMocks()
  })
  afterAll(async()=>{
    await prisma.$disconnect()
  })

  

  test("return  user  test",async()=>{
    const userid="suborna-love"
    const res=await Uservar(userid)

    expect(res).toBeDefined()
    expect(res?.id).toBe(userid)
    const fnduser=await prisma.user.findUnique(userid)
    expect(fnduser).not.toBeNull()
  })

  test("creating  user test",async()=>{
    const existing ="suborna-love"
    const result=await Uservar(existing)

expect(result.id).toBe(existing)
const count=await prisma.user.count()
expect(count).toBe(1)
  })


})