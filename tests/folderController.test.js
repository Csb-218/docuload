const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js
const db = require('../src/models');
const { folder: folderModel } = db.sequelize.models;

jest.mock('../src/models');

describe('Folder API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /folders', () => {
    it('should create a new folder', async () => {
      const folderData = { name: 'Test Folder', type: 'pdf', maxFileLimit: 10 };
      folderModel.create.mockResolvedValue(folderData);

      const res = await request(app)
        .post('/api/folders/create')
        .send(folderData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Folder created successfully');
      expect(res.body.folder).toEqual(folderData);
    });

    it('should return 400 if folder name already exists', async () => {
      const folderData = { name: 'Test Folder', type: 'pdf', maxFileLimit: 10 };
      folderModel.findOne.mockResolvedValue(folderData);

      const res = await request(app)
        .post('/api/folders/create')
        .send(folderData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Folder with that name already exists');
    });
  });

  describe('PUT /folders/:folderId', () => {
    it('should update an existing folder', async () => {
      const folderData = { name: 'Updated Folder', type: 'pdf', maxFileLimit: 15 };
      folderModel.findOne.mockResolvedValue(folderData);
      folderModel.update.mockResolvedValue(["9bf75ded-afa2-4355-85ad-8972995f8a16", [folderData]]);

      const res = await request(app)
        .put('/api/folders//update/9bf75ded-afa2-4355-85ad-8972995f8a16')
        .send(folderData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Folder updated successfully');
      expect(res.body.folder).toEqual([folderData]);
    });

    it('should return 400 if folder ID does not exist', async () => {
      folderModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/folders//update/9bf75ded-afa2-4355-85ad-8972995f8a16')
        .send({ name: 'Updated Folder', type: 'pdf', maxFileLimit: 15 });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Folder with that id does not exists');
    });
  });

  describe('DELETE /folders/:folderId', () => {
    it('should delete an existing folder', async () => {
      folderModel.findOne.mockResolvedValue({ id: "9bf75ded-afa2-4355-85ad-8972995f8a16" });
      folderModel.destroy.mockResolvedValue("9bf75ded-afa2-4355-85ad-8972995f8a16");

      const res = await request(app)
        .delete('/api/folders/delete/9bf75ded-afa2-4355-85ad-8972995f8a16');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Folder deleted successfully');
    });

    it('should return 400 if folder ID does not exist', async () => {
      folderModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/folders/delete/9bf75ded-afa2-4355-85ad-8972995f8a16');

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Folder with that id does not exists');
    });
  });

  describe('GET /folders', () => {

    it('should return all folders', async () => {
      const folders = [{ name: 'Folder 1' }, { name: 'Folder 2' }];
      folderModel.findAll.mockResolvedValue(folders);

      const res = await request(app)
        .get('/api/folders');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(folders);
    });

    it('should return 404 when no folder is found', async()=>{

        
        folderModel.findAll.mockResolvedValue([]);

        const res = await request(app)
        .get('/api/folders');

        expect(res.statusCode).toEqual(404);
        // expect(res.body).toEqual(folders);
    })

  });
});