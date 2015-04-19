
require('should');
var log = require('npmlog');
var spawn = require('child_process').spawn;

log.level = 'verbose';
log.level = 'silly';

var Vagrant = require('../index.js');


before(function(done){
  this.timeout(50000);
  spawn('vagrant',['halt']).on('close', function(){
    done();
  });
});

describe('status', function(){

  this.timeout(50000)

  it('can describe current status', function(done){
    var vagrant = new Vagrant();
    vagrant.status(function(stderr,machines){
      Object.keys(machines).length.should.greaterThan(0)
      Object.keys(machines).forEach(function(name){
        machines[name].status.should.match(/(poweroff|not created|running)/)
      });
      done();
    });
  });

});

