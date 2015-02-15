function PreloaderState(game) {
  var preloader = {};

  preloader.preload = function() {
    game.load.image('logo', 'images/phaser.png#grunt-cache-bust');

    game.load.image('wall', 'images/wall.png');
    game.load.image('block', 'images/block.png');
    game.load.image('goal', 'images/goal.png');
    game.load.image('empty', 'images/empty.png');
  };

  preloader.create = function() {
    game.state.start('game');
  };

  return preloader;
}

/** export the state */
module.exports = PreloaderState;
