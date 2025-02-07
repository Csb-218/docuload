const multer = require("multer")
const {extname} = require("path")
const {validateFile}  = require("../utils/validators/fileValidators")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: 10000000},
    fileFilter: (req, file, cb) => {
         
        const isFileTyeAllowed = validateFile(file)
        if (isFileTyeAllowed) {
            cb(null, true)
        } else {
            cb(new Error('File format not supported(only jpeg, jpg, png, gif, pdf, ppt, csv)'))
        }
    }
    
}).array('file', 1)

module.exports = {upload}