// Getting a puzzle ready to play, and shuffling its tiles.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePuzzle, shuffled } from '../player/rules.js';

const raw = () => ({
  title: 'Test',
  categories: [
    { label: 'B', color: 'Purple', words: ['cup', 'pan', 'sponge', 'cheese'] },
    { label: 'A', color: 'Yellow', words: ['apple', 'pear', 'plum', 'fig'] },
    { label: 'C', color: 'Blue', words: ['crow', 'wren', 'owl', 'jay'] },
    { label: 'D', color: 'Green', words: ['oak', 'elm', 'ash', 'yew'] },
  ],
});

test('normalizePuzzle: words become capitals', () => {
  const p = normalizePuzzle(raw());
  assert.deepEqual(p.categories[0].words, ['APPLE', 'PEAR', 'PLUM', 'FIG']);
});

test('normalizePuzzle: groups are sorted Yellow, Green, Blue, Purple', () => {
  const p = normalizePuzzle(raw());
  assert.deepEqual(p.categories.map(c => c.color), ['Yellow', 'Green', 'Blue', 'Purple']);
  assert.deepEqual(p.categories.map(c => c.label), ['A', 'D', 'C', 'B']);
});

test('normalizePuzzle: an unknown color falls back to the color for its position', () => {
  const r = raw();
  r.categories[2].color = 'Red'; // third group, so it falls back to Blue
  const p = normalizePuzzle(r);
  assert.equal(p.categories.find(c => c.label === 'C').color, 'Blue');
});

test('normalizePuzzle: a story without a url and definitions that are not four are dropped', () => {
  const r = raw();
  r.categories[0].story = { title: 'No link' };
  r.categories[0].definitions = ['one', 'two', 'three'];
  r.categories[1].story = { title: 'Linked', url: 'https://example.com' };
  r.categories[1].definitions = [1, 2, 3, 4];
  const p = normalizePuzzle(r);
  const b = p.categories.find(c => c.label === 'B');
  const a = p.categories.find(c => c.label === 'A');
  assert.equal(b.story, null);
  assert.equal(b.definitions, null);
  assert.equal(a.story.url, 'https://example.com');
  assert.deepEqual(a.definitions, ['1', '2', '3', '4']);
});

test('normalizePuzzle: a puzzle with no categories gives an empty list, not a crash', () => {
  assert.deepEqual(normalizePuzzle({ title: 'Empty' }).categories, []);
});

test('normalizePuzzle: the input puzzle is not changed', () => {
  const r = raw();
  const before = JSON.stringify(r);
  normalizePuzzle(r);
  assert.equal(JSON.stringify(r), before);
});

test('shuffled: with a fixed random number the result is predictable', () => {
  assert.deepEqual(shuffled([1, 2, 3, 4], () => 0), [2, 3, 4, 1]);
});

test('shuffled: keeps every item and leaves the original alone', () => {
  const words = ['A', 'B', 'C', 'D', 'E'];
  const out = shuffled(words, () => 0.5);
  assert.deepEqual([...out].sort(), words);
  assert.deepEqual(words, ['A', 'B', 'C', 'D', 'E']);
});
