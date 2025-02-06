var express = require('express');
var router = express.Router();
var {createFolder,updateFolder,deleteFolder} = require("../controllers/folderController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', createFolder)

router.put('/update/:folderId', updateFolder)

router.delete('/delete/:folderId', deleteFolder)

module.exports = router;