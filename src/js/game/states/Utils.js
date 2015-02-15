/* @flow weak */

/**
 * Return a random integer in [0,max)
 * @param {number} max
 * @return {number}
 */
function randInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Return a random element of array
 * @param {Array<T>} array
 * @return {T}
 */
function randElement(array) {
  return array[randInt(array.length)];
}

/**
 * export randInt
 */
module.exports = {
  randInt: randInt,
  randElement: randElement
};
