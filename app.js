require("dotenv").config();

const { connectToMySQL } = require("./DB/connect");
connectToMySQL()

const express = require("express");
const app = express();
app.use(express.json());
const port = 4000;

let cors = require("cors");
// app.use(cors());
app.use(cors({
   origin: 'http://127.0.0.1:3000',
}));
const bodyParser = require('body-parser')
app.use(bodyParser.text({ type: '/' }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => res.send("Hello Analysto!"));

const apiRouter = require("./modules/auth.router");
app.use("/api", apiRouter);

app.listen(port, "0.0.0.0", () => console.log("Server is running on port " + port));