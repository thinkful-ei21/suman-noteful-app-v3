'use strict';
const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

const seedNotes = require('../db/seed/notes');
const seedFolders = require('../db/seed/folders');
const seedTags = require('../db/seed/tags');

mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Tag.insertMany(seedTags),
      Tag.createIndexes(),
      Folder.insertMany(seedFolders),
      Folder.createIndexes(),
      Note.insertMany(seedNotes) 
    ]);
  })
  .then(([results]) => {
    console.info('Inserted   Notes,  Folders and   Tags');
  })
  .then(() => mongoose.disconnect())
  .catch(err => console.error(err));

