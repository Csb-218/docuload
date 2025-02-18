const {extname} = require("path")

const validateFile = (file) => {

    const fileTypes = /jpeg|jpg|png|gif|pdf|ppt|csv/
    const fileExtname = fileTypes.test(extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)
    return fileExtname && mimetype
}


module.exports = {validateFile};