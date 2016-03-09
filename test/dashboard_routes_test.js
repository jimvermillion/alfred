'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
const server = require(__dirname + '/../server'); //eslint-disable-line
const request = chai.request;

const baseURI = 'localhost:8080';

describe('config tests', () => {
  before( done => {
    // signup user and collect the token
    request(baseURI)
      .post('/auth/register')
      .send({
        "authentication": {
          "email": "testuser@test.com",
          "password": "testpassword"
        }
      })
      .end((err, res) => {
        if (err) return console.log('err');
        expect(err).to.eql(null);
        this.token = res.body.token;
        done();
      });
    });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done(); //eslint-disable-line
    });
  });

  it('should check the config for our created by user -- GET', done => {
    request('localhost:8080')
      .get('/dashboard/config')
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('owner_id');
        expect(res.body[0].name).to.eql('My Profile');
        done();
    });
  });

  it('should post a new config -- POST', done => {
    request(baseURI)
      .post('/dashboard/config')
      .set('token', this.token)
      .send({ 
        name: 'bubba',
        owner_id: 'id',
        location: {lat: 5, long: 6},
        modules: ['hey', 'dude']
       })
      .end((err, res) => {
        this.pref = res.body;
        expect(err).to.eql(null);
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eql('bubba');
        done();
    });
  });

  it('should put the pref edited by user -- PUT', done => {
    request(baseURI)
      .put('/dashboard/config/' + this.pref._id)
      .set('token', this.token)
      .send({ 
        name: 'tuba',
        owner_id: 'di',
        location: {lat: 6, long: 5},
        modules: ['dude', 'hey']
       })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('ok');
        expect(res.body.nModified).to.eql(1);
        done();
    });
  });

  it('should delete the pref created by user -- DELETE', done => {
    request(baseURI)
      .delete('/dashboard/config/' + this.pref._id)
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('successfully deleted config');
        done();
    });
  });
});
