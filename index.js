const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const db = require('./db.js');

app.get('/api/technicians', async (req, res) => {
  try {
    const query = 'SELECT name, status, time FROM users';
    const [rows] = await db.query(query);

    // Send the technician data as a JSON response
    res.json(rows);
  } catch (error) {
    console.log('Error fetching technicians:', error);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
});

// Serve static files from the "client/build" directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve the index.html file on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Test database connection
db.getConnection()
  .then(connection => {
    connection.release();
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to the database:', err.stack);
  });

