const express = require('express');
const path = require('path');
const app = express();

const homeRoute = require('./routes/home');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
