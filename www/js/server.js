const express = require("express");
const { Client } = require("pg");
const app = express();

// implement cors policies middleware
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

// instantiate client object
const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "seminar",
  password: "secret_password",
  database: "abschluss_db",
});

// connect client to server
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
  } catch (error) {
    console.log(error);
  }
});

// get obstruction by id
app.get("/getObstructionById/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const sql_result = await client.query(
      `SELECT * FROM meldungen WHERE id = ${id}`
    );

    res.status(200).send(sql_result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// filter obstructions
app.get("/filterObstructions", async (req, res) => {
  const { days, selectedTypes, dateStart, dateEnd } = req.query;

  const providedDays = days !== "";
  const providedTypes = req.query.hasOwnProperty("selectedTypes");
  const providedTimestamp = req.query.dateStart !== "";
  let sql_result;

  // split date type at T and replace hyphens with empty string
  const start = dateStart.split("T")[0].replace(/-/g, "");
  const end = dateEnd.split("T")[0].replace(/-/g, "");

  // filter queries
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
      sql_result = await client.query(
        `SELECT latitude, longitude, id, type FROM meldungen WHERE date >= TO_DATE('${start}', 'YYYYMMDD') AND date < TO_DATE('${
          end + 1
        }', 'YYYYMMDD')`
      );
    } else if (!providedDays && providedTypes && providedTimestamp) {
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

    res.status(200).send(sql_result);
  } catch (error) {
    res.status(400).send({ results: error });
  }
});

// get all obstructions
app.get("/getAllObstructions", async (req, res) => {
  try {
    const sql_result = await client.query(
      "SELECT name, latitude, longitude, type, date, id FROM meldungen"
    );
    res.status(200).send(sql_result);
  } catch (error) {
    res.status(400).send({ results: error });
  }
});

// start server on port 41782
const server = app.listen(41782, () => {
  const port = server.address().port;
  console.log(`server running on port ${port}`);
});
