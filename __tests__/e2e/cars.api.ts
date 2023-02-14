import request from 'supertest'
import {app} from '../../src'

describe('/my-cars', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and an empty array', async () => {
        await request(app)
            .get('/my-cars')
            .expect(200, [])
    })

    it('should return 404 for not existing id', async () => {
        await request(app)
            .get('/my-cars/1')
            .expect(404)
    })

    it(`shouldn't add a car with incorrect inupt data and return 400 bad request`, async () => {
        await request(app)
            .post('/my-cars')
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/my-cars')
            .expect(200)
    })

    let createdCar: any = null    
    it('should add a car with correct data and get status 201 created', async () => {
        const createResponce = await request(app)
            .post('/my-cars')
            .send({title: 'BMW X3'})
            .expect(201)

        createdCar = createResponce.body;

        expect(createdCar).toEqual({
            id: expect.any(Number),
            title: 'BMW X3'
        })

        await request(app)
            .get('/my-cars')
            .expect(200, [createdCar])  
    })

    it(`shouldn't update the course with incorrect input data`, async () => {
            await request(app)
                .put('/my-cars/' + createdCar.id)
                .send({title: ''})
                .expect(400)

            await request(app)
                .get('/my-cars/'+createdCar.id)
                .expect(200, createdCar)
    })

    it(`shouldn't update the course that not exist`, async () => {
        await request(app)
            .put('/my-cars/2')
            .send({title: 'Mitshubishe EVO'})
            .expect(404)
    })

    it('should update course with correct data', async () => {
        await request(app)
            .put('/my-cars/1')
            .send({title: 'Opel Astra'})

        await request(app)
            .get('/my-cars/1')
            .expect(200, {
                ...createdCar,
                title: 'Opel Astra'
            })
    })

    it('should delete the course', async () => {
        await request(app)
            .delete('/my-cars/1')
            .expect(204)

        await request(app)
            .get('/my-cars')
            .expect(200, [])
    })
})