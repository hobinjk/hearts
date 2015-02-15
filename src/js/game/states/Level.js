/* @flow weak */

var Utils = require('./Utils');
var Vec2 = require('./Vec2');
var Block = require('./Block');

/**
 * Create a new Level
 * @param {number} width  - Width in tiles of level
 * @param {number} height - Height in tiles of level
 * @constructor
 */
function Level(width, height) {
  this.width = width;
  this.height = height;
  this.generate();
}

/**
 * Generate the new level
 */
Level.prototype.generate = function() {
  this.tileMap = new Array(this.width);
  for (var i = 0; i < this.width; i++) {
    this.tileMap[i] = new Array(this.height);
    for (var j = 0; j < this.height; j++) {
      this.tileMap[i][j] = Block.ANY;
    }
  }

  for (var wallX = 0; wallX < this.width; wallX++) {
    for (var wallY = 0; wallY < this.height; wallY += this.height - 1) {
      this.setBlockAt(new Vec2(wallX, wallY), Block.WALL);
    }
  }
  for (var wallY = 0; wallY < this.height; wallY++) {
    for (var wallX = 0; wallX < this.width; wallX += this.width - 1) {
      this.setBlockAt(new Vec2(wallX, wallY), Block.WALL);
    }
  }

  // Give it a 1 buffer away from the walls because the walls are easymode
  var goalPos = new Vec2(2 + Utils.randInt(this.width - 4),
                         2 + Utils.randInt(this.height - 4));

  this.setBlockAt(goalPos, Block.GOAL);

  // easy n-step map
  var currentPos = goalPos;

  var step = 0;
  var failures = 0;

  while (step < 25 && failures < 1600) {
    var direction = Utils.randElement(Vec2.Direction.ALL);
    var oppositeDirection = Vec2.getOppositeDirection(direction);
    var stopPos = currentPos.add(oppositeDirection);
    var stopBlock = this.getBlockAt(stopPos);
    if (stopBlock === Block.GOAL || stopBlock === Block.EMPTY) {
      failures++;
      continue;
    }

    this.setBlockAt(stopPos, Block.WALL);

    var emptyPos = this.getRandomEmptyInDirection(currentPos, direction);
    if (!emptyPos || this.getBlockAt(emptyPos) === Block.GOAL) {
      failures++;
      this.setBlockAt(stopPos, stopBlock);
      continue;
    }
    if (this.getBlockAt(emptyPos.add(direction)) === Block.WALL) {
      failures++;
      this.setBlockAt(stopPos, stopBlock);
      continue;
    }

    this.markEmptyUntil(currentPos, emptyPos.add(direction));
    currentPos = emptyPos;

    step++;
    failures = 0;
  }

  var finalBlock = this.getBlockAt(currentPos);
  if (finalBlock === Block.GOAL) {
    console.log('Somehow it wants the goal location as a block position. ' +
                'This is dumb.');
  }
  this.setBlockAt(currentPos, Block.BLOCK);
  this.finalize();
};

/**
 * Get a random empty or ANY tile in a given direction, marking all the tiles
 * as empty
 * @param {Vec2} startPos
 * @param {Vec2} direction
 * @return {Vec2?} location of empty tile
 */
Level.prototype.getRandomEmptyInDirection = function(startPos, direction) {
  var currentPos = startPos.add(direction);
  var possibilities = [];

  while (true) {
    var block = this.getBlockAt(currentPos);
    if (block === Block.WALL) {
      break;
    }
    if (block === Block.ANY || block === Block.EMPTY) {
      possibilities.push(currentPos);
    }
    currentPos = currentPos.add(direction);
  }
  if (possibilities.length === 0) {
    console.log('NO FUTURE');
    return null;
  }
  console.log(possibilities.length + ' FUTURE');

  return Utils.randElement(possibilities);
};

/**
 * Move a block at blockPos in a direction
 * @param {Vec2} blockPos
 * @param {Vec2} direction
 * @return {Vec2} new position of block
 */
Level.prototype.moveBlock = function(blockPos, direction) {
  var block = this.getBlockAt(blockPos);
  if (block !== Block.BLOCK) {
    throw new Error('attempt to move a non-block');
  }
  var finalPos = blockPos.add(direction);
  while (true) {
    var nextPos = finalPos.add(direction);
    var block = this.getBlockAt(nextPos);
    if (block === Block.WALL || block === Block.BLOCK) {
      break;
    }
    finalPos = nextPos;
  }
  var finalBlock = this.getBlockAt(finalPos);
  if (finalBlock === Block.GOAL) {
    this.won = true;
  }
  this.setBlockAt(finalPos, Block.BLOCK);
  this.setBlockAt(blockPos, Block.EMPTY);
  return finalPos;
};

/**
 * Finalize the generation of a level
 */
Level.prototype.finalize = function() {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if (this.tileMap[x][y] === Block.ANY) {
        this.tileMap[x][y] = Block.EMPTY;
      }
    }
  }
};

/**
 * Mark all tiles in (startPos endPos] as empty or empty-like
 *
 * @param {Vec2} startPos
 * @param {Vec2} endPos
 */
Level.prototype.markEmptyUntil = function(startPos, endPos) {
  var direction = Vec2.getDirectionBetween(startPos, endPos);

  var currentPos = startPos.add(direction);
  var possibilities = [];
  console.log('from ' + startPos.toString() + ' ' + this.getBlockAt(startPos));
  console.log('to ' + endPos.toString() + ' ' + this.getBlockAt(endPos));

  while (true) {
    var block = this.getBlockAt(currentPos);

    console.log(currentPos.x + ',' + currentPos.y + ' ? ' +
                endPos.x + ',' + endPos.y);

    if (block === Block.ANY) {
      this.setBlockAt(currentPos, Block.EMPTY);
    }
    console.log(block);

    if (currentPos.intEq(endPos)) {
      console.log('done!');
      break;
    }

    currentPos = currentPos.add(direction);
  }
};

/**
 * Return the block at a position
 * @param {Vec2} pos
 * @return {Block} Block at pos
 */
Level.prototype.getBlockAt = function(pos) {
  if (typeof(this.tileMap[pos.x]) === 'undefined') {
    console.log('POS: ' + pos.x + ',' + pos.y);
    console.log(new Error().stack);
  }

  return this.tileMap[pos.x][pos.y];
};

/**
 * Set the block at a position
 * @param {Vec2} pos
 * @param {Block} block
 */
Level.prototype.setBlockAt = function(pos, block) {
  this.tileMap[pos.x][pos.y] = block;
};

/** NodeJS export */
module.exports = Level;
