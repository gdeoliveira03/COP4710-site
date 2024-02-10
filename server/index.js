const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB Configuration
const dbConfig = require('./dbconfig');
const pool = new Pool(dbConfig);

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

//check db
app.get('/checkdb', async (req, res) => {
    try {
        const client = await pool.connect();
        res.status(200).json({ success: true, message: 'Database connected successfully' });
        client.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ success: false, message: 'Unable to connect to the database'});
    }
});

///////////////////////////////////////Signup endpoint//////////////////////////////////////////////////////
app.post('/signup', async (req, res) => {
  const { username, password, email, userType } = req.body;

  if (!username || !password || !email || !userType) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  //user can only be 1 of 3 types
  const validUserTypes = ['student', 'admin', 'superAdmin'];
  if (!validUserTypes.includes(userType)) {
    return res.status(400).json({ success: false, message: 'Invalid userType' });
  }

    // Check if the userType is 'student' and if the email is a valid .edu address
    if (userType === 'student' && !email.endsWith('.edu')) {
        return res.status(400).json({ success: false, message: 'Student users must have a valid .edu email address' });
    }

  try {

    // Check if the username already exists
    const existingUser = await pool.query('SELECT user_id FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password, email, user_type) VALUES ($1, $2, $3, $4) RETURNING user_id',
      [username, hashedPassword, email, userType]
    );
    res.status(201).json({ success: true, userId: result.rows[0].id });
    
  } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ success: false, message: 'Error signing up' });
  }
});

////////////////////////////////////////////// login endpoint////////////////////////////////////////////////
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Retrieve user from the database
      const result = await pool.query(
          'SELECT username, password, email, user_type FROM users WHERE username = $1',
          [username]
      );

      if (result.rows.length === 0) {
          return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Compare passwords
      const user = result.rows[0];
      var passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ success: false, message: 'Invalid password'});
      }

      // extract university from email - should be implemented, WIP
      const email = user.email;
      var university = "";
      const atIndex = email.indexOf('@');
      const dotIndex = email.indexOf('.edu');

      // Check if both indices are found before extracting the substring
      if (atIndex !== -1 && dotIndex !== -1) {
        university = email.substring(atIndex + 1, dotIndex);
      } else {
        console.error("Email is not in the expected format");
      }   

      // return user type and email
      res.status(200).json({
      success: true,
      user: {
          username: user.username,
          email: user.email,
          userType: user.user_type,
          university: university
      }
    });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

///////////////////////////////////////////// Endpoint to delete a user/////////////////////////////////////////
app.delete('/delete_user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (bcrypt.compare(password, user.password)) {
      await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(401).json({ error: "Incorrect password" });
    }

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update user_id
app.put('/update_username/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { old_username, new_username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (bcrypt.compare(password, user.password)) {
      await pool.query('UPDATE users SET username = $1 WHERE username = $2', [new_username, old_username]);
      res.json({ message: "User ID updated successfully" });
    } else {
      res.status(401).json({ error: "Incorrect password" });
    }

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});