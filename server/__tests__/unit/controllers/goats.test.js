const goatsControllers = require('../../../controllers/goats')
const Goat = require('../../../models/Goat')

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}))

const mockRes = { status: mockStatus }


describe ("Goats controllers", () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

it("should return goats with a status code of 200", async () => {
    //Mock the response form Goat.getAll
    //Arrange
    const testGoats = ['g1', 'g2']
    jest.spyOn(Goat, "getAll").mockResolvedValue(testGoats)
    // Act
    await goatsControllers.index(null, mockRes)
    //Assert
    expect(Goat.getAll).toHaveBeenCalledTimes(1)
    expect(mockStatus).toHaveBeenCalledWith(200)
    expect(mockSend).toHaveBeenCalledWith({ data: testGoats})
})

it('should return an error upon failure', async () => {
    //Arrange
    jest.spyOn(Goat, 'getAll').mockRejectedValue(new Error("Something happened to your db"))
    //Act
    await goatsControllers.index(null, mockRes)
    //Assert
    expect(Goat.getAll).toHaveBeenCalledTimes(1)
    expect(mockStatus).toHaveBeenCalledWith(500)
    expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your db"})
})

describe("show", () => {

    let testGoat, mockReq

    beforeEach(() => {
        testGoat = { id: 1, name: "test goat", age: 22 }
        mockReq = { params: { id: 1}}
    })

    it("should return a goat with a 200 status", async () => {
        //Arrange
        jest.spyOn(Goat, "findById").mockResolvedValue(testGoat)
        //Act
        await goatsControllers.show(mockReq, mockRes)
        //Assert
        expect(Goat.findById).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockSend).toHaveBeenCalledWith({ data: new Goat(testGoat) })
    })

    it("should return an error if the goat is not found", async () => {
        //Arrange
        jest.spyOn(Goat, "findById").mockRejectedValue( new Error ("Oh no"))
        //Act
        await goatsControllers.show(mockReq, mockRes)
        //Assert
        expect(Goat.findById).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(404)
        expect(mockSend).toHaveBeenCalledWith ({ "error": "Oh no"})
    })
})

    describe("create", () => {
        it("should return a new goat with a 201 status code", async () => {
            //Arrange
            let testGoat = { name: "test goat", age: 22, id: 4 }
            const mockReq = { body: testGoat}
            jest.spyOn(Goat, 'create').mockResolvedValue(new Goat(testGoat))
            //Act
            await goatsControllers.create(mockReq, mockRes)
            //Assert
            expect(Goat.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(201)
            expect(mockSend).toHaveBeenCalledWith({ data: new Goat({ ...testGoat }) })
        })

        it('should return an error if creation fails', async () => {
            //Arrange
            let testGoat = { name: 'Test Goat' }
            const mockReq = { body: testGoat }
            jest.spyOn(Goat, 'create').mockRejectedValue(new Error('oh no'))
            //Act
            await goatsControllers.create(mockReq, mockRes)
            //Assert
            expect(Goat.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({ error: 'oh no' })
          })
    })
})