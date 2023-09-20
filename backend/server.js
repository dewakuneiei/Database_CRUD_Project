const express = require('express')
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project_wormbutterfly',
  port: 3306
});

app.use(express.json());
app.use(cors());


// -- Routes -- //

// GET ALL
app.get("/read", async(req,res) => {
  try {
    connection.query("SELECT * FROM users", (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      return res.status(200).json(results);
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

// GET SOME
app.get("/read/:id", async(req,res) => {
  
  const id = req.params.id;

  try {
    connection.query(
      "SELECT * FROM users WHERE user_id = ?",
      [id],
      (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      return res.status(200).json(results);
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

// UPDATE
app.put("/update/:id", async(req,res) => {
  
  const id = req.params.id;
  const {pname, username, password, email, hours} = req.body;

  try {
    connection.query(
      "UPDATE users SET name_profile  = ?, username = ?, password = ?, email = ?, amount_hours = ? WHERE customer_id = ?",
      [pname, username, password, email, hours],
      (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      return res.status(200).json({message: "Successfully updated!"});
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

// CREATE 
app.post("/create", async(req,res) => {
  const {pname, username, password, email, hours} = req.body;

  try {
    connection.query(
      "INSERT INTO users(name_profile, username, password, email, amount_hours, user_id) VALUES(?, ?, ?, ?, ?, 3)",
      [pname, username, password, email, hours],
      (err, results, field) => {
        if(err) {
          console.error("ERROR while inserting a user into the database", err);
          return res.status(400).send(err);
        }
        return res.status(201).json({message: "New user successfully created!"});
      }
    )

  } catch (err) {
      console.error(err.message);
      res.status(500).send();
  }
})

// DELETE
app.delete("/delete/:id", async(req,res) => {
  
  const id = req.params.id;

  try {
    connection.query(
      "DELETE FROM users WHERE user_id = ?",
      [id],
      (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      if(results.affectedRows === 0) {
        return res.status(404).json({message: "No customer exit in database."});
      }
      return res.status(200).json({message: "Successfully deleted!"});
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

app.listen(port, () => {
  `Server is running on port ${port}`
})