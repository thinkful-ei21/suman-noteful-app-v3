'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Note = require('../models/note');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;

  let filter = {};

  if (searchTerm) {
    // Mini-Challenge: Search both `title` and `content`
    // const re = new RegExp(searchTerm, 'i');
    // filter.$or = [{ 'title': re }, { 'content': re }];
    filter.title = { $regex: searchTerm, $options: 'i'};    
  }

  if(folderId){
    filter.folderId = folderId;
  }

  Note.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if(folderId && !mongoose.Types.ObjectId.isValid(folderId)){
    const err = new Error('Invalid folderId in the request body');
    err.status = 400;
    return next(err);
  }

  const newNote = { title, content, folderId };

  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content, folderId} = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The Note `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if(folderId && !(mongoose.Types.ObjectId.isValid(id))){
    const err = new Error('The folder id is either missing or invalid');
    err.status = 400;
    return next(err);
  }

  const updateNote = { title, content, folderId };

  Note.findByIdAndUpdate(id, updateNote, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

// 'use strict';

// const express = require('express');
// const mongoose = require('mongoose');

// const Note = require('../models/note');

// const router = express.Router();

// /* ========== GET/READ ALL ITEM ========== */
// router.get('/', (req, res, next) => {
//   const { searchTerm } = req.query;

//   Note
//     .find()
//     .then(() => {
//     //const searchTerm = 'tseting';
//       let filter = {};
//       if(searchTerm){
//         filter = {$or: [ {title: {$regex: searchTerm}}, {content: {$regex: searchTerm}} ]};
//       }
//       return Note.find(filter).sort({updatedAt: 'desc'});
//     })
//     .then(results => {
//       res.json(results);      
//     })
//     .catch(err => {
//       console.error(`Error: ${err.message}`);
//     });
// });


// /* ========== GET/READ A SINGLE ITEM ========== */
// router.get('/:id', (req, res, next) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     const err = new Error('The `id` is not valid');
//     err.status = 400;
//     return next(err);
//   }

//   Note.findById(id)
//     .then(result => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// });

///ID 
//THEN -- UPDATING -- NOTE(ID)
//THEN -- notes.FIND (ID)


/* ========== GET/READ A SINGLE ITEM ========== */
// router.get('/:id', (req, res, next) => {
//   const id = req.params.id;
//   Note
//     .find()
//     .then(() => {      
//       let filter = {};
//       if(id){
//         filter = {_id:id};
//       }
//       return Note.find(filter);
//     })
//     .then(([result]) => {
//       res.json(result[0]);    
//     })
//     .catch(err => {
//       console.error(`Error: ${err.message}`);
//     });
// });

// /* ========== POST/CREATE AN ITEM ========== */
// router.post('/', (req, res, next) => {
//   const {title, content} = req.body;
//   const newNote = {title, content};

//   /***** validating input *****/
//   if (!newNote.title) {
//     const err = new Error('Missing `title` in request body');
//     err.status = 400;
//     return next(err);
//   }
//   Note.create(newNote)
//     .then(result => {
//       res.location('${req.originalUrl}/${result.id}').status(201).json(result);
//     })
//     .catch(err => {
//       console.error(`Error: ${err.message}`);
//     });
// });

// /* ========== PUT/UPDATE A SINGLE ITEM ========== */
// router.put('/:id', (req, res, next) => {
//   const {id} = req.params;
//   const {title, content} = req.body;
//   const updateNote = {title, content};

//   /***** validating input *****/
//   //Do we have to have title? can a user update just content ?
//   if (!updateNote.title) {
//     const err = new Error('Missing `title` in request body');
//     err.status = 400;
//     return next(err);
//   }

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     const err = new Error('The `id` is not valid');
//     err.status = 400;
//     return next(err);
//   }
//   Note.findByIdAndUpdate(id, updateNote, { new: true })
//     .then(result => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(err => {
//       next(err);
//     });  
//   //console.log('Update a Note');
//   //res.json({ id: 1, title: 'Updated Temp 1' });
// });

// /* ========== DELETE/REMOVE A SINGLE ITEM ========== */
// router.delete('/:id', (req, res, next) => {
//   const { id } = req.params;
//   /***** Never trust users - validate input *****/
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     const err = new Error('The `id` is not valid');
//     err.status = 400;
//     return next(err);
//   }
//   Note.findByIdAndRemove(id)
//     .then(() => {
//       res.status(204).end();
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// module.exports = router;