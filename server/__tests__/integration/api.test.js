const request = require("supertest")
const app = require("../../app")
const { resetTestDB } = require("./config")


describe('Goat API Endpoints', () => {
    let api
  
    beforeEach(async () => {
      await resetTestDB()
    })
  
    beforeAll(() => {
        api = app.listen(4000, () => {
          console.log('Test server running on port 4000')
        })
      })
  
    afterAll((done) => {
      console.log('Gracefully closing server')
      api.close(done)
    })

    describe("GET /", () => {

        it('responds to Get / with a message and a description', async () => {
            // ARRANGE & ACT
            const response = await request(api).get("/")

            //ASSERT
            expect(response.statusCode).toBe(200)
            expect(response.body.message).toBe("welcome")
            expect(response.body.description).toBe("GOAT API")
        })
    })

    describe("GET /goats", () =>{
        it("should return all goats with a status code 200", async () => {
            //ARRANGE & ACT
            const response = await request(api).get("/goats")
            expect(response.status).toBe(200)
            expect(response.body.data).toBeInstanceOf(Array)
            expect(response.body.data.length).toBeGreaterThan(2)
        })  
    })

    describe("GET /goats/:id", () => {
        it("should return a specific goat by ID", async () => {
            //ARRANGE
            const goatID = 1
            //ACT
            const response = await request(api).get(`/goats/${goatID}`)
            //ASSERT
            expect(response.status).toBe(200)
            expect(response.body.data).toHaveProperty("id", goatID)
            // expect(response.body.data).toHaveProperty("name", "Declan Rice")
        })

        it("should return a 404 if goat is not found", async() => {
            //ARRANGE
            const nonExistantGoatID = 999
            //ACT
            const response = await request(api).get(`/goats/${nonExistantGoatID}`)
            //ASSERT
        })

        describe('POST /goats', () => {
            it('should create a new goat and return it', async () => {
              const newGoat = { name: 'Billy', age: 3 };
              const response = await request(api)
                .post('/goats')
                .send(newGoat);
        
              expect(response.status).toBe(201);
              expect(response.body.data).toHaveProperty('name', 'Billy');
              expect(response.body.data).toHaveProperty('age', 3);
            });
        
            it('should return a 400 if required fields are missing', async () => {
              const incompleteGoat = { name: 'Billy' };
              const response = await request(api)
                .post('/goats')
                .send(incompleteGoat);
        
              expect(response.status).toBe(400);
              expect(response.body.error).toBe('age is missing');
            });
          });

          describe('PATCH /goats/:id', () => {
            it('should update an existing goat and return it', async () => {
              const goatId = 1;
              const updatedGoat = { name: 'Updated Goat', age: 5 };
              const response = await request(api)
                .patch(`/goats/${goatId}`)
                .send(updatedGoat);
        
              expect(response.status).toBe(200);
              expect(response.body.data).toHaveProperty('name', 'Updated Goat');
              expect(response.body.data).toHaveProperty('age', 5);
            });
        
            it('should return a 400 if update fails due to missing data', async () => {
              const nonExistentGoatId = 999;
              const updateData = { name: 'Updated Goat', age: 5 };
        
              const response = await request(api).patch(`/goats/${nonExistentGoatId}`).send(updateData);;
        
              expect(response.status).toBe(400);
              expect(response.body.error).toBe('This goat does not exist!');
            });
          });
    })
})