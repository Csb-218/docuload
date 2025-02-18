var express = require('express');
var router = express.Router();
var {createFolder,updateFolder,deleteFolder,getAllFolders} = require("../controllers/folderController")
var {upload} = require("../middlewares/fileupload");
var {uploadFileToCloud,updateFileDescription,deleteFile, getAllFilesByFolder} = require("../controllers/fileController")


// Folder routes

router.get('/', getAllFolders);

router.post('/create', createFolder)

router.put('/update/:folderId', updateFolder)

router.delete('/delete/:folderId', deleteFolder)

// File routes

router.post('/:folderId/files',function(req,res,next){
  upload(req,res,function(err){
    if(err){
      console.log(err)
      return res.status(400).json({error:err.message})
    }
    next()
  })
},uploadFileToCloud)

router.put('/:folderId/files/:fileId',updateFileDescription)

router.delete('/:folderId/files/:fileId',deleteFile)

router.get('/:folderId/files',getAllFilesByFolder)





module.exports = router;