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

////////////////////////////////////////////////////Endpoint to edit username/////////////////////////////////
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

// Middleware 
const isAdmin = async (req, res, next) => {
  const { admin_id } = req.body;
  
  try {
    const result = await pool.query('SELECT user_type FROM users WHERE user_id = $1', [admin_id]);
    var isAdmin = false;
    if(result.rows[0]?.user_type == "admin"){
      isAdmin = true;
    }
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can create events" });
    }
    
    next();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const isSuperAdmin = async (req, res, next) => {
  const { superadmin_id } = req.body;
  
  try {
    const result = await pool.query('SELECT user_type FROM users WHERE user_id = $1', [superadmin_id]);
    var isAdmin = false;
    if(result.rows[0]?.user_type == "superAdmin"){
      isAdmin = true;
    }
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Only superAdmins can do this action" });
    }
    
    next();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
};

function validateRating(rating) {
  // Ensure rating is within the range of 1 to 5
  return Math.max(1, Math.min(5, rating));
}

//////////////////////////////////////////Event creation//////////////////////////////////////////////
app.post('/create_event', isAdmin, async (req, res) => {
  const { name, category, description, date, time, location, contact_phone, contact_email, university_id, admin_id, is_public, is_rso_event } = req.body;

  try {
    const result = await pool.query('INSERT INTO events (name, category, description, date, time, location, contact_phone, contact_email, university_id, admin_id, is_public, is_rso_event) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [name, category, description, date, time, location, contact_phone, contact_email, university_id, admin_id, is_public, is_rso_event]);
    
    const createdEvent = result.rows[0];
    res.json({ message: "Event created successfully", event: createdEvent });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
  }
});

/////////////////////////////////////////////Event Gets - public, private, rso////////////////////////////////////////////////////
app.get('/public_events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE is_public = true');
    const events = result.rows;
    res.json(events);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/private_events/:university_id', async (req, res) => {
  const { university_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM events WHERE is_public = false AND university_id = $1', [university_id]);
    const events = result.rows;
    res.json(events);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/rso_events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE is_rso_event = true');
    const events = result.rows;
    res.json(events);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


///////////////////////////////////////////////Endpoint to get an event by ID/////////////////////////////////
app.get('/get_event/:event_id', async (req, res) => {
  const { event_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
    const event = result.rows[0];

    if (!event) {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.json(event);
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  } finally {

  }
});

///////////////////////////////////////////////Endpoint to update an event////////////////////////////////////////
app.put('/update_event/:event_id', async (req, res) => {
  const { event_id } = req.params;
  const { name, category, description, date, time, location, contact_phone, contact_email, university_id, admin_id, is_public, is_rso_event } = req.body;

  try {
    const result = await pool.query('UPDATE events SET name = $1, category = $2, description = $3, date = $4, time = $5, location = $6, contact_phone = $7, contact_email = $8, university_id = $9, admin_id = $10, is_public = $11, is_rso_event = $12 WHERE event_id = $13 RETURNING *',
      [name, category, description, date, time, location, contact_phone, contact_email, university_id, admin_id, is_public, is_rso_event, event_id]);
    
    const updatedEvent = result.rows[0];

    if (!updatedEvent) {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.json({ message: "Event updated successfully", event: updatedEvent });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    
  }
});

/////////////////////////////////////////////Endpoint Event Deletion/////////////////////////////////////////////////
app.delete('/delete_event/:event_id', async (req, res) => {

  const { event_id } = req.params;

  try {

    await pool.query('DELETE FROM comments WHERE event_id = $1', [event_id]); //delete all related comments

    const result = await pool.query('DELETE FROM events WHERE event_id = $1 RETURNING *', [event_id]);
    const deletedEvent = result.rows[0];

    if (!deletedEvent) {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.json({ message: "Event deleted successfully", event: deletedEvent });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    
  }
});

////////////////////////////////////////////Create University////////////////////////////////////////////////
app.post('/add_university', isSuperAdmin, async (req, res) => {
  const { name, location, description, num_students, pictures, superadmin_id} = req.body;

  try {
    const result = await pool.query('INSERT INTO universities (name, location, description, num_students, pictures) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, location, description, num_students, pictures]);
    
    const createdUniversity = result.rows[0];
    res.json({ message: "University created successfully", university: createdUniversity });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////////////////////////////Get Universities//////////////////////////////////////////
app.get('/universities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM universities');
    const universities = result.rows;
    res.json(universities);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

///////////////////////////////////////////Update Uni Info//////////////////////////////////////////////
app.put('/update_university/:university_id', async (req, res) => {
  const { university_id } = req.params;
  const { name, location, description, num_students, pictures } = req.body;

  try {
    const result = await pool.query('UPDATE universities SET name = $1, location = $2, description = $3, num_students = $4, pictures = $5 WHERE university_id = $6 RETURNING *',
      [name, location, description, num_students, pictures, university_id]);
    
    const updatedUniversity = result.rows[0];

    if (!updatedUniversity) {
      res.status(404).json({ error: "University not found" });
    } else {
      res.json({ message: "University updated successfully", university: updatedUniversity });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

////////////////////////////////////////////Delete university///////////////////////////////////////////
app.delete('/delete_university/:university_id', async (req, res) => {
  const { university_id } = req.params;

  try {
    const result = await pool.query('DELETE FROM universities WHERE university_id = $1 RETURNING *', [university_id]);
    const deletedUniversity = result.rows[0];

    if (!deletedUniversity) {
      res.status(404).json({ error: "University not found" });
    } else {
      res.json({ message: "University deleted successfully", university: deletedUniversity });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

////////////////////////////////////////// CREATE a comment///////////////////////////////////////////////
app.post('/create_comment', async (req, res) => {
  const { user_id, event_id, content, rating } = req.body;
  const validatedRating = validateRating(rating); // Validate the rating
  const created_at = new Date(); // Assuming server time

  try {

    const eventResult = await pool.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
    const event = eventResult.rows[0];
    
    if (!event) {
      // If the event doesn't exist, send an error message
      res.status(404).json({ error: "Event not found" });
    }

    const result = await pool.query(
      'INSERT INTO comments (user_id, event_id, content, rating, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, event_id, content, validatedRating, created_at]
    );

    const createdComment = result.rows[0];
    res.json({ message: "Comment created successfully", comment: createdComment });
  } catch (err) {
    console.error('Error creating comment', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

///////////////////////////////////////////////////////READ comments///////////////////////////////////////
app.get('/get_comments/:event_id', async (req, res) => {
  const { event_id } = req.params;

  try {
    const eventResult = await pool.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
    const event = eventResult.rows[0];
    
    if (!event) {
      // If the event doesn't exist, send an error message
      res.status(404).json({ error: "Event not found" });
    } else {
      // If the event exists, retrieve comments for the event
      const commentResult = await pool.query('SELECT * FROM comments WHERE event_id = $1', [event_id]);
      const comments = commentResult.rows;
      res.json(comments);
    }
  } catch (err) {
    console.error('Error retrieving comments', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

////////////////////////////////////////////////////////DELETE a comment/////////////////////////////////////
app.delete('/delete_comment/:comment_id', async (req, res) => {
  const { comment_id } = req.params;

  try {
    await pool.query('DELETE FROM comments WHERE comment_id = $1', [comment_id]);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error('Error deleting comment', err);
    res.status(500).json({ error: "Internal server error" });
  }
});
