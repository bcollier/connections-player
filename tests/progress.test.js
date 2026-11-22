// Trusting a saved game, and keeping only the newest saves.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreProgress, trimProgress, MAX_MISTAKES } from '../player/rules.js';
import { ALL_WORDS } from './helpers.js';

const save = extra => ({ order: [...ALL_WORDS].reverse(), mistakes: 2, guesses: [['Yellow', 'Yellow', 'Green', 'Yellow']], guessed: ['A|B|C|D'], over: false, won: false, solved: [], ...extra });

test('restoreProgress: no save means nothing to resume', () => {
  assert.equal(restoreProgress(null, ALL_WORDS), null);
  assert.equal(restoreProgress(undefined, ALL_WORDS), null);
});

test('restoreProgress: a save for a different puzzle is ignored', () => {
  const other = save({ order: ALL_WORDS.map((w, i) => (i === 0 ? 'BANANA' : w)) });
  assert.equal(restoreProgress(other, ALL_WORDS), null);
});

test('restoreProgress: a save with the wrong number of tiles is ignored', () => {
  assert.equal(restoreProgress(save({ order: ALL_WORDS.slice(0, 15) }), ALL_WORDS), null);
  assert.equal(restoreProgress(save({ order: 'APPLE' }), ALL_WORDS), null);
});

test('restoreProgress: a good save comes back with its order, guesses and flags', () => {
  const r = restoreProgress(save({ over: 1, won: 0 }), ALL_WORDS);
  assert.deepEqual(r.order, [...ALL_WORDS].reverse());
  assert.equal(r.mistakes, 2);
  assert.deepEqual(r.guesses, [['Yellow', 'Yellow', 'Green', 'Yellow']]);
  assert.ok(r.guessed instanceof Set && r.guessed.has('A|B|C|D'));
  assert.equal(r.over, true);
  assert.equal(r.won, false);
});

test('restoreProgress: mistakes are capped at the maximum', () => {
  assert.equal(restoreProgress(save({ mistakes: 9 }), ALL_WORDS).mistakes, MAX_MISTAKES);
  assert.equal(restoreProgress(save({ mistakes: 4 }), ALL_WORDS).mistakes, 4);
});

test('restoreProgress: damaged fields fall back to a fresh start', () => {
  const r = restoreProgress(save({ mistakes: 'lots', guesses: 'nope', guessed: 7, solved: undefined }), ALL_WORDS);
  assert.equal(r.mistakes, 0);
  assert.deepEqual(r.guesses, []);
  assert.equal(r.guessed.size, 0);
  assert.deepEqual(r.solved, []);
});

test('restoreProgress: changing the restored order does not change the save', () => {
  const s = save();
  const r = restoreProgress(s, ALL_WORDS);
  r.order.pop();
  assert.equal(s.order.length, 16);
});

test('trimProgress: keeps the newest saves and drops the oldest', () => {
  const all = { old: { at: 100 }, newest: { at: 300 }, middle: { at: 200 } };
  assert.deepEqual(Object.keys(trimProgress(all, 2)).sort(), ['middle', 'newest']);
});

test('trimProgress: a save with no time counts as the oldest', () => {
  const all = { undated: {}, dated: { at: 5 } };
  assert.deepEqual(Object.keys(trimProgress(all, 1)), ['dated']);
});
