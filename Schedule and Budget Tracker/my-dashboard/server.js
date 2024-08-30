const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

// SQL Server configuration
const config = {
    user: 'DESKTOP-OFPAL9A\User', // replace with your database username
    password: 'your-password', // replace with your database password
    server: 'localhost', // replace with your server's IP address or hostname
    database: 'DashboardDB', // your database name
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the SQL Server database.');
});

// Register Route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
        await sql.query`INSERT INTO Users (Email, PasswordHash) VALUES (${email}, ${hashedPassword})`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
        const user = result.recordset[0];
        if (user && await bcrypt.compare(password, user.PasswordHash)) { // Compare hashed passwords
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});