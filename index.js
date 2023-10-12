require('dotenv').config();
const express = require('express');
const db = require('./db.js');
const path = require('path');

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;

function checkAPIKey(req, res, next) {
    const apikey = req.query.apikey;
    if (apikey !== API_KEY)
        return res.status(401).send('Unauthorized');
    next();
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ error: 'Something failed!' });
}

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use('/api', checkAPIKey);  // Apply API key check to all /api routes

// Static files
app.use(express.static(path.join(__dirname, 'client/build')));


// List of paths to be handled by your React app
const reactPaths = [
    '/',
    '/update',
    '/history',
    // ... any other paths
];

// Serve index.html for specified React app paths
reactPaths.forEach(reactPath => {
    app.get(reactPath, (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
});

/* Technicians API */
app.get("/api/technicians", async (req, res, next) => {
    try {
        const query = 'SELECT name, status, time FROM users';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

/* Update Technicians API */
app.post("/api/update_technicians", async (req, res, next) => {
    const technicians = req.body.technicians;
    if (!Array.isArray(technicians) || technicians.length === 0)
        return res.status(400).send('Invalid input: expecting an array of technicians.');

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        const query = 'UPDATE users SET status = ? WHERE name = ?';
        for (let technician of technicians) {
            const { name, status } = technician;
            if (!name || !status) {
                await connection.rollback();
                return res.status(400).send('Invalid input: missing name or status for a technician.');
            }
            await connection.execute(query, [status, name]);
        }
        await connection.commit();
        connection.release();
        res.status(200).send('Technicians updated successfully.');
    } catch (error) {
        next(error);
    }
});

/* Technicians Status History API */
app.get("/api/history", async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const per_page = 50;
    const offset = (page - 1) * per_page;

    try {
        // Fetch data
        const query = `
            SELECT u.name, sh.status, sh.time
            FROM status_history sh
            JOIN users u ON sh.user_id = u.user_id
            ORDER BY sh.history_id DESC
            LIMIT ? OFFSET ?`;
        const [rows] = await db.query(query, [per_page, offset]);

        // Fetch total number of rows
        const [total_count_rows] = await db.query('SELECT COUNT(*) AS total_count FROM status_history');
        const total_count = total_count_rows[0].total_count;
        const total_pages = Math.ceil(total_count / per_page);

        // Respond with some freakin data
        res.json({
            data: rows,
            meta: { 
                current_page: page,
                per_page: per_page,
                total_pages: total_pages,
                total_count: total_count
            }
        });
    } catch (error) {
        next(error);
    }
});

// Error handler should be the last middleware
app.use(errorHandler);

// Database connection and server start
db.getConnection()
    .then((connection) => {
        connection.release();
        console.log('Connected to database');
        app.listen(port,() => { 
            console.log(`App listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });

