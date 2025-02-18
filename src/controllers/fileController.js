const db = require('../models')
const { sequelize } = db
const { folder: folderModel, file: fileModel } = sequelize.models
const { cloudUpload } = require("../service/fileService")
const { Op } = require("sequelize")

const uploadFileToCloud = async (req, res) => {

    try {

        const { folderId } = req.params

        // check if folderId exists
        const folder = await folderModel.findByPk(folderId)
        if (!folder) return res.status(404).json({ error: 'Folder not found' })

        // check description
        const { description } = req.body
        if (!description) return res.status(400).json({ error: 'description is required' })

        //check file not empty
        if (!req.files) return res.status(400).json({ error: 'File not present in request body.' })
        if (Array.isArray(req.files) && req.files.length === 0) return res.status(400).json({ error: 'No file was uploaded.' })

        // file 
        const file = req.files[0]

        // All files with given folderId
        const folderFiles = await fileModel.findAll({
            where: {
                folderId: folderId
            }
        })

        //check folders maxFileLimit
        if (folderFiles.length === folder.maxFileLimit) return res.status(400).json({ error: 'Max file limit reached' })

        // cloud upload
        const result = await cloudUpload(file)

        // inserting into database
        const fileUpload = await fileModel.create({
            folderId,
            name: file.filename,
            description,
            type: file.mimetype,
            size: file.size,
            fileUrl: result.url
        })

        return res.status(201).json({
            'message': 'File uploaded successfully',
            'file': fileUpload
        })


    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }



}

const updateFileDescription = async (req, res) => {

    try {
        const { folderId, fileId } = req.params

        // check if folderId exists
        const folder = await folderModel.findByPk(folderId)
        if (!folder) return res.status(404).json({ error: 'Folder not found' })

        // check if fileId exists
        const file = await fileModel.findByPk(fileId)
        if (!file) return res.status(404).json({ error: 'file not found' })

        // check description
        const { description } = req.body
        if (!description) return res.status(400).json({ error: 'description is required' })

        file.description = description

        await file.save()

        return res.status(200).json({
            'message': 'File description updated successfully',
            "files ": {
                fileId: fileId,
                description: description
            }

        })


    } catch (err) {
        console.error(err)
        return res.status(500).send(err.message)

    }

}

const deleteFile = async (req, res) => {
    try {
        const { folderId, fileId } = req.params

        // check if folderId exists
        const folder = await folderModel.findByPk(folderId)
        if (!folder) return res.status(404).json({ error: 'Folder not found' })

        // check if fileId exists
        const file = await fileModel.findByPk(fileId)
        if (!file) return res.status(404).json({ error: 'file not found' })

        // delete the file
        await file.destroy()

        return res.status(204).send()

    } catch (err) {
        console.error(err)
        return res.status(500).send(err.message)
    }
}

const getAllFilesByFolder = async (req, res) => {
    try {

        const { folderId } = req.params
        const { sort, order } = req.query

        let files;

        if (order && sort) {
            files = await fileModel.findAll({
                where: {
                    folderId: folderId
                },
                order: [[sort, order]]
            })
        } else {
            files = await fileModel.findAll({
                where: {
                    folderId: folderId
                }
            })
        }




        return res.status(200).json(files)
    }
    catch (err) {
        console.error(err)
        return res.status(500).send(err.message)

    }
}

const getFilesByType = async (req, res) => {

    try {
        const { type } = req.query

        let files;

        if (!type) {

            files = await fileModel.findAll({})

        } else {
            files = await fileModel.findAll({
                where: {
                    type: {
                        [Op.like]: `%${type}%`
                    }
                }
            })
        }

        if (files.length === 0) return res.status(404).send("No files found")

        return res.status(200).json({
            files,
            total_results: files.length

        })

    } catch (err) {
        console.error(err)
        return res.status(500).send(err.message)
    }
}

module.exports = { uploadFileToCloud, updateFileDescription, deleteFile, getAllFilesByFolder, getFilesByType }  //exporting the functions to be used in other files  //export