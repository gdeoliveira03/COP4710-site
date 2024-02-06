const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

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

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password, email, userType } = req.body;

  if (!username || !password || !email || !userType) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {

    // Check if the username already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password, email, user_type) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, hashedPassword, email, userType]
    );
    res.status(201).json({ success: true, userId: result.rows[0].id });
    
  } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ success: false, message: 'Error signing up' });
  }
});

// login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Retrieve user from the database
      const result = await pool.query(
          'SELECT id, username, password FROM users WHERE username = $1',
          [username]
      );

      if (result.rows.length === 0) {
          return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Compare passwords
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      res.status(200).json({ success: true, userId: user.id });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ success: false, message: 'Error logging in' });
  }
});