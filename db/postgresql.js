const { Client } = require('pg')

class PostgresqlDb {
    constructor() {
        this.client = null;
        this.#run()
    }

    #run = async function () {
        const client = new Client({
            host: process.env.PG_DATABASE_HOST,
            port: process.env.PG_DATABASE_PORT,
            database: process.env.PG_DATABASE_NAME,
            user: process.env.PG_DATABASE_USER,
            password: process.env.PG_DATABASE_PASSWORD
        })
        try {
            await client.connect();
            console.log("Pinged your deployment. You successfully connected to Postgresql DB!");
            this.client = client;
        } catch (error) {
            console.log(error)
        }
    }
}

const postgresqlDb = new PostgresqlDb()
module.exports = postgresqlDb