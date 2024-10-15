const express = require("express");
const studentsRouter = require("./students");

const router = express.Router();

router.use("/students", studentsRouter);

module.exports = router;