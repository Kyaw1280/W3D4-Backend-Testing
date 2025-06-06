const { Pool } = require('pg')
const fs = require('fs')
require('dotenv').config()

const resetSQL = fs.readFileSync(__dirname + '/reset.sql').toString()

const resetTestDB = async () => {
    try {
        const db = new Pool({
            connectionString: process.env.DB_TEST_URL
        })

        await db.query(resetSQL)
        await db.end()
        console.log("Test DB reset successfully");
    } catch (err) {
        console.log("Could not reset TestDB", err);
    }
}

module.exports = {
    resetTestDB
}