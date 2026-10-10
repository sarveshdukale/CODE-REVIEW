const express = require("express");
const router = express.Router();

const { giveResponse } =require("../controllers/response.controller")

router.post("/get-response", giveResponse);

module.exports = router;