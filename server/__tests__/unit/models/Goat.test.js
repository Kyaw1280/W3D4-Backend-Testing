const db = require ("../../../database/connect")
const Goat = require("../../../models/Goat")

describe('Goat', () => {

    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())


    describe('getAll', () => {
        
        it('reslves with goats on successful db query', async () => {
        //Arrange
            const mockGoats = [
                {id: 1, name: 'g1', age: 1},
                {id: 2, name: 'g2', age: 2},
                {id: 3, name: 'g3', age: 3}
            ]
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockGoats })
        //Act
            const goats = await Goat.getAll()
        //Assert
            expect(goats).toHaveLength(3)
            expect(goats[0]).toHaveProperty('id')
            expect(goats[0].name).toBe('g1')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats")
        })

        it('should throw an Error when no goats are found', async () => {
        //Arrange
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: []})
        //Act & Assert
            await expect(Goat.getAll()).rejects.toThrow('No goats available.')
        })
    })



    describe('findById', () => {

        it('resolves with goat on successful db query', async () => {
            //Arrange
                const testGoat = [{ id: 1, name: 'goat', age: 22 }]
                jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testGoat})
            //Act
                const result = await Goat.findById(1)
            //Assert
            expect(result).toBeInstanceOf(Goat)
            expect(result.name).toBe('goat')
            expect(result.id).toBe(1)
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM goats WHERE id = $1', [1])
        })

        it('should throw an Error when goat is not found', async () => {
            //Arrange
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: []})
            //Act & Assert
            await expect(Goat.findById(999)).rejects.toThrow("This goat does not exist!")
        })
    })

    describe('create', () => { 
        it('resolves with goat on successful creation', async () => {
            //Arrange
           const goatData = { name: 'plum', age: 99}
           jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{...goatData, id: 1}] })
            //Act
          const result = await Goat.create(goatData)
            //Assert
            expect(result).toHaveProperty("id", 1)
            expect(result).toHaveProperty("name", "plum")
            expect(result).toHaveProperty("age", 99)
            expect(db.query).toHaveBeenCalledWith("INSERT INTO goats(name, age) VALUES ($1, $2) RETURNING *", [goatData.name, goatData.age])
            
        })

        it('should throw an Error when age is not found', async () => {
            //Arrange
            const incompleteGoatData = { name: 'plum'}
            //Act & Assert
            await expect(Goat.create(incompleteGoatData)).rejects.toThrow('age is missing');
        })

    })
})