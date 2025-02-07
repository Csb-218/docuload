'use strict';
const { Model } = require('sequelize');
const Folder = require('./folder');
module.exports = (sequelize, DataTypes) => {
  class file extends Model {
    static associate(models) {
      // define association here
    }
  }
  file.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    folderId: {
      type: DataTypes.UUID,
      references: {
        model: Folder,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'file',
    timestamps: true, // Enable timestamps
  });
  return file;
};