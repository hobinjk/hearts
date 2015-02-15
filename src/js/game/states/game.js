/* @flow weak */

var Level = require('./Level');
var Block = require('./Block');

function GameState(game) {
  this.game = game;

  this.tileSide = 40;
  this.tilesWidth = this.game.width / this.tileSide;
  this.tilesHeight = this.game.height / this.tileSide;

  this.level = new Level(this.tilesWidth, this.tilesHeight);
}

/**
 * Create the GameState
 */
GameState.prototype.create = function() {
  this.addLevel();
};

/**
 * Add the sprites for the GameState's level
 */
GameState.prototype.addLevel = function() {
  for (var tileX = 0; tileX < this.level.width; tileX++) {
    for (var tileY = 0; tileY < this.level.height; tileY++) {
      var x = tileX * this.tileSide;
      var y = tileY * this.tileSide;
      var type = null;

      switch (this.level.tileMap[tileX][tileY]) {
        case Block.EMPTY:
          type = 'empty';
          break;
        case Block.WALL:
          type = 'wall';
          break;
        case Block.BLOCK:
          type = 'block';
          break;
        case Block.GOAL:
          type = 'goal';
          break;
        default:
          throw new Error('Unknown type found');
      }

      // console.log('Adding ' + type + ' tile at ' + x + ' ' + y);
      var tile = this.game.add.sprite(x, y, type);
      tile.width = this.tileSide;
      tile.height = this.tileSide;
    }
  }
};

/**
 * export the state
 * @param {Phaser.Game} game
 * @return {Phaser.State} wrapped state
 */
module.exports = function(game) {
  return new GameState(game);
};
