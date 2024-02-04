require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'root',
    host: '104.236.1.63',
    database: 'cop4710',
    password: 'Cop4710Vu',
    port: '5432',
});

pool.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        // Perform database operations here
    })
    .catch((error) => {
        console.error('Error connecting to PostgreSQL database:', error);
    })
    .finally(() => {
        // Close the connection when done
        pool.end();
    });

//get all merchants our database
const getUsers = async () => {
    try {
      return await new Promise(function (resolve, reject) {
        pool.query("SELECT * FROM users", (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found"));
          }
        });
      });
    } catch (error_1) {
      console.error(error_1);
      throw new Error("Internal server error");
    }
  };
  //create a new user record in the databse
  //************ need to account for user_id
  const createUsers = (body) => {
    return new Promise(function (resolve, reject) {
      const { username, email, password, user_type } = body;
      pool.query(
        "INSERT INTO users (username, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, email, password, user_type],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(
              `A new user has been added: ${JSON.stringify(results.rows[0])}`
            );
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  };
  //delete a user
  const deleteUser = (id) => {
    return new Promise(function (resolve, reject) {
      pool.query(
        "DELETE FROM users WHERE id = $1",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(`User deleted with ID: ${id}`);
        }
      );
    });
  };
  //update a user record
  const updateUser = (id, body) => {
    return new Promise(function (resolve, reject) {
        const { username, email, password, user_type } = body;
      pool.query(
        "UPDATE users SET username = $1, email = $2, password = $3, user_type = $4 WHERE id = $5 RETURNING *",
        [username, email, password, user_type, id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(`User updated: ${JSON.stringify(results.rows[0])}`);
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  };
  module.exports = {
    getUsers,
    createUsers,
    deleteUser,
    updateUser
  };