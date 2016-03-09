'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
const request = chai.request;

// Get IO 
const io = require(__dirname + '/../server');
// Get socket
require(__dirname + '/../lib/module-socket')(io);
// Get client
const clientSocket = require('socket.io-client');

// Base URI
const baseURI = 'http://localhost:8080';

// Track vars
var token, user, config, client1;

// Connect to Socket
describe('The socket routes', (done) => {
  // Create Client
  beforeEach((done) => {
    client1 = clientSocket.connect(baseURI);
    client1.on('connect', () => {
      done();
    })
  });
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

  // JOIN_ROOM
  it('should join a room on JOIN_ROOM', (done) => {
    // Success
    client1.on('ROOM_JOINED', function(id) {
      expect(id).to.eql(user._id);
      done();
    });
    // Emit
    client1.emit('JOIN_ROOM', user._id);
  });

  // UPDATED_CONFIG
  it('should update the config on UPDATED_CONFIG', (done) => {
    // Join Room
    client1.emit('JOIN_ROOM', user._id);
    // Success
    client1.on('UPDATED_CONFIG', function(newConfig) {
      expect(newConfig.owner_id).to.eql(user._id);
      done();
    });
    // Make request
    request('localhost:8080')
      .post('/dashboard/config/setConfig/' + config._id)
      .set('token', token)
      .end((err, res) => {
        expect(err).to.eql(null);
      });
  });
});