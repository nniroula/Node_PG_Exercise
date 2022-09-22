// Step 2: Add Company Routes
// Create routes/companies.js with a router in it.

// All routes in this file should be found under companies/.

// All routes here will respond with JSON responses. These responses will be in an object format where the value is 
// the data from the database.

// So, for example, the “get list of companies should return”:

// So, for example, the “get list of companies should return”:

// {companies: [{code, name}, ...]}
// Assuming result is the result from your query, you could produce this with a line like:

// return res.json({companies: result.rows})
// These routes need to be given data in JSON format, not the standard “url-encoded form body” — so you’ll need to 
// make sure that your app.js includes the middleware to parse JSON.

const express = require('express');
const router = express.Router();
const db = require('../db')


// modify app.js to include to middleware to parse JSON from url-encoded form body.
router.get('/', async (req, res, next) => {
    let result = await db.query(`SELECT * FROM companies`);
    // return res.json(result.rows);
    return res.json({companies: result.rows});
})

module.exports = router;