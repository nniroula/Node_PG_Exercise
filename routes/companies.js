// Step 2: Add Company Routes
// Create routes/companies.js with a router in it.

// All routes in this file should be found under companies/.

// All routes here will respond with JSON responses. These responses will be in an object format where the value is 
// the data from the database.

// So, for example, the “get list of companies should return”:
// {companies: [{code, name}, ...]}
// Assuming result is the result from your query, you could produce this with a line like:

// return res.json({companies: result.rows})
// These routes need to be given data in JSON format, not the standard “url-encoded form body” — so you’ll need to 
// make sure that your app.js includes the middleware to parse JSON.

const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');


// modify app.js to include to middleware to parse JSON from url-encoded form body.
router.get('/', async (req, res, next) => {
    let result = await db.query(`SELECT * FROM companies`);
    // return res.json(result.rows);
    return res.json({companies: result.rows});
})


// GET /companies/[code]
// Return obj of company: {company: {code, name, description}}
// If the company given cannot be found, this should return a 404 status response.

router.get("/:code", async (req, res, next) => {
    try{
        let { code } = req.params; 
        let result = await db.query(`SELECT * FROM companies WHERE code=$1`, [code])
        if(result.rows.length === 0){
            // return ({status: 404})
            return res.send({status: 404});
        }else{
            return res.send({company: result.rows[0]});
        }
    }catch(e){
        return next(e);
    }
})


// POST /companies
// Adds a company.
// Needs to be given JSON like: {code, name, description}
// Returns obj of new company: {company: {code, name, description}}

router.post('/', async (req, res, next) => {
    try{
        const { code, name, description } = req.body;
        const result = await db.query(`INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING 
        code, name, description`, 
        [code, name, description]);
        return res.status(201).json(result.rows)
    }catch(e){
        return next(e);
    }
})

// PUT /companies/[code]
// Edit existing company.
// Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description}
// Returns update company object: {company: {code, name, description}}

// router.patch('/:code', async (req, res, next) => {
router.put('/:code', async (req, res, next) => {
    try{
        const { name, description } = req.body;
        // const codeInParam = req.params.code;
        const code = req.params.code;

        const result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description',
        [name, description, code]);

        // debugger;
        if(result.rows.length === 0){
            throw new ExpressError(`comany with the code of ${code} does not exist`, 404)
        }else{
             // return res.send({company: {code, name, description}});
            return res.send({company: result.rows[0]});
        }
    }catch(e){
        return next(e);
    }
})

// DELETE
router.delete('/:code', async (req, res, next) => {
    try{
        const checkCode = await db.query('SELECT * FROM companies WHERE code=$1', [req.params.code]);
        // console.log(checkCode.rows.length);
        if(checkCode.rows.length === 0){
            return res.send({status: 404});
        }else{
            await db.query('DELETE FROM companies WHERE code=$1', [req.params.code])
            return res.send({status: "deleted"});
        } 
    }catch(e){
        return next(e);
    }
})


module.exports = router;