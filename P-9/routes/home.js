const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Welcome</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>Welcome to our site</h1>
            </div>
        </body>
        </html>
    `);
});

module.exports = router;
