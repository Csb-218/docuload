'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class folder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  folder.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('csv', 'img', 'pdf', 'ppt'),
      allowNull: false
    },
    maxFileLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'folder',
    timestamps: true,
  });
  return folder;
};