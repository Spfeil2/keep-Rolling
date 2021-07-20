const express = require('express')
const cors = require('cors')
// object destruction, only client from package
const { Client } = require('pg');
const app = express()

app.use(cors())
// parsen
app.use(express.json())

const client = new Client({
    "host": "127.0.0.1",
    "port": 5432,
    "user": "seminar",
    "password": "secret_password",
    "database": "abschluss_db"
})

// connect client global to allow reuse (https://node-postgres.com/api/client)
client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })

// post request insert new meldungen
app.post('/meldungen', async (req, res) => {
    try {
        console.log(req.body)

        let date = new Date();

        console.log(date)

        const {name, mail, description, type, latitude, longitude} = req.body
        // sql injections verhindern?
        const sql_insert = `INSERT INTO meldungen (name, date, mail, description, type, latitude, longitude) VALUES('${name}', '${date}', '${mail}', '${description}', '${type}', '${latitude}', '${longitude}')`
        const response = await client.query(sql_insert)
        console.log(response)
        
        res.status(200).send({message: "Working"})
    } catch (e) {
        console.log(e)
    }
})


// get all data
app.get('/getAll', async (req, res) => {
    try{
        const sql_result = await client.query("SELECT * FROM meldungen")
        res.status(200).send({results:sql_result.rows})
    } catch (e) {
        console.log(e)
    }
  })

  
  app.get('/filterType', async (req, res) => {
    try{
        const sql_result = await client.query("SELECT * FROM meldungen WHERE type='vegetation'")
        res.status(200).send({results:sql_result.rows})
    } catch (e) {
        console.log(e)
    }
  })

  app.get('/filterDate', async (req, res) => {
    try{
        const sql_result = await client.query("SELECT * FROM meldungen WHERE date BETWEEN '20210715' and '20210717'")
        res.status(200).send({results:sql_result.rows})
    } catch (e) {
        console.log(e)
    }
  })

  app.get('/filterDateAge', async (req, res) => {
    try{
        const sql_result = await client.query("SELECT * FROM meldungen WHERE date > (CURRENT_DATE - INTERVAL '3 days');")
        res.status(200).send({results:sql_result.rows})
    } catch (e) {
        console.log(e)
    }
  })


  app.get('/updateBehoben', async (req, res) => {
    try{
        const sql_result = await client.query("UPDATE meldungen SET behoben = true WHERE id =12")
        res.status(200).send({results:sql_result.rows})
    } catch (e) {
        console.log(e)
    }
  })


// unique port, listen ist das letzte was ausgeführt werden soll 
const server = app.listen(41783, () => {
    const port = server.address().port
    console.log(`server running on port ${port}`)
})





