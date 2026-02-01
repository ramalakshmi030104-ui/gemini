const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// UPDATE THESE WITH YOUR DATABASE CREDENTIALS
// Inside server.js

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Ladduda184@',  // <--- MAKE SURE THIS IS SAVED (Ctrl + S)
    database: 'rixi_db'
});

db.connect(err => {
    if (err) console.error('DB Connection Failed:', err);
    else console.log('Connected to MySQL Database');
});

// Register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
    [name, email, password], (err) => {
        if (err) return res.json({ success: false, message: 'Email already exists' });
        res.json({ success: true });
    });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', 
    [email, password], (err, results) => {
        if (results.length > 0) {
            const user = results[0];
            res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Save Chat
app.post('/save-chat', (req, res) => {
    const { userId, title, chatContent } = req.body;
    db.query('INSERT INTO chats (user_id, chat_title, chat_content) VALUES (?, ?, ?)', 
    [userId, title, JSON.stringify(chatContent)], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});
// --- NEW CODE: Get User's Chat History ---
app.get('/chats/:userId', (req, res) => {
    const userId = req.params.userId;
    // We select ID, Title, and Content so we can show them later
    const sql = 'SELECT id, chat_title, chat_content FROM chats WHERE user_id = ? ORDER BY created_at DESC';
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, chats: results });
    });
});
app.listen(3000, () => console.log('Server running on port 3000'));