// Description: This file contains the folder validators.
//  The validators are used to validate the request body before creating or updating a folder.
//  The validators check if the request body is empty or incomplete, if the name is not a string, if the name is not unique, if the type is not csv, img, pdf, or ppt, and if the max file limit is not a number. If any of the validations fail, an error message is returned. If all validations pass, the folder is created or updated.
const { validate:isUuid} = require('uuid');

// validate folder
function validateFolder(folder){

    const { name, type , maxFileLimit } = folder;

    // VALIDATIONS -----------------------------------------------------------------------------------

     // Check if the request body is empty / incomplete
     if (!name || !type || !maxFileLimit) return { error: 'Please provide a name, type, and max file limit' };

     // Check if the name is not a string
     if (typeof name !== 'string' || name.trim().length<1 ) return { error: 'Name must be a string of greater than 1 character' };
 
     // Check if the type is not csv, img, pdf, or ppt
     if (type !== 'csv' && type !== 'img' && type !== 'pdf' && type !== 'ppt') return { error: 'Type must be csv, img, pdf, or ppt' };
 
     // Check if the max file limit is not a number
     if ( !(Number.isInteger(parseInt(maxFileLimit)) && parseInt(maxFileLimit) >0 )) return { error: 'Max file limit must be a number greater than 0' };

      // -------------------------------------------------------------------------------------------------
}

// validate folderid
function validateFolderId(folderId){
    // check if the folder id is a uuid
    if(!isUuid(folderId)) return { error: 'Invalid folder id' };

}



module.exports = {validateFolder,validateFolderId};