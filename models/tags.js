'use strict';

const mongoose = require('mongoose');

const tagsSchema = new mongoose({
  name: {type: String, required: true, unique: true}
});

//Adding createdAt and updatedAt fields
tagsSchema.set('timestamps', true);

tagsSchema.set('toObject',{
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Tag',tagsSchema);