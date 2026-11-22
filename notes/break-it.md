# Step 5 raw results: breaking `player/rules.js` on purpose

Raw data for Ben's TESTING.md table. This isn't the write-up.

Method: each row is a one-line change to `player/rules.js`. The full suite was run with `node --test`, and the change was undone before the next one, so the file was back to the original after every run (`git status` was clean). There were 32 changes in two rounds. Round 1 broke the most likely things. Round 2 aimed at the 14 tests round 1 never made fail, to tell weak tests from untargeted ones. Run on Nov 22, 2026, against commit 8cbe6bb (the tests-only commit). The scripts that ran the changes were throwaway, not committed.

## The five strongest rows (one per function, all from real failure output)

| # | One-line change | Test that caught it | Failure message |
| --- | --- | --- | --- |
| 1 | `scoreGuess`: `n === 3 ? 'away'` became `n >= 2 ? 'away'` (a 2+2 split says "One away") | scoreGuess: a 2+2 split is a plain miss, not "one away" | `Expected values to be strictly equal: 'away' !== 'miss'` |
| 2 | `guessKey`: dropped `.sort()` | word order does not matter (Ben's hand-written test) | `'APPLE\|BANANA\|CHERRY\|DATE' !== 'DATE\|CHERRY\|APPLE\|BANANA'` |
| 3 | `restoreProgress`: `Math.min(maxMistakes, ...)` became `Math.max(...)` | restoreProgress: mistakes are capped at the maximum (and 2 others) | `Expected values to be strictly equal: 9 !== 4` |
| 4 | `endSummary`: `${solved.filter(c => !c.missed).length} groups` became `${solved.length} groups` | endSummary: a loss counts only the groups found, not the ones revealed at the end | `'4 groups found before the mistakes ran out.' !== '2 groups found before the mistakes ran out.'` |
| 5 | `normalizePuzzle`: unknown color `COLORS[i % 4]` became `COLORS[0]` | normalizePuzzle: an unknown color falls back to the color for its position | `Expected values to be strictly equal: 'Yellow' !== 'Blue'` |

## Fake test found

- **"restoreProgress: mistakes are capped at the maximum"** passed when `MAX_MISTAKES` was changed from 4 to 5, so the game would have allowed five mistakes and nothing noticed. Its first assertion compared the result to `MAX_MISTAKES` imported from `rules.js`, so it checked the constant against itself. A tautology.
  - **Fix:** compare to the literal `4`, the rule of the game, instead of the code's own constant. Rerun: the 4 → 5 change now fails that test.
- **Untested, not fake:** `trimProgress(all)` with no second argument. Changing the default from 40 to 4 passed, because every test passed its own `keep`.
  - **Fix:** added "trimProgress: keeps 40 saves unless told otherwise". Rerun: the 40 → 4 change now fails it.

After the two fixes, the suite has 35 tests, all passing, and every one of the 32 changes is caught.

## All 32 changes

| Change | Caught by |
| --- | --- |
| scoreGuess: 2+2 counts as "one away" | 2+2 split is a plain miss |
| scoreGuess: needs 5 for correct | four words from one group is correct (`'miss' !== 'correct'`) |
| scoreGuess: 1-1-1-1 counts as "one away" | one word from each group is a miss |
| scoreGuess: 3+1 is a miss | three from one group is "one away"; 2+2 split |
| guessKey: no sort | word order does not matter |
| guessKey: keys on the first word only | a different set of words gives a different key |
| canon: keeps spaces | spaces and punctuation are ignored (`'A\|B\|NEW YORK\|ONEIL'`) |
| canon: no uppercasing | case does not matter (`'\|I\|P\|PLUM' !== 'APPLE\|FIG\|PEAR\|PLUM'`) |
| guessColors: every word gets the first word's color | one color per word, in the order picked |
| normalizePuzzle: sorts Purple first | groups are sorted Yellow to Purple; words become capitals |
| normalizePuzzle: unknown color always Yellow | unknown color falls back by position |
| normalizePuzzle: keeps 3 definitions | story without url / definitions not four are dropped |
| normalizePuzzle: stops uppercasing | words become capitals |
| normalizePuzzle: no guard for missing categories | no categories gives an empty list (`TypeError: Cannot read properties of undefined (reading 'map')`) |
| normalizePuzzle: edits the input | the input puzzle is not changed |
| shuffled: loop stops one swap early | fixed random number gives a predictable result |
| shuffled: works on the original array | keeps every item and leaves the original alone |
| restoreProgress: Math.max for the cap | 3 tests (good save, capped, damaged fields) |
| restoreProgress: no length check | wrong number of tiles is ignored |
| restoreProgress: `some` instead of `every` | a save for a different puzzle is ignored |
| restoreProgress: no null check | no save means nothing to resume (`TypeError: Cannot read properties of null (reading 'order')`) |
| restoreProgress: returns the saved array itself | changing the restored order does not change the save (`15 !== 16`) |
| trimProgress: keeps the oldest | keeps the newest; undated counts as oldest |
| trimProgress: default 40 → 4 | **not caught** until the new default test |
| MAX_MISTAKES 4 → 5 | **not caught** until the fake assertion was fixed |
| endSummary: singular for zero | one is singular, zero is plural (`'4 guesses, 0 mistake.'`) |
| endSummary: guess count off by one | win counts guesses; singular/plural |
| endSummary: counts revealed groups | a loss counts only the groups found |
| shareGrid: rows not separated | one row of squares per guess |
| shareGrid: adds a header row | one row per guess; no guesses gives an empty grid (`'Connections' !== ''`) |
| parseUrl: off by one | zero-based index; missing or bad number means first puzzle |
| parseUrl: accepts any theme | an unknown theme or no theme is ignored |
