# Prompt log

Ben's prompts for this testing assignment, verbatim and numbered, with the tool and model used for each.

Tool and model unless a row says otherwise: Claude Code (CLI), Claude Opus 5.5.

## 1. Getting started (Nov 19, 2026)

> let's get started on this assignment! It's late but we get partial credit as long as it is within a week https://www.cs.cmu.edu/~113/hw9.html

Used for: reading the assignment, choosing a starting codebase. Claude found that Faculty Twin was already split into modules and tested, and asked which codebase to use and where to put it.

## 2. Starting point and repo (Nov 19, 2026)

Answer to Claude's two questions. Starting point: "Connections player (Recommended)". Repo:

> don't put homework in the name of the repo Copy the code into a new repo, e.g. bcollier/connections-hw9-tests. The live game and its Vercel deploys are never touched, and the CI links graders open show only HW9 runs.

Used for: copying bcollier/connections_demo main into a new repo, bcollier/connections-player.

## 3. Where to edit (Nov 21, 2026)

> is there a way for me to edit the code remotely on my laptop or do I need to move this thread over to my laptop

Used for: deciding where Ben writes the Step 3 test by hand. No code was generated.

## 4. Handoff to the laptop (Nov 21, 2026)

> give me notes to hand to my local claude code

Used for: notes/HANDOFF.md, the briefing for a Claude Code session on Ben's laptop.

## 5. Help with the Step 3 test (Nov 21, 2026)

Tool: Claude Code (VS Code extension), Claude Opus 5.5.

> I need to write a test in tests/rules.test.js but I don't know any javascript
>
> This repo is my CMU 15-114 HW9 (Tests as Guardrails). Read notes/HANDOFF.md, notes/PLAN.md and https://www.cs.cmu.edu/~113/hw9.html before doing anything. Follow the rules in HANDOFF.md exactly. In particular, I'm writing the Step 3 test myself with no AI, so don't write or suggest any test code until I say Step 3 is done. Never draft TESTING.md. Append my prompts to prompt_log.md, and pull before you number one.

Used for: reading the handoff and assignment, checking the Node version. Claude declined to write, suggest or explain test code for Step 3 and pointed to the assignment's own example instead.

## 6. What guessKey does (Nov 21, 2026)

Tool: Claude Code (VS Code extension), Claude Opus 5.5.

> explain thiws guessKey(words)	The same four words in any order or case give the same key, so a repeat is caught	Order or case leaks into the key, so a reshuffled repeat costs a mistake

Used for: a plain-English explanation of the guessKey row in notes/PLAN.md and how the game uses it. No test code was written or suggested.

## 7. Explaining a failed test run (Nov 21, 2026)

Tool: Claude Code (VS Code extension), Claude Opus 5.5.

> explain the failed test

Used for: explaining Node's ERR_INVALID_MODULE_SPECIFIER error from Ben's hand-written tests/rules.test.js. Claude explained the error message only and did not edit the test file.
