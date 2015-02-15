var Stats = require('Stats');
var properties = require('../properties');

function BootState(game) {

  var boot = {};

  boot.create = function() {

    if (properties.showStats) {
      addStats();
    }

    game.sound.mute = properties.mute;

    game.state.start('preloader');
  };

  function addStats() {
    var stats = new Stats();

    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);

    setInterval(function() {
      stats.begin();
      stats.end();
    }, 1000 / 60);
  }

  return boot;
}

/** export state */
module.exports = BootState;
