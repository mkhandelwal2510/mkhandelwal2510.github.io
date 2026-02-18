const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());

// INTENTIONALLY VULNERABLE CORS CONFIG
app.use(cors({
  origin: true, // reflects any origin
  credentials: true
}));

// Fake login endpoint
app.get("/login", (req, res) => {
  res.cookie("session", "secret-session-token", {
    httpOnly: false,
    sameSite: "Lax"
  });
  res.send("Logged in!");
});

// Sensitive endpoint
app.get("/api/user", (req, res) => {
  if (req.cookies.session === "secret-session-token") {
    res.json({
      username: "victimUser",
      email: "victim@example.com",
      apiKey: "SUPER-SECRET-API-KEY"
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.listen(8000, () => {
  console.log("Victim API running on http://localhost:8000");
});
