const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js
const db = require('../src/models');
const { folder: folderModel, file: fileModel } = db.sequelize.models;
const { cloudUpload } = require('../src/service/fileService');
const multerMock = require('./multerMock');

jest.mock('../src/models');
jest.mock('../src/service/fileService');

describe('File API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /folders/:folderId/files', () => {
    it('should upload a file to the cloud', async () => {
      const folderId = '9bf75ded-afa2-4355-85ad-8972995f8a16';
      const fileData = {
        folderId,
        name: 'testfile.jpg',
        description: 'Test file',
        type: 'image/jpeg',
        size: 1024,
        fileUrl: 'http://example.com/testfile.jpg'
      };
      const folder = { id: folderId, maxFileLimit: 10 };
      const file = { filename: 'testfile.jpg', description: 'Monthly budget report' };
      const cloudResult = { url: 'http://example.com/testfile.jpg' };

      folderModel.findByPk.mockResolvedValue(folder);
      fileModel.findAll.mockResolvedValue([]);
      cloudUpload.mockResolvedValue(cloudResult);
      fileModel.create.mockResolvedValue(fileData);

      const res = await request(app)
        .post(`/api/folders/${folderId}/files`)
        .set('Content-Type', 'multipart/form-data')
        .field('description', 'Test file')
        .attach('files', Buffer.from(file), 'testfile.png');

      console.log('Response status:', res.statusCode);
      console.log('Response body:', res.body);

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('File uploaded successfully');
      expect(res.body.file).toEqual(fileData);
    });

    it('should return 400 if folder does not exist', async () => {
      const folderId = '9bf75ded-afa2-4355-85ad-8972995f8a16';
      folderModel.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .post(`/api/folders/${folderId}/files`)
        .attach('files', Buffer.from('file content'), 'testfile.jpg')
        .field('description', 'Test file');

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Folder not found');
    });
  });

  describe('PUT /folders/:folderId/files/:fileId', () => {
    it('should update file description', async () => {
      const folderId = '1';
      const fileId = '1';
      const folder = { id: folderId };
      const file = { id: fileId, description: 'Old description', save: jest.fn() };

      folderModel.findByPk.mockResolvedValue(folder);
      fileModel.findByPk.mockResolvedValue(file);

      const res = await request(app)
        .put(`/api/folders/${folderId}/files/${fileId}`)
        .send({ description: 'New description' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('File description updated successfully');
      expect(res.body.files.description).toEqual('New description');
    });

    it('should return 404 if folder does not exist', async () => {
      const folderId = '1';
      const fileId = '1';
      folderModel.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/folders/${folderId}/files/${fileId}`)
        .send({ description: 'New description' });

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Folder not found');
    });
  });

  describe('DELETE /folders/:folderId/files/:fileId', () => {
    it('should delete a file', async () => {
      const folderId = '1';
      const fileId = '1';
      const folder = { id: folderId };
      const file = { id: fileId, destroy: jest.fn() };

      folderModel.findByPk.mockResolvedValue(folder);
      fileModel.findByPk.mockResolvedValue(file);

      const res = await request(app)
        .delete(`/api/folders/${folderId}/files/${fileId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('File successfully deleted');
    });

    it('should return 404 if folder does not exist', async () => {
      const folderId = '1';
      const fileId = '1';
      folderModel.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/folders/${folderId}/files/${fileId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Folder not found');
    });
  });

  describe('GET /folders/:folderId/files', () => {
    it('should return all files in a folder', async () => {
      const folderId = '1';
      const files = [{ name: 'file1' }, { name: 'file2' }];
      fileModel.findAll.mockResolvedValue(files);

      const res = await request(app)
        .get(`/api/folders/${folderId}/files`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(files);
    });
  });

  describe('GET /files', () => {
    it('should return all files of a specific type', async () => {
      const files = [{ name: 'file1', type: 'pdf' }, { name: 'file2', type: 'pdf' }];
      fileModel.findAll.mockResolvedValue(files);

      const res = await request(app)
        .get('/api/files')
        .query({ type: 'pdf' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.files).toEqual(files);
      expect(res.body.total_results).toEqual(files.length);
    });

    it('should return all files if no type is specified', async () => {
      const files = [{ name: 'file1', type: 'pdf' }, { name: 'file2', type: 'jpg' }];
      fileModel.findAll.mockResolvedValue(files);

      const res = await request(app)
        .get('/api/files');

      expect(res.statusCode).toEqual(200);
      expect(res.body.files).toEqual(files);
      expect(res.body.total_results).toEqual(files.length);
    });
  });
});