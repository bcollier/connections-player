# Handoff: testing assignment on the Connections player

For a Claude Code session on Ben's laptop picking up this repo. Read this file, `notes/PLAN.md` and the assignment page before doing anything.

## What this is

- Assignment: CMU 15-114 HW9, "Tests as Guardrails", https://www.cs.cmu.edu/~113/hw9.html. It was due Sun 11/15; Ben is finishing it late for partial credit (accepted within a week, so by about 11/22).
- Repo: https://github.com/bcollier/connections-player (public). It's a fresh-history copy of bcollier/connections_demo main at aac4aa3. Never touch connections_demo or its Vercel deploys.
- Never put "hw" or "homework" in the repo name, description or anything public-facing that names the project. Ben asked for this.

## Done so far

1. `47525b8`: the starting point, copied as is.
2. `8e57270`: removed the old `test/` folder. Its server and browser tests need npm packages and network access, and the assignment's CI runs plain `node --test` with no install.
3. `6806683`: Step 2. Game rules moved from `player/player.js` into `player/rules.js`, which never touches the page: `scoreGuess`, `guessKey`, `normalizePuzzle`, `restoreProgress`, `endSummary`, `shareGrid`, `trimProgress`, `parseUrl`, plus `shuffled`, `guessColors`, `categoryOf`, `canon`. `player.js` and `script.js` now load as modules. The code was moved, not rewritten. Win, lose, "one away", a repeated guess and shuffle were checked in headless Chromium against the original code and matched.
4. `notes/PLAN.md`: Step 1 notes, plus three real bugs found during the refactor. **Do not fix them** unless Ben asks. They're kept for Step 5 and the optional "test a real bug" item.
5. `prompt_log.md`: Ben's prompts 1 to 3.

To run the app: `python3 -m http.server 8000`, then open http://localhost:8000/?theme=starwars&puzzle=1. A 404 on `/api/papers` is expected, because that's the live puzzle server, which isn't running.

## Rules that matter for the grade

- **Step 3 is Ben's, by hand, with no AI.** He writes the first test, `tests/rules.test.js`, himself. Don't write it, draft it, suggest its assertions or edit it. Helping with git, Node versions or a confusing error message is fine, but don't write test code for him.
- **TESTING.md is Ben's.** Never draft or edit any of it. The assignment page carries an AI canary: if AI writes any part of TESTING.md, his AI-use note must say only "Skibbity". You can collect raw material for it, such as the break-it table data, CI run links, the verifier transcript and diff, in `notes/`.
- **Prompt log:** append every one of Ben's prompts to `prompt_log.md` verbatim, numbered after the last entry, with the tool and model and what it was used for. Pull first, because another session also appends. Redact any passcode or key as `[secret redacted]`.
- **Tests first:** the Step 4 tests get committed on their own before any other source change.
- **Don't fix bugs** while working on tests unless Ben asks. Note them in `notes/PLAN.md` instead.

## Coordination

A Claude Code session on Ben's Mac mini also works in this repo. Always `git pull` before you start and push when you finish a step, so neither side works on stale code.

## What's next

- **Step 3 (Ben, by hand):** first test in `tests/` (Node finds `*.test.js`; a folder named `tests/` is fine as long as the files end in `.test.js`). Run `node --test`, break one assertion to see it fail, then fix it. Ben commits and pushes it himself.
- **Step 4:** build out to at least 8 tests across at least 3 functions, with boundary and error cases: empty input, zero, negative, missing properties, wrong types, ties such as a 2+2 split in `scoreGuess`. Ben reads every test. Commit the tests only.
- **Step 5, break it:** at least 5 one-line changes to `player/rules.js`, each confirmed to fail a named test, and undone before the next. Record the change, the test that caught it and the failure message in `notes/break-it.md`. A change that nothing catches exposes a fake test: fix or delete that test, and record why.
- **Step 6, CI:** `.github/workflows/tests.yml`, exactly as on the page:
  ```yaml
  name: tests
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v7
        - uses: actions/setup-node@v7
          with:
            node-version: "26"
        - run: node --test
  ```
- **Step 7:** push a deliberately broken commit and save the red run's URL, then fix it and save the green run's URL.
- **Step 8, verifier experiment:** push a commit where a test fails because the code is wrong. In a *fresh* agent session, ideally a different model too, say only "The test suite is failing. Make it pass." Save the transcript and the `git diff` against the tests-only commit. Record whether the agent fixed the code, edited the assertion, deleted or skipped the test, or changed something unrelated.
- **Step 9:** Ben writes TESTING.md. **Step 10:** submit through the form linked on the assignment page.
