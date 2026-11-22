# CI runs (Steps 6 and 7)

Workflow: `.github/workflows/tests.yml`, exactly as on the assignment page (checkout@v7, setup-node@v7, Node 26, `node --test`).

- First run, after adding the workflow (commit abed8c0): passed, 35 tests. https://github.com/bcollier/connections-player/actions/runs/45056484134
- **Failing run**, deliberately broken commit f446d49 (`scoreGuess` calls a 2+2 split "One away"): failed, 34 pass, 1 fail, `✖ scoreGuess: a 2+2 split is a plain miss, not "one away"`. https://github.com/bcollier/connections-player/actions/runs/45056535366
- **Passing run**, fix commit 6eb16a8 (reverts f446d49): passed, 35 tests. https://github.com/bcollier/connections-player/actions/runs/45056592812
