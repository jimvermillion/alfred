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
const clientIO = require('socket.io-client');

// Base URI
const baseURI = 'http://localhost:8080';

// Track vars
var token, user, config, clientSocket;

// Connect to Socket
describe('The socket routes', (done) => {
  // Create Client
  beforeEach((done) => {
    clientSocket = clientIO.connect(baseURI);
    clientSocket.on('connect', () => {
      done();
    });
  });

  // Create Test User
  before((done) => {
    request(baseURI)
      .post('/auth/register')
      .send({
        'authentication': {
          'email': 'testone@test.com',
          'password': 'testpassword'
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
      mongoose.disconnect(done);
    });
  });

  // JOIN_ROOM
  it('should join a room on JOIN_ROOM', (done) => {
    // Success
    clientSocket.on('ROOM_JOINED', (id) => {
      expect(id).to.eql(user._id);
      done();
    });
    // Emit
    clientSocket.emit('JOIN_ROOM', user._id);
  });

  // UPDATED_CONFIG ON MODULE CHANGE
  it('should update the CONFIG on UPDATED_CONFIG', (done) => {
    var notCalled = true;
    // Join Room
    clientSocket.emit('JOIN_ROOM', user._id);
    // Success
    clientSocket.on('UPDATED_CONFIG', (newConfig) => {
      expect(newConfig.owner_id).to.eql(user._id);
      if (notCalled)
        done();
      notCalled = !notCalled;
    });
    // Make request
    request('localhost:8080')
      .post('/dashboard/config/setConfig/' + config._id)
      .set('token', token)
      .end((err, res) => {
        expect(err).to.eql(null);
      });
  });

  // UPDATE_CONFIG ON USER PROFILE CHANGE
  it('should update the USER on UPDATED_CONFIG', (done) => {
    var notCalled = true;
    // Join room
    clientSocket.emit('JOIN_ROOM', user._id);
    // Listen for evetn
    clientSocket.on('UPDATED_CONFIG', (newConfig) => {
      expect(newConfig.owner_id).to.eql(user._id);
      expect(newConfig.name.first).to.eql('Sam');
      expect(newConfig.name.last).to.eql('Heutmaker');
      // Ensure done is only called once.
      if (notCalled) {
        done();
        notCalled = !notCalled;
      }
    });
    // Make request
    request('localhost:8080')
      .put('/user/update/' + user._id)
      .set('token', token)
      .send({
        name: {
          first: 'Sam',
          last: 'Heutmaker'
        }
      })
      .end((err, res) => {
        expect(err).to.eql(null);
      });
  });
});
