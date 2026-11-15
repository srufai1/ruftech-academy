# Builder notes — modules 1 and 2

Written by the builder after building units 1.2–1.6 and 2.1–2.6 from `00-guide.md`,
`01-command-line.md` and `02-javascript-typescript.md`. For the designer: interim answers to
open questions, and places where the design and reality differed. Each item says what was
built, so it can be confirmed or changed.

## Interim answers to open questions (please confirm or replace)

| Question | What was built |
| :--- | :--- |
| **Q1 — debugging labs** | Lab projects (1.2, 1.3, 2.5): the lab's own seed also builds the debugging lab — in a `debug/` subfolder (1.2, 1.3) or a sibling repository (1.4 `~/academy-labs/m1-p4/timetable`, 2.5 `~/academy-labs/m2-p5/class-codes`; a Git repository cannot sit inside another). Repo projects (1.5, 1.6, 2.1–2.4, 2.6): the colleague's code is printed in the page; 1.6 prints a setup script. All debugging labs are **self-reviewed**; no check. Reason: the content build allows one check per unit, and a repo project has no lab folder to seed |
| **Q1 — own builds** | Self-reviewed against their requirements; no check |
| **Q9 — target site of 1.5** | `ruftech-academy.vercel.app/sign-in`: the course's own platform, the same stack, GET requests only |

Note: unit 1.1 (built earlier) still tells learners to run `npx academy init m1-p1-debug` and
`npx academy check m1-u1-own`. Those checks do not exist. Unit 1.1 was left as it was.

## Where the design and the build differ

| Unit | Difference |
| :--- | :--- |
| All | Diagrams are text, not Mermaid: the site renders Markdown without Mermaid or raw HTML. "Folded" answer keys are placed at the end of `review.md` behind a "stop" line |
| 1.5 | One step added: `heading-order` (the doc step does not check order) |
| 1.6 | The planted lint error is a misspelt name (`no-undef`); ESLint's recommended rules do not report use-before-define. A `verify.sh` joined with `;` still passes the check (self-review, as designed) |
| 2.1 | With both planted faults, 70 gives `undefined`, not "High". "High" appears only after the `high` check is removed. The page reports `undefined` for 70, 65 and 64.5, and warns that a new wrong answer appears after one fix |
| 2.3 | The type check needs `@types/node` and `types: ["node"]` for `node:test` imports; added to the module's tsconfig in the pages. The debugging lab's second fault hides the first, so the reports come in the order a learner meets them (a typed 0 first, then the blank) |
| 2.4 | `toISOString().slice(0, 10)` passes the check: Accra is UTC+0, so no test can tell it apart. The lesson names it "right by luck" |
| 2.5 | Source is about 35 lines, not 90. Report B is worded for what a single-space split does (an empty first name; a space before the surname), not "no surname". GPIS assigns the House in a migration (`order by student_count, house`), not under `src/lib/admissions`; the Compare questions point there |
| 2.6 | The shapes fixture has one more line than designed (a `StudentId` where a `ClassId` is wanted): without it an unbranded `ClassId` passed. The roll fixture is in `check/tests/`, imported by the tests |

## How each check was proven

For every check: it fails on a fresh seed (or an empty project) and passes on a solved copy
kept outside the repository. Each common mistake named in the design was planted in the solved
copy and failed on the expected step. Every expected output in the guided examples and
debugging labs was produced by running the commands.
