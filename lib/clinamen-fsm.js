(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.clinamenfsm = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src/fsm.js');

},{"./src/fsm.js":2}],2:[function(require,module,exports){
class StateMachine {

  constructor(args){
    this.init(args);
  }

  init(args){
    this.states = {};
    this.state = null;
    if(args && args.states){
      this.states = args.states;
      if(args.initialState){
        start(args.initialState);
      }
    }

  }

  start(startStateName){
    if(startStateName){
      this.state = this.states[startStateName];
      this.state.enter();
    }
  }

  change(newStateName){
    var lastStateName = null;
    if(this.state){
      lastStateName = this.state.name;
      this.state.exit(newStateName);
    }
    this.state = this.states[newStateName];
    this.state.enter(lastStateName);
  }

  add(newState){
    this.states[newState.name] = newState;
  }

  update(args){
    if(this.state){
      this.state.update(args);
    }
  }

  draw(args){
    if(this.state){
      this.state.draw(args);
    }
  }

}

class State {

  constructor(...args){
    this.init(args);
  }

  init(args){}

  enter(lastStateName){}

  exit(newStateName){}

  handleInput(){}

  update(args){}

  draw(args){}


}

module.exports = {
  "StateMachine"  : StateMachine,
  "State"         : State
}

},{}]},{},[1])(1)
});
