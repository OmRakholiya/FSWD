const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    fs.readFile("error.log", "utf8", (err, data) => {
        if (err) {
            res.send("Error: Cannot read log file!");
        } else {
            res.send(`<h1>Error Logs</h1><pre>${data}</pre>`);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
