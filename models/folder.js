'use strict';

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {type: String,require: true, unique:true}
});

//Adding `createdAt` and `updateAt` fields
folderSchema.set('timestamp',true);

folderSchema.set('toObject',{
  virtual: true,
  versionKey: false,
  transform: (doc,ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Folder', folderSchema);