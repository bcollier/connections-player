// Scoring a guess and spotting a repeated one.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreGuess, guessKey, guessColors } from '../player/rules.js';
import { YELLOW, CATEGORIES } from './helpers.js';

test('scoreGuess: four words from one group is correct', () => {
  const r = scoreGuess(['FIG', 'APPLE', 'PLUM', 'PEAR'], CATEGORIES);
  assert.equal(r.verdict, 'correct');
  assert.equal(r.n, 4);
  assert.equal(r.best, YELLOW);
});

test('scoreGuess: three from one group and one stray is "one away"', () => {
  const r = scoreGuess(['APPLE', 'PEAR', 'OAK', 'PLUM'], CATEGORIES);
  assert.equal(r.verdict, 'away');
  assert.equal(r.n, 3);
  assert.equal(r.best, YELLOW);
});

test('scoreGuess: a 2+2 split is a plain miss, not "one away"', () => {
  const r = scoreGuess(['APPLE', 'PEAR', 'OAK', 'ELM'], CATEGORIES);
  assert.equal(r.verdict, 'miss');
  assert.equal(r.n, 2);
});

test('scoreGuess: one word from each group is a miss', () => {
  const r = scoreGuess(['APPLE', 'OAK', 'CROW', 'CUP'], CATEGORIES);
  assert.equal(r.verdict, 'miss');
  assert.equal(r.n, 1);
});

test('guessKey: case does not matter', () => {
  assert.equal(guessKey(['apple', 'Pear', 'PLUM', 'fIg']), guessKey(['APPLE', 'PEAR', 'PLUM', 'FIG']));
});

test('guessKey: spaces and punctuation are ignored', () => {
  assert.equal(guessKey(["O'NEIL", 'NEW YORK', 'A', 'B']), guessKey(['ONEIL', 'NEWYORK', 'A', 'B']));
});

test('guessKey: a different set of words gives a different key', () => {
  assert.notEqual(guessKey(['APPLE', 'PEAR', 'PLUM', 'FIG']), guessKey(['APPLE', 'PEAR', 'PLUM', 'OAK']));
});

test('guessColors: one color per word, in the order picked', () => {
  assert.deepEqual(guessColors(['CUP', 'APPLE', 'OWL', 'OAK'], CATEGORIES), ['Purple', 'Yellow', 'Blue', 'Green']);
});
