const express = require('express');
const app = express();
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.listen(5000, () => {
    console.log("Server started on Port 5000")
});

const db = require('./db');

app.get('/', (req, res) => {
    db.getUsers()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.post('/users', (req, res) => {
    db.createUser(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.delete('/users/delete/:id', (req, res) => {
    db.deleteUser(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.put("/users/update/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    db
      .updateUser(id, body)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
});

