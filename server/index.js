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