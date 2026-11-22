# Testing plan (Step 1 notes)

Working notes, not the write-up. TESTING.md is Ben's to write.

## The logic in `player/rules.js`

Each piece: what it should do, then one plausible way it could be wrong.

| Function | Should | Could be wrong |
| --- | --- | --- |
| `scoreGuess(picked, categories)` | 4 from one group is `correct`, 3 is `away` ("One away..."), anything else is `miss` | A 2+2 split reported as "One away", or 3+1 reported as a miss |
| `guessKey(words)` | The same four words in any order or case give the same key, so a repeat is caught | Order or case leaks into the key, so a reshuffled repeat costs a mistake |
| `normalizePuzzle(p)` | Capitalize words, give every group a valid color, sort Yellow to Purple, drop malformed story/definitions | A missing color duplicates one already used (see below) |
| `restoreProgress(save, order)` | Resume only a save that matches this puzzle's 16 words; cap mistakes at 4 | Accepts a damaged save (see below) |
| `endSummary({...})` | "6 guesses, 2 mistakes." / "1 mistake" singular / losing line counts only groups found, not revealed | Plural wrong, or revealed groups counted as found |
| `shareGrid(guesses)` | One row of colored squares per guess | Rows joined wrong, or colors mapped to the wrong emoji |
| `trimProgress(all, keep)` | Keep the newest `keep` saves by `at` | Keeps the oldest instead |
| `parseUrl(search, packIds)` | `?theme=lotr&puzzle=2` gives `['lotr', 1]`; an unknown theme gives null | Off by one, or bad input falls through |

## Bugs found while refactoring (left alone on purpose)

The refactor was a move, not a fix. Checked in Node against `player/rules.js` at commit 6806683:

1. **`restoreProgress` accepts a save with repeated words.** It checks that the saved order has 16 entries that are all real words, but not that they are 16 different words. `{ order: ['W0' x16] }` is accepted.
2. **`restoreProgress` accepts negative mistakes.** `mistakes: -3` survives (it is only capped at the top), so a tampered save gives 7 mistakes left.
3. **`normalizePuzzle` can give two groups the same color.** A group with no color falls back to the color for its position, even if another group already has it: `[Green, (none)]` becomes `Green, Green`.
4. **`endSummary` says "1 groups found"** when a loss found exactly one group: the losing line has no singular form. Found while writing Step 4 tests; the test uses 2 groups so it does not lock the bug in.
5. Not a bug in play: `parseUrl` turns `?puzzle=0` into index -1, and `setPack` clamps that to 0.

These are good candidates for the optional "test for a real bug" and for Step 5.

## Step 3 (Ben, by hand, no AI)

Create `tests/rules.test.js`, import `test` from `node:test`, `assert` from `node:assert/strict`, and a function from `../player/rules.js`. Run `node --test`. Then break one assertion on purpose to see it fail.
