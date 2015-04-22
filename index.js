
var log = require('npmlog');
var spawn = require('child_process').spawn;
var _s = require('underscore.string');

/**
 *
 * @param opts
 * @constructor
 */
function Vagrant(opts){
  this.options = opts || {};
}

var spawnVagrant = function(binary, args){
  var vagrant = spawn(binary, args);
  log.verbose('vagrant', 'vagrant '+args.join(' '))
  var stdout = '';
  var stderr = '';
  vagrant.stdout.on('data', function (data) {
    data = _s.trim(data+'');
    if(data) log.silly('vagrant', '%s', data);
    stdout+=''+data;
  });
  vagrant.stderr.on('data', function (data) {
    data = _s.trim(data+'');
    if(data) log.error('vagrant', '%s', data);
    stderr+=''+data;
  });
  vagrant.on('close', function (code) {
    if(code) log.error('vagrant', 'close code %s', code);
    vagrant.emit('done', code, stdout, stderr);
  });
  return vagrant;
};

/**
 *
 * @param machine
 * @param done
 */
Vagrant.prototype.up = function(machine, done){
  var provider = this.options.provider || 'virtualbox';
  var binary = this.options.binary || 'vagrant';
  var vagrant = spawnVagrant(binary, ['up', machine, '--provider='+provider]);
  var booted = null;
  vagrant.stdout.on('data',function(data){
    data += '';
    if(data.match(/Machine booted and ready!/)){
      booted = true;
    }
    if(data.match(/is already running.$/)){
      booted = false;
    }
  });
  vagrant.on('done',function(code, stdout, stderr){
    if(done) done(stderr,booted);
  });
  return vagrant;
};

/**
 *
 * @param done
 */
Vagrant.prototype.halt = function(done){
  var binary = this.options.binary || 'vagrant';
  var vagrant = spawnVagrant(binary, ['halt']);
  vagrant.on('done',function(code, stdout, stderr){
    if(done) done(false);
  });
  return vagrant;
};

/**
 *
 * @param done
 */
Vagrant.prototype.status = function(done){
  var machines = {};
  var reg = /([a-z0-9-_]+)\s+(running|poweroff|aborted|not created)\s+[(](virtualbox|libvirt)[)]/i;
  var binary = this.options.binary || 'vagrant';
  var vagrant = spawnVagrant(binary, ['status']);
  vagrant.stdout.on('data', function (data) {
    data += '';
    data.split('\n').forEach(function(line){
      var regRes = line.match(reg);
      if(regRes ){
        var name = regRes[1];
        machines[name] = {
          status:regRes[2],
          provider:regRes[3]
        };
      }
    })
  });
  vagrant.on('done',function(code, stdout, stderr){
    if(done) done(stderr,machines);
  });
  return vagrant;
};

/**
 *
 * @param done
 * @returns {*}
 */
Vagrant.prototype.isRunning = function(done){
  var vagrant = this.status(function(errors,machines){
    var running = false;
    Object.keys(machines).forEach(function(name){
      if(machines[name].status == 'running' ){
        running = name;
      }
    });
    if(done)done(running);
  });
  return vagrant;
};

/**
 *
 * @param done
 */
Vagrant.prototype.isInstalled = function(done){
  return this.version(function(stderr, version){
    done(stderr, !stderr&&version)
  });
};

/**
 *
 * @param done
 */
Vagrant.prototype.version = function(done){
  var binary = this.options.binary || 'vagrant';
  var vagrant = spawnVagrant(binary, ['-v']);
  var version = '';
  vagrant.stdout.on('data', function (data) {
    version = (data+'').match(/Vagrant\s+([0-9.]+)/)[1];
    if(version) version = version[1];
  });
  vagrant.on('done',function(code, stdout, stderr){
    if(done) done(stderr, version);
  });
  return vagrant;
};

/**
 *
 * @param done
 */
Vagrant.prototype.addBox = function(name, url, done){
  var binary = this.options.binary || 'vagrant';
  var vagrant = spawnVagrant(binary, ['box','add',name,url,'--provider',this.options.provider]);
  var success = false;
  vagrant.stdout.on('data', function (data) {
    data = ''+data;
    if( !success && data.match(/box: Successfully added box '[^']+' \(v0\) for '[^']+'!/) ){
      success = true;
    }
  });
  vagrant.on('done',function(code, stdout, stderr){
    if(done) done(stderr, stdout, success);
  });
  return vagrant;
};


module.exports = Vagrant;