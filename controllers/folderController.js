const db = require('../models')
const { sequelize } = db
const { folder: folderModel } = sequelize.models
const { validateFolder, validateFolderId } = require('../utils/validators/folderValidators')


const createFolder = async (req, res) => {

    try {
        const { name, type, maxFileLimit } = req.body

        // Validate request
        const error = validateFolder(req.body)
        if (error) return res.status(400).json({ error: error })

        // Check if name is not unique
        const folderExists = await folderModel.findOne({ where: { name } });
        if (folderExists) return res.status(400).json({ error: 'Folder with that name already exists' });


        const folder = await folderModel.create({
            name: name,
            type: type,
            maxFileLimit: parseInt(maxFileLimit)
        })

        return res.status(201).json({
            message: 'Folder created successfully',
            folder,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

const updateFolder = async (req, res) => {

    try {

        const { name, type, maxFileLimit } = req.body
        const folderId = req.params.folderId

        let error;

        // Validate parameters
        error = validateFolderId(folderId)
        if (error) return res.status(400).json(error)

        // Validate request
        error = validateFolder(req.body)
        if (error) return res.status(400).json(error)

        //check if folderId does not exist
        const folderIdExists = await folderModel.findOne({ where: { id: folderId } });
        if (!folderIdExists) return res.status(400).json({ error: 'Folder with that id does not exists' });



        const folder = await folderModel.update({
            name: name,
            type: type,
            maxFileLimit: parseInt(maxFileLimit)
        }, {
            where: {
                id: folderId
            },
            returning: true
        })

        console.log(folder)

        return res.status(201).json({
            message: 'Folder updated successfully',
            folder: folder[1],
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }

}

const deleteFolder = async (req, res) => {
    try {
        const folderId = req.params.folderId
        let error;
        // Validate parameters
        error = validateFolderId(req.params.folderId)
        if (error) return res.status(400).json(error)

        //check if folderId does not exist
        const folderIdExists = await folderModel.findOne({ where: { id: folderId } });
        if (!folderIdExists) return res.status(400).json({ error: 'Folder with that id does not exists' });

        await folderModel.destroy({
            where: {
                id: folderId
            }
        })

        return res.status(200).json({ message: 'Folder deleted successfully' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { createFolder, updateFolder, deleteFolder}