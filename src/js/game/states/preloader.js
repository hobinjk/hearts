function PreloaderState(game) {
  var preloader = {};

  preloader.preload = function() {
    game.load.image('wall', 'images/wall.png#grunt-cache-bust');
    game.load.image('block', 'images/block.png#grunt-cache-bust');
    game.load.image('goal', 'images/goal.png#grunt-cache-bust');
    game.load.image('empty', 'images/empty.png#grunt-cache-bust');
  };

  preloader.create = function() {
    game.state.start('game');
  };

  return preloader;
}

/** export the state */
module.exports = PreloaderState;
