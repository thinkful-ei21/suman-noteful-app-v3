'use strict';
 
const express = require('express');
const mongoose = require('mongoose');

const Folder = require('../models/folder');
const Note = require('../models/note');
const Tag = require('../models/tag');
const router = express.Router();

/* ========== GET/READ ALL FOLDERS ========== */
router.get('/', (req,res,next) => {
  Tag.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM BY ID========== */
router.get('/:id',(req,res,next) => {
  const { id } =req.params;
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
    .then(result => {
      if(result){
        res.json(result);
      }else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });  
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/',(req,res,next) => {
  const {name} = req.body;

  /*****validate input *****/
  if(!name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newFolder = {name};
  Tag.create(newFolder)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if(err.code === 1100){
        err = new Error('Folder name already exists');
        err.status = 400;        
      }
      next(err);
    });
});

/* ========== PUT/UPDATE AN ITEM ========== */
router.put('/:id',(req,res,next) => {
  const { id } = req.params;
  const { name } = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('Invalid id');
    err.status = 400;
    return next(err);
  }

  if(!name){
    const err = new Error('Missing folder name');
    err.status = 400;
    return next(err);
  }

  const updateFolder = { name };

  Tag.findByIdAndUpdate(id,updateFolder, { new: true})
    .then( result => {
      if(result){
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err =>  next(err));
});


/* ========== DELETE AN ITEM ========== */
router.delete('/:id',(req,res,next) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('Invalid ID');
    err.status = 400;
    return next(err);
  }



  //ON DELETE SET NULL equivalent
  const tagRemovingPromise = Tag.findByIdAndRemove(id);  
  const noteRemoveingPromise = Note.update(
    { tags: id },    
    {$pull: {'tags': id}}
  );

  Promise.all([tagRemovingPromise,noteRemoveingPromise])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;