const { cloudinary } = require("../config/config_cloudinary")
const {unlink} = require('fs')

const cloudUpload = async(file) => {

    try{
        console.log(file)
        const cloud_response = await cloudinary.uploader.upload(file.path)
        unlink(file.path,(err)=>{
            if(err) console.error(err)
        })
     
        return cloud_response

    }
    catch(err){
        console.error(err)
    }
}

module.exports = {cloudUpload}