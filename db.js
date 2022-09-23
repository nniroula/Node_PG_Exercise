/** Database setup for BizTime. */
const { Client } = require('pg');

let DB_URI;

// if(process.env.NODE_EN === "test"){
if(process.env.NODE_ENV === "test"){
    DB_URI = "postgresql:///test_db";
}else{
    DB_URI = "posgresql:///biztime";
}

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;


