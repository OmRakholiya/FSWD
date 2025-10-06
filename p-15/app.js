const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "librarySecretKey", // change for production
    resave: false,
    saveUninitialized: true,
  })
);

// Serve static HTML files
app.get("/", (req, res) => {
    if (req.session.username) {
        res.redirect("/profile");
    } else {
        res.sendFile(path.join(__dirname, "views", "login.html"));
    }
});

// Handle login
app.post("/login", (req, res) => {
  const username = req.body.username;

  if (username && username.trim() !== "") {
    req.session.username = username;
    req.session.loginTime = new Date().toLocaleString();
    res.redirect("/profile");
  } else {
    res.send("Please enter a valid name. <a href='/'>Try again</a>");
  }
});

// Profile route
app.get("/profile", (req, res) => {
  if (req.session.username) {
    res.send(`
      <h1>Welcome, ${req.session.username}</h1>
      <p>Login Time: ${req.session.loginTime}</p>
      <form action="/logout" method="POST">
        <button type="submit">Logout</button>
      </form>
    `);
  } else {
    res.redirect("/");
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Library Portal running at http://localhost:${PORT}`);
});
