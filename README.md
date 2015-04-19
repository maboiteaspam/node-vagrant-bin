# node-vagrant-cli

A library to ease programmatic use of vagrant binary with nodejs.

---------------------------------------


# Install

```npm i node-vagrant-cli --save```

---------------------------------------

### API

* [`Vagrant`](#Vagrant)
    * [`Vagrant.up`](#up)
    * [`Vagrant.halt`](#halt)
    * [`Vagrant.status`](#status)
    * [`Vagrant.isRunning`](#isRunning)

---------------------------------------


<a name="Vagrant" />
### new Vagrant(opts)

ServerPool constructor.

__Arguments__

* `opts` - An object of configuration.

__Examples__

```js
    var Vagrant = require('node-vagrant-cli');
    
    var opts = 
     {
      'provider':'virtualbox',
      'binary':'vagrant'
     };
    
    var vagrant = new Vagrant(opts);
```


<a name="Vagrant.up" />
### Vagrant.up(machine, done)

Wake up a machine.

__Arguments__

* `machine` - Name of an environment or a machine.
* `done` - A callback called on completion.
    * `stderr` - String of output.
    * `booted` - Boolean true if machine has really booted.

__Returns__

* `child_process` - A child_process.spawn object.

__Examples__

```js
    var Vagrant = require('node-vagrant-cli');
    
    var opts = 
     {
      'provider':'virtualbox',
      'binary':'vagrant'
     };
    
    var vagrant = new Vagrant(opts);
    
    vagrant.up('centos', function(err, booted){
        console.log(err);
        console.log(booted);
    });
```


<a name="Vagrant.halt" />
### Vagrant.halt(done)

Halt a machine.

__Arguments__

* `done` - A callback called on completion.
    * `stderr` - An Error.

__Returns__

* `child_process` - A child_process.spawn object.

__Examples__

```js
    var Vagrant = require('node-vagrant-cli');
    
    var opts = 
     {
      'provider':'virtualbox',
      'binary':'vagrant'
     };
    
    var vagrant = new Vagrant(opts);
    
    vagrant.halt(function(err){
        console.log(err);
    });
```


<a name="Vagrant.status" />
### Vagrant.status(done)

Fetch vagrant status, returns a object of machines and their status.

__Arguments__

* `done` - A callback called on completion.
    * `stderr` - An Error.
    * `machines` - An Object of machines and their status.

__Returns__

* `child_process` - A child_process.spawn object.

__Examples__

```js
    var Vagrant = require('node-vagrant-cli');
    
    var opts = 
     {
      'provider':'virtualbox',
      'binary':'vagrant'
     };
    
    var vagrant = new Vagrant(opts);
    
    vagrant.status(function(stderr, machines){
        console.log(machines);
        /*
        {
            'machine':{
              status:'running', // poweroff
              provider:'virtualbox' // libvirt
            }
        }
        */
    });
```


<a name="Vagrant.isRunning" />
### Vagrant.isRunning(done)

Tells if vagrant is running a machine.

__Arguments__

* `done` - A callback called on completion.
    * `stderr` - An Error.
    * `isRunning` - A Boolean, false if no machine runs, String if a machine runs.

__Returns__

* `child_process` - A child_process.spawn object.

__Examples__

```js
    var Vagrant = require('node-vagrant-cli');
    
    var opts = 
     {
      'provider':'virtualbox',
      'binary':'vagrant'
     };
    
    var vagrant = new Vagrant(opts);
    
    vagrant.isRunning(function(stderr, running){
        if(running===false){
            console.log('no machine runs';
        } else {
            console.log('runing machine is '+running);
        }
    });
```

---------------------------------------

# Status

In development. It needs some tests.