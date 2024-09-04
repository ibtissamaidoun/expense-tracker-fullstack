const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT;

//middlewares
app.use(express.json());

// Configure CORS with options
app.use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

const server = () => {
    db();
    app.listen(PORT, () => {
        console.log('listening to port:', PORT);
    });
};

server();
