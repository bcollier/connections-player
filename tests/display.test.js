// What the player sees at the end, and reading the theme and puzzle from the URL.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { endSummary, shareGrid, parseUrl } from '../player/rules.js';

const fourGuesses = Array(4).fill(['Yellow', 'Yellow', 'Yellow', 'Yellow']);

test('endSummary: a win counts guesses and mistakes', () => {
  assert.equal(endSummary({ won: true, guesses: Array(6).fill([]), mistakes: 2, solved: [] }), '6 guesses, 2 mistakes.');
});

test('endSummary: one mistake is singular, zero is plural', () => {
  assert.equal(endSummary({ won: true, guesses: Array(5).fill([]), mistakes: 1, solved: [] }), '5 guesses, 1 mistake.');
  assert.equal(endSummary({ won: true, guesses: fourGuesses, mistakes: 0, solved: [] }), '4 guesses, 0 mistakes.');
});

test('endSummary: a loss counts only the groups found, not the ones revealed at the end', () => {
  const solved = [{ missed: false }, { missed: false }, { missed: true }, { missed: true }];
  assert.equal(endSummary({ won: false, guesses: fourGuesses, mistakes: 4, solved }), '2 groups found before the mistakes ran out.');
});

test('shareGrid: one row of squares per guess, in order', () => {
  const grid = shareGrid([['Yellow', 'Green', 'Blue', 'Purple'], ['Purple', 'Purple', 'Purple', 'Purple']]);
  assert.equal(grid, '\u{1F7E8}\u{1F7E9}\u{1F7E6}\u{1F7EA}\n\u{1F7EA}\u{1F7EA}\u{1F7EA}\u{1F7EA}');
});

test('shareGrid: no guesses gives an empty grid', () => {
  assert.equal(shareGrid([]), '');
});

test('parseUrl: theme and puzzle number become a pack and a zero-based index', () => {
  assert.deepEqual(parseUrl('?theme=lotr&puzzle=2', ['starwars', 'lotr']), ['lotr', 1]);
});

test('parseUrl: no puzzle number, or one that is not a number, means the first puzzle', () => {
  assert.deepEqual(parseUrl('?theme=lotr', ['lotr']), ['lotr', 0]);
  assert.deepEqual(parseUrl('?theme=lotr&puzzle=abc', ['lotr']), ['lotr', 0]);
});

test('parseUrl: an unknown theme or no theme is ignored', () => {
  assert.equal(parseUrl('?theme=startrek&puzzle=1', ['starwars', 'lotr']), null);
  assert.equal(parseUrl('?puzzle=3', ['lotr']), null);
  assert.equal(parseUrl('', ['lotr']), null);
});
