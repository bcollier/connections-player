// A small puzzle shared by the tests: four groups of four, one of each color.
// Not a test file itself (no .test.js), so node --test does not run it.
export const YELLOW = { label: 'Fruit', color: 'Yellow', words: ['APPLE', 'PEAR', 'PLUM', 'FIG'] };
export const GREEN = { label: 'Trees', color: 'Green', words: ['OAK', 'ELM', 'ASH', 'YEW'] };
export const BLUE = { label: 'Birds', color: 'Blue', words: ['CROW', 'WREN', 'OWL', 'JAY'] };
export const PURPLE = { label: '___ cake', color: 'Purple', words: ['CUP', 'PAN', 'SPONGE', 'CHEESE'] };
export const CATEGORIES = [YELLOW, GREEN, BLUE, PURPLE];
export const ALL_WORDS = CATEGORIES.flatMap(c => c.words);
