'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

mongoose.connect(MONGODB_URI)
  .then(() => {
    const searchTerm = 'tseting';
    let filter = {};

    if(searchTerm){
      filter = {$or: [ {title: {$regex: searchTerm}}, {content: {$regex: searchTerm}} ]};
    }

    return Note.find(filter).sort({updatedAt: 'desc'});
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`Error: ${err.message}`);
  });



// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const _id = '000000000000000000000003';
//     return Note.findById(_id);
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.error(`Error: ${err.message}`);
//   });


// const { title, content, folderId } = req.body; // Add `folderId` to object destructure
  
// const newItem = {
//   title: title,
//   content: content,
// };

// /***** Never trust users - validate input *****/
// if (!newItem.title) {
//   const err = new Error('Missing `title` in request body');
//   err.status = 400;
//   return next(err);
// }

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const title = 'testing post';
//     const content = 'tsdgfsdfgseting content post';
//     return Note.create({title,content});
//   })
//   .then(result =>  {
//     console.log(result);
//   })
//   .catch(err => {
//     console.error(`Error: ${err.message}`);
//   });

const _id = '5b16f15113c5e83d706059d6';
// const _title = 'testing sdfsdgvzsdfg update';
// const _content =' testing update body';

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.findByIdAndUpdate(_id,
//       {$set: {title:_title,content: _content}});
//     //{new: true, upset: true})
//   })
//   // .then(() => {
//   //   return Note.findById(_id);
//   // })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.error(`Error: ${err.message}`);
//   });

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.findByIdAndRemove(_id);
//   })
//   .then(() => {
//     console.log('Removed Favourite');
//   })
//   .catch(err => {
//     console.log('Something went wrong');
//   });
