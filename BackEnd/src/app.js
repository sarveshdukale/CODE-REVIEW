const express = require("express");
const  aiRouter  = require("./router/ai.router");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true })); 

app.use("/ai", aiRouter);

module.exports = app;