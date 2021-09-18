const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
// object destruction, only client from package
const { Client } = require("pg");
const app = express();


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST", "DELETE");
  
  res.setHeader("Access-Control-Allow-Credentials", false);
  next();
}); 

// increase payload limit
app.use(express.json({limit: '10mb'}));

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "seminar",
  password: "secret_password",
  database: "abschluss_db",
});

// connect client global to allow reuse (https://node-postgres.com/api/client)
client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

// post request insert new meldungen and return id 
app.post("/postObstruction", async (req, res) => {
  try {
    const { name, mail, description, type, date, featureCoordinates, image } = req.body;

    const latitude = featureCoordinates.lat;
    const longitude = featureCoordinates.lng;

    const sql_insert = `INSERT INTO meldungen (name, date, mail, description, type, latitude, longitude, photo) VALUES('${name}', '${date}', '${mail}', '${description}', '${type}', '${latitude}', '${longitude}', '${image}') RETURNING id`;
    const response = await client.query(sql_insert);

    // send id to client for further request
    res.status(200).json({id: response.rows[0].id});
  } catch (e) {
    console.log(e);
  }
});

// get obstruction by id
app.get("/getObstructionById/:id", async (req, res) => {
  const id = parseInt(req.params.id);
 //console.log(id)

  try {
    const sql_result = await client.query(
      `SELECT * FROM meldungen WHERE id = ${id}`
    );
    // console.log(sql_result.rows)
    res.status(200).send(sql_result);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// filter obstructions
app.get("/filterObstructions", async (req, res) => {
  const { days, selectedTypes, dateStart, dateEnd } = req.query;

  const providedDays = req.query.days !== "";
  const providedTypes = req.query.hasOwnProperty("selectedTypes");
  const providedTimestamp = req.query.dateStart !== "";
  let sql_result;

  // split date type at T and replace hyphens with empty string
  const start = dateStart.split("T")[0].replace(/-/g, "");
  const end = dateEnd.split("T")[0].replace(/-/g, "");

  try {
    if (providedDays && !providedTypes && !providedTimestamp) {
      sql_result = await client.query(
        `SELECT latitude, longitude, id, type FROM meldungen WHERE date BETWEEN CURRENT_DATE - ${req.query.days} and CURRENT_DATE`
      );
    } else if (providedDays && providedTypes && !providedTimestamp) {
      const offset = 1;
      const placeholders = selectedTypes
        .map(function (name, i) {
          return "$" + (i + offset);
        })
        .join(",");

      sql_result = await client.query(
        "SELECT latitude, longitude, id, type FROM meldungen WHERE (date BETWEEN CURRENT_DATE - " +
          req.query.days +
          " and CURRENT_DATE) and type IN (" +
          placeholders +
          ")",
        selectedTypes
      );
    } else if (!providedDays && providedTypes && !providedTimestamp) {
      const offset = 1;
      const placeholders = selectedTypes
        .map(function (name, i) {
          return "$" + (i + offset);
        })
        .join(",");

      sql_result = await client.query(
        "SELECT latitude, longitude, id, type FROM meldungen WHERE type IN (" +
          placeholders +
          ")",
        selectedTypes
      );
    } else if (!providedDays && !providedTypes && providedTimestamp) {
      console.log(1);

      sql_result = await client.query(
        `SELECT latitude, longitude, id, type FROM meldungen WHERE date >= TO_DATE('${start}', 'YYYYMMDD') AND date < TO_DATE('${
          end + 1
        }', 'YYYYMMDD')`
      );
    } else if (!providedDays && providedTypes && providedTimestamp) {
      console.log(5);

      const offset = 1;
      const placeholders = selectedTypes
        .map(function (name, i) {
          return "$" + (i + offset);
        })
        .join(",");

      sql_result = await client.query(
        "SELECT latitude, longitude, id, type FROM meldungen WHERE (date >= TO_DATE('" +
          start +
          "', 'YYYYMMDD') AND date < TO_DATE('" +
          end +
          1 +
          "', 'YYYYMMDD')) and type IN (" +
          placeholders +
          ")",
        selectedTypes
      );
    }

    console.log(sql_result.rows);
    res.status(200).send(sql_result);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// get all data
app.get("/getAllObstructions", async (req, res) => {
  // only the locations because of performance reasons
  try {
    const sql_result = await client.query(
      "SELECT name, latitude, longitude, type, date, id FROM meldungen"
    );
    res.status(200).send(sql_result);
  } catch (e) {
    res.status(400).send({ results: e });
  }
});



/* 
app.get('/filterType', async (req, res) => {
  try{
      const sql_result = await client.query("SELECT *** FROM meldungen WHERE type='vegetation'")
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
}) */

app.delete("/delete", async (req, res) => {

  try {
    const sql_result = await client.query("DELETE FROM meldungen");

    res.status(200).send(sql_result);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const sql_result = await client.query(
      `DELETE FROM meldungen WHERE id = ${id}`
    );

    res.status(200).send(sql_result);
  } catch (e) {
    console.log(e);
  }
});

// unique port, listen ist das letzte was ausgefÃ¼hrt werden soll
const server = app.listen(41781, () => {
  const port = server.address().port;
  console.log(`server running on port ${port}`);
});
