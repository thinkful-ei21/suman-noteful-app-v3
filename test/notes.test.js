'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server');
//const faker = require('faker');

const { TEST_MONGODB_URI } = require('../config');
const Note = require('../models/note');
const seedNotes = require('../db/seed/notes');
const expect = chai.expect;
chai.use(chaiHttp);




describe('Notes API resources',function(){
  before(function(){
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });
  
  beforeEach(function(){
    return Note.insertMany(seedNotes);
  });
  
  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function(){
    return mongoose.disconnect();
  });
  
  //Testing Get End Points
  describe('GET endpoint /api/notes', function() {    
    it('should return all existing notes', function() {
      return Promise.all([
        Note.find(), //Calling database
        chai.request(app).get('/api/notes') //calling api
      ])
        .then(([data,res]) =>{
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });   
  });
  
  

  describe('GET /api/notes/:id', function () {
    it('should return correct note', function () {
      let note;      
      return Note.findOne()
        .then(_data => {
          note = _data;          
          return chai.request(app).get(`/api/notes/${note.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt', 'folderId','tags');
          expect(res.body.id).to.equal(note.id);
          expect(res.body.title).to.equal(note.title);
          expect(res.body.content).to.equal(note.content);
          expect(new Date(res.body.createdAt)).to.eql(note.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(note.updatedAt);
        });
    });
  });


  //Testing POST 
  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt', 'tags');
          // 2) then call the database
          return Note.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });



});
