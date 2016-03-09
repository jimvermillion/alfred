'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
const request = chai.request;

require('socket.io');

// Socket
const io = require(__dirname + '/../server');
var socket;


// Base URI
const baseURI = 'http://localhost:8080';


// Track vars
var token, user, config;


describe('The socket routes', (done) => {

  beforeEach((done) => {
  	socket = require('socket.io-client')(baseURI);
  	socket.on('connect', () => done());
  })
  // Create Test User
  before((done) => {
    request(baseURI)
      .post('/auth/register')
      .send({
        "authentication": {
          "email": "testone@test.com",
          "password": "testpassword"
        }
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        token = res.body.token;
        user = res.body.user;
        console.log(user);
        done();
      });
  });
  // Get test UserProfile
  before((done) => {
    request('localhost:8080')
      .get('/dashboard/config')
      .set('token', token)
      .end((err, res) => {
        expect(err).to.eql(null);
        console.log(res.body[0]);
        config = res.body[0];
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('owner_id');
        expect(res.body[0].name).to.eql('My Profile');
        done();
      });
  });
  // Delete DB
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done(); //eslint-disable-line
    });
  });

  // EMIT UPDATED CONFIG
  it('should emit an UPDATED_CONFIG event on POST', (done) => {
    var client = io.connect(baseURI, options);


    // Connect to client
    client.on('connect', function(socket) {
      socket.join(config.owner_id);
      // Updated Config
      socket.on('UPDATED_CONFIG', function(res) {
        console.log(res);
        done();
      });
    });

    request('localhost:8080')
      .post('/dashboard/config/setConfig/' + config._id)
      .set('token', token)
      .end((err, res) => {
        expect(err).to.eql(null);
        // Socket should emit
      });
  });
});