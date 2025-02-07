var express = require('express');
var router = express.Router();

const {getFilesByType} = require("../controllers/fileController")

router.get("/",getFilesByType)

module.exports = router