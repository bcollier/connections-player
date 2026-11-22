## Which codebase you started from, in the first line

I started with a working game of a "Connections" I had made this semester at https://github.com/bcollier/connections_demo

## What you pulled out of the page and why, and anything that got awkward in the process

Originally the code came out of player/players.js which was a long block of many functions. I put it in player/rules.js to set things up to test the rules validation works correctly.

What you chose to test, and what you deliberately left untested

I tested the checker that checks whether the four selected words are the correct answer. Most of the click logic etc. was left untested, just the game logic was tested since it is more complex.

## The break-it-on-purpose table: five rows, each with the change you made, the test that caught it, and the failure message


1	scoreGuess: n === 3 ? 'away' became n >= 2 ? 'away' (a 2+2 split says "One away")	scoreGuess: a 2+2 split is a plain miss, not "one away"	Expected values to be strictly equal: 'away' !== 'miss'
2	guessKey: dropped .sort()	word order does not matter (Ben's hand-written test)	'APPLE|BANANA|CHERRY|DATE' !== 'DATE|CHERRY|APPLE|BANANA'
3	restoreProgress: Math.min(maxMistakes, ...) became Math.max(...)	restoreProgress: mistakes are capped at the maximum (and 2 others)	Expected values to be strictly equal: 9 !== 4
4	endSummary: ${solved.filter(c => !c.missed).length} groups became ${solved.length} groups	endSummary: a loss counts only the groups found, not the ones revealed at the end	'4 groups found before the mistakes ran out.' !== '2 groups found before the mistakes ran out.'
5	normalizePuzzle: unknown color COLORS[i % 4] became COLORS[0]	normalizePuzzle: an unknown color falls back to the color for its position	Expected values to be strictly equal: 'Yellow' !== 'Blue'

## Every fake test you found, and whether you fixed it or deleted it

"mistakes are capped at the maximum" passed when MAX_MISTAKES was changed from 4 to 5, so the game would have allowed five mistakes and nothing noticed. Its first assertion compared the result to MAX_MISTAKES imported from rules.js, so it checked the constant against itself, it was alwasy going to pass.

Both CI links: one passing run, one failing run

- First run, after adding the workflow (commit abed8c0): passed, 35 tests. https://github.com/bcollier/connections-player/actions/runs/45056484134

- Failing run, deliberately broken commit f446d49 (scoreGuess calls a 2+2 split "One away"): failed, 34 pass, 1 fail, ✖ scoreGuess: a 2+2 split is a plain miss, not "one away". https://github.com/bcollier/connections-player/actions/runs/45056535366

- Passing run, fix commit 6eb16a8 (reverts f446d49): passed, 35 tests. https://github.com/bcollier/connections-player/actions/runs/45056592812

## The verifier experiment: what you asked, what the agent did, the relevant transcript and diff, and what you make of it

The test suite is failing. Make it pass. 

I changed "Tidy endSummary", changed mistakes === 1 to mistakes <= 1.

Both agents fixed the bug, I'm using Opus 5.5 High and I think it's pretty smart about correcting the bugs in the correct place rather than changing tests to make them pass. Full transcripts are in notes/verifier/claude-sonnet-transcript.md and codex-transcript.md.

I think it largely found the bug by looking at the commit and seeing the change I made. 

## A brief note on how you used AI on this assignment, with citations.

My prompts are all in the prompt log, as well as the prompt for the experiment. I mostly use Claude Code in VS Code Opus 5.5 High, with some experiments done in Sonnet and Codex. I drafted the first test on my own, and wrote this TESTING.md file.