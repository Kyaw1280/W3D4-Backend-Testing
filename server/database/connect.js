const { Pool } = require('pg')

require('dotenv').config() // needed when integration testing is done

const db = new Pool({
  connectionString: process.env.DB_URL
})

module.exports = db

