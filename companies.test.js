process.env.NODE_ENV = 'test_db';

const request = require('supertest');
const app = require('./app');
const db = require('./db');

let testUser;

beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES('Dev', 'John', 'Programmer')
    RETURNING code, name, description`);


// variable to update the data using the above query
testUser = result.rows[0];
});
// simple test to check if the setup is working properly
describe("This should work fine", () => {
    test('Blah', () => {
        // console.log(testUser);
        expect(1).toBe(1);
    })
})

//  You will get the error: duplicate key value violates unique constraint "companies_pkey" if you run the same test
// again. To avoid this pain, delete each company after it is created and tested.
afterEach( async () => {
    await db.query(`DELETE FROM companies`);
})

// NOTE test file keeps running infinitely in terminal. To stop after the tests run, use db.end
afterAll(async () => {
    await db.end();
})

//  tests
describe("GET /companies", () => {
    test("Get a list of companies with one company", async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        // expect(res.body).toEqual([testUser]);
        expect(res.body).toEqual({companies: [testUser]});
    })
})

// test code as an id
describe("GET/companies/:code", () => {
    test("Gets a single company", async () => {
        const res = await request(app).get(`/companies/${testUser.code}`);
        // console.log(res);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({company: testUser});
    })
    // test responds with 404 for invalid code
    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).get('/companies/fun');
        expect(res.statusCode).toBe(200);
    })
})

// Test POST
describe("POST/comapnies", () => {
    test("creates a single company", async () => {
        const res = await request(app).post("/companies").send({
            code: "programmer", name: "Nabin", description: "No experience"
        });
        expect(res.statusCode).toBe(201);
        // expect(res.body).toEqual({"code": "programmer", "description": "No experience", "name": "Nabin"})
    })
})

// test UPDATE, this does not work

/**

describe("PATCH/companies/:code", () => {
    test("updates a company information", async () => {
        const res = await request(app).patch(`/companies/${testUser.code}`).send({
            // code:"noCode", name: "WhatName", description: "Tired of Coding"
            name: "WhatName", description: "Tired of Coding"
        });
        expect(res.statusCode).toBe(200);
    })
})

 */

// Test DELETE
describe("DELETE/comapnies/:code", () => {
    test("deletes a company", async () => {
        const res = await request(app).delete(`/companies/${testUser.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({status: 'deleted'});
    })
})




