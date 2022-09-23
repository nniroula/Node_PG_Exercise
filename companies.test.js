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
        console.log(testUser);
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

