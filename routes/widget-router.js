const express = require('express');
const jsonParser = require('body-parser').json();

const handleError = require(__dirname + '/../lib/handle-error');

// Authorization
const mAuth = require('major-a').majorAuth;

// Models
const commuteModule = require('/../models/commuteModule');
const greetingModule = require('/../models/greetingModule');
const newsModule = require('/../models/newsModule');
const timeModule = require('/../models/timeModule');
const weatherModule = require('/../models/weatherModule');

const widgetRouter = module.exports = exports = express.Router();


// Get Widget Data by Id
widgetRouter.get('/:type/:id', mAuth(), (req, res) => {
  try {
    switch (req.params.type) {
      case 'commute':
        commuteModule.findOne({
          _id: req.params.id
        }, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
      case 'greeting':
        greetingModule.findOne({
          _id: req.params.id
        }, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
      case 'news':
        newsModule.findOne({
          _id: req.params.id
        }, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
      case 'time':
        timeModule.findOne({
          _id: req.params.id
        }, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
      case 'weather':
        weatherModule.findOne({
          _id: req.params.id
        }, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
    }
  } catch (e) {
    return handleError.dbError('GET -- Catch hit', res);
  }
});


// Update Widget Model
widgetRouter.put('/:type/:id', mAuth(), jsonParser, (req, res) => {
  try {
    switch (req.params.type) {
      // Update Commute Module
      case 'commute':
        commuteModule.update({
          _id: req.params.id
        }, req.body, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
        // Update Greeting Module
      case 'greeting':
        greetingModule.update({
          _id: req.params.id
        }, req.body, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
        // Update News Module
      case 'news':
        newsModule.update({
          _id: req.params.id
        }, req.body, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
        // Update Time Module
      case 'time':
        timeModule.update({
          _id: req.params.id
        }, req.body, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
        // Update Weather Module
      case 'weather':
        weatherModule.update({
          _id: req.params.id
        }, req.body, (err, foundData) => {
          if (err) return handleError.dbError(err, res);
          if (!foundData) return handleError.noData(req.params.type, res);
          // Return Data;
          res.status(500).json(foundData);
        });
        break;
    }
  } catch (e) {
    return handleError.dbError('PUT -- Catch hit', res);
  }
});