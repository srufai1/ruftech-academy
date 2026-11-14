# Module 2 — JavaScript and TypeScript

Read `00-guide.md` first. Level: **guided** (all six units). 8 weeks, about 104 hours.

| Unit | Title | Project | Kind | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2.1 | Values, functions and tests | `m2-p1` Grading scale | Repo | 960 | 9 |
| 2.2 | Arrays, objects and sorting | `m2-p2` Class ranking | Repo | 1020 | 8 |
| 2.3 | TypeScript and input you cannot trust | `m2-p3` Score rules | Repo | 1140 | 9 |
| 2.4 | Dates, time zones and text | `m2-p4` School dates and names | Repo | 1080 | 10 |
| 2.5 | Reading and repairing code | `m2-p5` Repair, do not rewrite | Lab | 960 | 10 |
| 2.6 | Types that model the school | `m2-p6` Typed data shapes | Repo | 1080 | 9 |

All repo projects run from `~/projects/gpis-rebuild`. Code goes in `src/lib/`, the learner's
own tests in `tests/`.

## Module rules (decided here, so the builder does not have to)

| Topic | Rule |
| :--- | :--- |
| Language | Units 2.1 and 2.2 are plain JavaScript in `.mjs` files. Unit 2.3 brings in TypeScript; its lab converts `grading.mjs` and `ranking.mjs` to `.ts`. From then on every source file is `.ts` |
| Running TypeScript | Node 22.18+ runs `.ts` files directly (it removes the types). No build step in this module. So: no `enum`, no `namespace`, no parameter properties; imports name the file with its `.ts` ending |
| Test runner | Node's own: `node --test`, `node:test`, `node:assert/strict`. No Jest, no Vitest. `package.json` gets `"test": "node --test"` in 2.1 |
| Learner's tests | `tests/<name>.test.mjs` (2.1–2.2), `.test.ts` from 2.3 |
| Course tests | `check/tests/<name>.test.mjs`. Each loads the learner's module with a helper that tries `src/lib/<name>.ts` first, then `src/lib/<name>.mjs`, from `process.env.ACADEMY_PROJECT`. So a 2.1 check still passes after the 2.3 conversion |
| Errors | "Refuse" means `throw`: `TypeError` for a wrong kind of value, `RangeError` for a number outside the range |
| Purity | Every function in this module is pure: no console output, no file, no clock (except the one `now` parameter in 2.4), no change to its arguments |
| `tsconfig.json` (from 2.3) | `strict`, `noUncheckedIndexedAccess`, `noEmit`, `module` and `moduleResolution` `nodenext`, `target` `es2023`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `include: ["src", "tests"]` |

## GPIS rules used in this module

| Rule | Text to use |
| :--- | :--- |
| **D-01** | Remark scale, Creche to JHS 2 only, never JHS 3: 80–100 Highest, 70–79 Higher, 65–69 High, 60–64 High Average, 55–59 Average, 50–54 Low Average, 45–49 Low, 40–44 Lower, 0–39 Lowest. Calculated from the score by one shared function, never stored |
| D-01 in code | `src/lib/assessments/remark.ts`, `remarkFromTotal`: the bands are tested from the top with `>=` (so 79.5 is "Higher"), and a total outside 0–100 is clamped, not refused |
| **D-02** | Standard competition ranking. 90, 90, 80 → 1, 1, 3. 75, 70, 70, 65 → 1, 2, 2, 4. Not dense ranking |
| **D-03** | Ranking is on total score, inside one class only. JHS 3 is not ranked |
| **Q-07** (closed) | A student with missing subject scores still receives a position. In code (`report-card.ts`, "A missing or partial final result adds nothing (Q-07)"): a missing subject adds nothing to the total; the total is rounded to two decimals |
| **D-04** | Every class list, ranking and on-roll count covers students with an open membership for that class and term **and** `status = 'active'`. An automated test for the status filter is required |
| **D-10** | A missing score prints blank, never 0. Blank means "not assessed" |
| **D-162** | Creche–JHS 2 parts: Individual Test, Class Test, Group Work, Project Work, each out of 15; Examination out of 100. CA raw (out of 60) scaled to 50, plus Exam scaled to 50, gives the Final out of 100. Zero, blank and `ABS` are three different things; blank and `ABS` never become 0; a total exists only when every part is a number. Marks have at most two decimal places |
| D-162 in code | `src/lib/assessments/raw-marks.ts`: `parseRawMark`, `calculateRawAssessment` |
| **D-171** | JHS Integrated Science examination is marked out of 140. 112 / 140 → 40 (JHS 1–2). The maximum is stored on each record (D-27) |
| **D-27 / D-80** | JHS 3 mock: CA out of 30, a whole number; Exam raw out of 100, scaled to 70 as a whole number; Final out of 100. (Own build of 2.3 only) |
| **D-247** | Name search: every typed word must appear in the first, middle or last name, in any order; full stops are ignored |
| D-247 in code | `src/lib/students/name-class-search.ts`: `nameSearchWords` |
| School date in code | `src/lib/school-date.ts`: `SCHOOL_TIME_ZONE = "Africa/Accra"`; dates are `YYYY-MM-DD` strings; arithmetic on whole calendar days in UTC |
| **D-46** | Import: full name → first word is the first name, the rest is the last name; one word is a row error; middle name stays empty |
| **D-48** | Generated admission number `ADM/GPIS/YYYY/NNN`: YYYY is the admission year, NNN runs from 001 |
| **D-70** | A new student's House is assigned automatically: House 1–4, the one with the fewest students; ties go to the first name in alphabetical order |
| **D-19 – D-23** | No class on the student. Membership = student, class, academic year, start date, nullable end date, terms. A score points to the membership it was earned under. Student status (`active`, `withdrawn`, `alumni`) is separate from membership status (open or ended). Alumni is a status, never a class |

---

## Unit 2.1 — Values, functions and tests

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m2-u1` / `m2-p1` |
| title | Values, functions and tests |
| module / position | 2 / 1 |
| guidance | guided |
| minutes | 960 |
| gpis_part | The grading scale every GPIS screen and document uses (D-01) |
| requires | `[wsl, node, git]` |

### Outcomes

After this unit you can:

1. name JavaScript's kinds of value and say what `typeof` gives for each;
2. write a function with parameters, a return value and `if` / `else if`;
3. test every boundary of a rule with `node:test`, and write the test before the code;
4. refuse bad input with `throw`, and test that the refusal happens;
5. export a function from a module and import it in another file.

### Lesson (two parts)

| § | Section | Key ideas |
| :--- | :--- | :--- |
| A1 | Running JavaScript | `node file.mjs`, the REPL, `console.log` for looking (never inside a rule function) |
| A2 | Values | number, string, boolean, `null`, `undefined`; `typeof`; `NaN` and `Number.isFinite` |
| A3 | Names | `const` first, `let` when it must change, never `var` |
| A4 | Comparing | `===` not `==`; `<`, `>=`; `&&`, `\|\|`, `!`; why `"80" >= 80` is a trap |
| A5 | Functions | Parameters, `return`, early return; one job per function |
| A6 | Choosing | `if` / `else if` in order from the top band down; a table of bands and a loop as the second way |
| B1 | Modules | `export function`, `import { … } from "./x.mjs"` |
| B2 | Tests | `test("…", () => { assert.equal(…) })`; `npm test`; a test name is a sentence about the rule |
| B3 | Boundaries | A band has two edges; test both sides of each: 79, 80; 69, 70; … |
| B4 | Refusing | `throw new RangeError("…")`; `assert.throws`; why a wrong remark is worse than an error |
| B5 | In GPIS | D-01: one function, used everywhere; the remark is calculated when needed and never stored, so a change of scale cannot leave old wrong words in the database |

- **Diagram:** a number line 0–100 with the nine bands and their edges marked.
- **Common mistakes**
  1. Testing only "a typical value" in each band → an off-by-one at 80 passes → test both sides of every edge.
  2. `if (score > 80)` → 80 itself falls into "Higher" → the scale says 80–100.
  3. Checking bands from the bottom with `>=` → everything is "Lowest" → start from the top.
  4. Returning `undefined` for bad input → the caller prints "undefined" on a report → throw.
  5. Writing the code first and the tests after → the tests copy the bugs → write the failing test first.

### Guided example — "Pass or fail" (a rule that is **not** in GPIS, so nothing is given away)

Folder `~/academy-labs/scratch/u2-1/`. Rule: 50 and above is `"pass"`, below is `"fail"`,
outside 0–100 is refused.

1. `npm init -y`, `"type": "module"`, `"test": "node --test"`.
2. Write `tests/pass.test.mjs` first with one test: 50 → `"pass"`. Run: it fails ("cannot find module"). Read the failure.
3. Write `src/pass.mjs` with the smallest function. Run: green.
4. Add tests for 49, 0, 100. One fails or not? Predict before running.
5. Add `assert.throws(() => passOrFail(101), RangeError)`. Run: red. Add the check. Green.
6. Add `-1`, `NaN`, `"50"`. Decide `TypeError` for the string. Green.
7. Show the trap: remove `Number.isFinite`, pass `NaN`: the result is `"fail"`. Put the check back.
8. Commit: test and code together, message says the rule.

What you just used: `const`, `function`, `if`, `===`, `throw`, `export` / `import`, `node --test`.

### Quiz plan (`m2-u1-quiz`, 7 questions, pass mark 5)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | GPIS D-01: remark for 79 | Higher | Highest (thinks 79 rounds up); High (band below: 65–69); High Average (two bands off) |
| 2 | GPIS D-01: which pair tests one boundary correctly? | 64 → High Average and 65 → High | 60 and 65 (two different lower edges, neither side tested); 65 and 69 (both inside one band); 64 and 66 (skips the edge itself) |
| 3 | Predict: `typeof NaN` | `"number"` | `"NaN"` (no such type); `"undefined"`; `"object"` (that is `null`) |
| 4 | Predict: `"80" >= 80` and `"80" === 80` | `true` and `false` | both true (`===` does not convert); both false (`>=` converts the text); error (JavaScript does not refuse) |
| 5 | Find the mistake: `if (s >= 0) return "Lowest"; if (s >= 40) return "Lower"; …` | The first test is true for every score, so every remark is "Lowest" | "`>=` should be `==`"; "`return` cannot be used in `if`"; "Nothing is wrong" |
| 6 | Why does GPIS never store the remark beside the score? | It can always be worked out from the score, and a stored copy can disagree with it | "To save disk space" (tiny); "Because text cannot be stored in a database"; "Because remarks are secret" |
| 7 | A remark function gets 140. Which behaviour is safest for a report card? | Refuse (throw), so the wrong mark is found | Return "Highest" (hides a wrong mark as the best result); return `""` (prints a blank that looks like "not assessed"); return 100's remark and log it (nobody reads the log) |

### Lab — project 2.1 Grading scale (repo project)

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/grading.mjs` exports `remarkFor(total)` and `REMARK_BANDS` | `files`, `bands-exported` |
| 2 | `remarkFor` returns the D-01 remark for every total from 0 to 100, whole or with decimals (79.5 is "Higher": a band starts **at** its lower number) | `scale` |
| 3 | A total below 0, above 100, `NaN` or infinite is refused with `RangeError` | `refuses` |
| 4 | A value that is not a number (`"80"`, `null`, `undefined`, `true`) is refused with `TypeError` | `refuses` |
| 5 | `REMARK_BANDS` is an array of nine `{ low, label }` objects, highest band first; `remarkFor` reads it (the nine words are typed once) | `bands-exported`, `one-table` |
| 6 | `tests/grading.test.mjs` is yours: at least 18 tests, and `npm test` passes | `own-tests`, `npm-test` |
| 7 | `npm run lint` passes; at least 4 new commits | `lint`, `history` |

**Steps (guided):** (1) add the `test` script; (2) write three tests from the D-01 table
(100, 80, 79); run red; (3) write `remarkFor` for those; green; (4) one band at a time: two
tests (both sides of the lower edge), then the code; (5) the refusals, tests first;
(6) move the nine bands into `REMARK_BANDS` and make `remarkFor` loop over it; all tests stay
green; (7) add `npm test` to `scripts/verify.sh`; (8) commit after each band group.

**Hints:** (a) Work from the top band down. (b) `Number.isFinite` is false for `NaN`,
`Infinity` and for text. (c) To check "typed once": `grep -c "High Average" src/lib/grading.mjs`.

**Finished state:** `src/lib/grading.mjs`, `tests/grading.test.mjs`, `package.json` with
`test`, `verify.sh` running lint and tests.

### Debugging lab — "Half the class is 'High'"

| Item | Design |
| :--- | :--- |
| Seeded | `remark.mjs`: a band table and a loop, plus `remark.test.mjs` with 6 passing tests (typical values only: 90, 75, 67, 52, 42, 10) |
| Symptom | "A pupil with 70 got 'High'. And a pupil with 64.5 got no remark at all: the card shows `undefined`." |
| Fault 1 | The loop tests `total > band.low` (strictly greater), so every exact lower edge falls one band down |
| Fault 2 | The table lists whole-number `high` values and tests `total <= band.high`; 64.5 is above 64 and below 65, so no band matches and the function returns nothing |
| Evidence | Observe: the two inputs and outputs. Causes: wrong table numbers; wrong comparison; rounding. Tests: call with 69, 70, 71 and with 64, 64.5, 65; print the table. Fix 1: `>=` (one character). Fix 2: stop using `high`; rely on order and `low` (remove one condition). A new test for each fault **before** each fix |
| Fixed state | All 9 lower edges give their own band; 64.5 → "High Average"; the six old tests still pass; two or more new tests; the table still has nine rows |

### Own build — letter grades for a quiz night

Not a GPIS rule; the bands are the learner's to design.

1. `src/lib/quiz-night.mjs` exports `medalFor(points, maxPoints)`: at least four bands, defined as percentages in one table.
2. `maxPoints` must be a whole number above 0; `points` from 0 to `maxPoints`; anything else is refused.
3. Every band edge is tested on both sides; the tests were written first (the commit history shows test commits before code commits).
4. One test proves that changing a number in the table changes the result (the function reads the table).
5. `notes/unit-2-1.md` (`scripts/new-note.sh 2-1`): the rule in words, and one boundary you got wrong at first.

### Review

- **Checklist extras:** every edge is tested on both sides. I saw each test fail before it passed. The nine words are typed once.
- **Compare with GPIS:** (1) Open `src/lib/assessments/remark.ts`. What does GPIS do with a total of 140 or −5? Yours refuses. Which is safer where, and why might a function that is called only with already-checked totals choose to clamp? (2) GPIS has both a table (`REPORT_REMARK_BANDS`) and a chain of `if`s. What is the risk of having both? (3) Search GPIS for the word "Highest" in `src/`. In how many files is the scale written?
- **Mastery:** (1) From an empty file, with the lesson closed: write and test a three-band rule with both refusals in 20 minutes. (2) Say the D-01 table aloud from memory, with its edges. (3) Explain why `>` and `>=` differ by exactly one pupil in a class. (4) Explain why the remark is not stored.

### Check plan (`m2-p1`, version 1.0.0, no `lab:`, `requires [wsl, node, git]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `files` | files | yes | `src/lib/grading.mjs` **or** `.ts` exists (glob `src/lib/grading.*`, type file), `tests/grading.test.*` exists |
| `scale` | tests (files) | yes | `tests/scale.test.mjs`: all 101 whole totals against the D-01 table (one test per band, named with the band, for example "70 to 79 is Higher"); both sides of the eight inner edges; decimals 79.5, 64.99, 39.999, 0.5 |
| `refuses` | tests (files) | yes | `tests/refuses.test.mjs`: −1, −0.01, 100.01, 101, `NaN`, `Infinity` → `RangeError`; `"80"`, `null`, `undefined`, `true`, `[80]` → `TypeError` |
| `bands-exported` | tests (files) | yes | `tests/bands.test.mjs`: `REMARK_BANDS` is an array of 9; first `{low: 80, label: "Highest"}`, last `{low: 0, label: "Lowest"}`; `low` values strictly falling |
| `one-table` | tests (run) | yes | `grep -c '"High Average"\|'"'"'High Average'"'"'' src/lib/grading.*` → `"1\n"` |
| `own-tests` | tests (run) | yes | `grep -cE '^\s*(test\|it)\(' tests/grading.test.*` → a number ≥ 18 (command ends `\| awk '{exit !($1>=18)}'`) |
| `npm-test` | tests (run) | yes | `npm test --silent` → exit 0, `timeout_seconds: 120` |
| `lint` | static | yes | `run: [lint]` |
| `history` | git | yes | `min_commits: 12` (8 from module 1 + 4), `message_min_chars: 15`, `no_secrets: true` |

Messages: `files` "src/lib/grading or tests/grading.test is missing." `scale` "remarkFor
gives the wrong remark for at least one total." `refuses` "remarkFor accepted a value it
must refuse, or refused it with the wrong kind of error." `bands-exported` "REMARK_BANDS is
not the nine bands, highest first." `one-table` "A remark word is typed in more than one
place in grading. remarkFor must read REMARK_BANDS." `own-tests` "tests/grading.test has
fewer than 18 tests." `npm-test` "npm test fails." `lint` "npm run lint reports problems."
`history` "Too few commits, a message that says too little, or a secret."

### Needs

Module 1 (unit 1.6: `package.json`, lint, `verify.sh`). No network.

---

## Unit 2.2 — Arrays, objects and sorting

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m2-u2` / `m2-p2` |
| title | Arrays, objects and sorting |
| module / position | 2 / 2 |
| guidance | guided |
| minutes | 1020 |
| gpis_part | Class positions on the report card: standard competition ranking (D-02, D-03) |
| requires | `[wsl, node, git]` |

### Outcomes

After this unit you can:

1. hold a class in an array of objects and read, add and change items without surprises;
2. use `map`, `filter`, `reduce` and a `for…of` loop, and say when each is clearer;
3. sort with a comparator, and keep the caller's array unchanged;
4. implement competition ranking and explain how it differs from dense ranking;
5. add decimal numbers without rounding surprises.

### Lesson (two parts)

| § | Section | Key ideas |
| :--- | :--- | :--- |
| A1 | Arrays | Index from 0, `length`, `push`, `at(-1)`; reading past the end gives `undefined` |
| A2 | Objects | Properties, `{ id, total }`, destructuring, spread to copy |
| A3 | References | Two names, one array. Copy before you change: `[...list]`, `toSorted` |
| A4 | Loops | `for…of`; `map` (same length, new values), `filter` (fewer), `reduce` (one value) |
| A5 | Sorting | `sort((a, b) => b.total - a.total)`; default sort is by text (`[10, 9]` → `[10, 9]`!); stable sort keeps the first of equals first |
| B1 | Ranking | Position = 1 + the number of students with a strictly higher total. Ties share; the next position jumps |
| B2 | Dense ranking, and why not | 1, 1, 2 hides how many are ahead; D-02 names it as wrong |
| B3 | Keeping the order | Rank a sorted copy, write positions back by original index |
| B4 | Decimals | `0.1 + 0.2`; round a total to two places with `Math.round(x * 100) / 100` |
| B5 | Missing values | `null` adds nothing (Q-07); it is not 0 and it does not remove the student |
| B6 | In GPIS | D-03: one class at a time; D-04: only active students are ranked; `ordinal` words ("1st", "22nd") are made in one place |

- **Diagram:** a three-column table of the same six totals: sorted order, competition rank, dense rank, with the gap after a tie marked.
- **Common mistakes**
  1. `list.sort()` on the caller's array → the screen's order changes too → sort a copy.
  2. Default `sort()` on numbers → 100 comes before 9 → always pass a comparator.
  3. Position = index + 1 after sorting → ties get different positions → compare with the previous total.
  4. Treating `null` as 0 in a comparison → a pupil who missed a subject "scored nothing" → skip it in the sum.
  5. Ranking two classes in one call → positions mean nothing → one class per call.

### Guided example — "Fastest runners" (dense ranking, on purpose)

Sports day: times in seconds, lowest first, **dense** ranking (the opposite of the lab on two
counts, so nothing is given away). Folder `~/academy-labs/scratch/u2-2/`.

1. An array of `{ name, seconds }`; print the names with `map`.
2. `filter` out runners with `seconds === null` (did not run) — note: here they are left out; in the lab they are not.
3. Sort a copy ascending; show the original is unchanged with `assert.deepEqual`.
4. Show the default-sort trap with `[10, 9, 100].sort()`.
5. Write `denseRanks(times)` test-first: 12.1, 12.1, 13.0 → 1, 1, 2.
6. Return ranks in the input order, using the original index.
7. `reduce` to find the average; round to two places.
8. Commit.

What you just used: array methods, comparator, copy before sort, index mapping, rounding.

### Quiz plan (`m2-u2-quiz`, 8 questions, pass mark 6)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | GPIS D-02: totals 75, 70, 70, 65 | 1, 2, 2, 4 | 1, 2, 2, 3 (dense ranking); 1, 2, 3, 4 (ignores the tie); 1, 3, 3, 4 (gives the tie the lower place) |
| 2 | GPIS D-02: totals 88, 88, 88, 60 → position of 60 | 4th | 2nd (dense); 3rd (counts the tie as two); 1st |
| 3 | Predict: `[10, 9, 100].sort()` | `[10, 100, 9]` | `[9, 10, 100]` (expects number order); `[100, 10, 9]`; error |
| 4 | Predict: `const a = [3, 1]; const b = a; b.sort(); a[0]` | 1 | 3 (thinks `b` is a copy); `undefined`; error because `a` is `const` (`const` stops re-assignment, not change) |
| 5 | GPIS Q-07: subjects `[80, null, 70]`. Total used for ranking? | 150 | 75 (an average: not the rule); 0 (blank poisons the total); "the student is not ranked" (Q-07 says the student still gets a position) |
| 6 | Which tool turns a list of students into a list of their totals? | `map` | `filter` (keeps or drops, does not change); `reduce` (gives one value); `sort` |
| 7 | Find the mistake: `positions = sorted.map((s, i) => i + 1)` | Tied students get different positions | "`map` cannot give numbers"; "`i` starts at 1"; "Nothing is wrong" |
| 8 | GPIS D-04: a withdrawn pupil has the highest total in the class list data. Position of the best active pupil? | 1st: withdrawn pupils are not ranked | 2nd (ranks the withdrawn pupil); "no position until the withdrawn pupil is deleted"; "shared 1st" |

### Lab — project 2.2 Class ranking (repo project)

**What done means** — `src/lib/ranking.mjs` exports four functions:

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `competitionRanks(totals)` takes an array of numbers and returns their positions **in the same order**. 90, 90, 80 → 1, 1, 3. `[]` → `[]`. One total → `[1]` | `ranks` |
| 2 | It does not change the array it was given | `ranks` |
| 3 | `subjectsTotal(subjects)` adds an array of numbers and `null`s; `null` adds nothing; the result is rounded to two decimals; all `null` or `[]` → 0 | `totals` |
| 4 | `ordinal(n)` gives `"1st"`, `"2nd"`, `"3rd"`, `"4th"`, `"11th"`, `"12th"`, `"13th"`, `"21st"`, `"22nd"`, `"101st"`, `"111th"`; refuses anything but a whole number ≥ 1 | `ordinal` |
| 5 | `rankClass(students)` takes `[{ id, status, subjects }]` and returns `[{ id, total, position, ordinal }]` for the students whose `status` is `"active"`, in the input order | `rank-class` |
| 6 | A student with a missing subject is ranked on the total of the others (Q-07) | `rank-class` |
| 7 | Students who are not active are left out and do not move anyone's position (D-04) | `rank-class` |
| 8 | `tests/ranking.test.mjs`: at least 15 tests of your own, including one named for D-04; `npm test`, lint pass | `own-tests`, `npm-test`, `lint` |

**Steps (guided):** (1) tests for `competitionRanks` from the two D-02 examples; (2) the
function: positions by counting strictly higher totals (simple first); (3) tests: empty, one,
all equal, already sorted, reverse sorted; (4) prove no change to the input; (5)
`subjectsTotal`, tests first, with `0.1 + 0.2` and `null`; (6) `ordinal`: the 11–13 trap;
(7) `rankClass` joins them; (8) the D-04 test; (9) commit per function.

**Hints:** (a) "How many totals are strictly higher than mine?" plus one is my position.
(b) Look at the last two digits before the last digit for `ordinal`. (c) `filter` first, then
rank what remains.

**Finished state:** `src/lib/ranking.mjs`, `tests/ranking.test.mjs`.

### Debugging lab — "Third out of two"

| Item | Design |
| :--- | :--- |
| Seeded | `positions.mjs` with `rankClass`, and 5 passing tests (no ties, no decimals in them) |
| Symptom | "Two pupils tied for first. The card of one says 1st, the other 2nd." Then: "After I opened the ranking, the class list on screen was in a different order." |
| Fault 1 | Position is `index + 1` after sorting |
| Fault 2 | It sorts the array it was given (`students.sort(...)`), so the caller's list is reordered |
| Evidence | Observe: input and output for 90, 90, 80. Causes: comparator wrong; position from index; totals differ by a tiny decimal. Tests: print the totals; rank 90, 90; `Object.is`. Fix 1: compare with the previous total (or count higher). Fault 2: a test that keeps a copy of the input and compares after the call. Fix 2: sort a copy |
| Fixed state | 90, 90, 80 → 1, 1, 3; the input array is in its original order after the call; two new tests written before the fixes; five old tests pass |

### Own build — a league table

1. `src/lib/league.mjs` exports `leagueTable(results)`: `results` is a list of `{ home, away, homeGoals, awayGoals }`; output one row per team: played, won, drawn, lost, goals for, goals against, points (3 / 1 / 0), position.
2. Order: points, then goal difference, then goals for, all descending; teams equal on all three **share** a position (competition ranking) and are listed A to Z.
3. The input is not changed. A team may not play itself (refused). Goals are whole numbers ≥ 0.
4. Tests first; at least one test with a three-way tie.
5. `notes/unit-2-2.md`: which of your `ranking.mjs` functions you reused, and what you had to change.

### Review

- **Checklist extras:** my functions do not change their arguments. I tested empty, one and all-equal. I can rank six totals by hand both ways.
- **Compare with GPIS:** (1) Open `src/lib/assessments/rank.ts`. GPIS sorts once and walks the list; the lab's first version counts higher totals for each student. Which is faster for a class of 40? For 4,000? (Module 8 returns to this.) (2) In `report-card.ts`, find `rankingRoster`. Which D-number does that one line carry out? (3) GPIS ranks on a total rounded to two decimals. What could go wrong if it ranked on unrounded sums?
- **Mastery:** (1) By hand: positions for 64, 91, 64, 77, 91, 91. (2) From an empty file, write `competitionRanks` with its tests in 20 minutes. (3) Explain to a parent why two pupils are "2nd" and nobody is "3rd". (4) Show a three-line example where sorting changes someone else's array, and repair it.

### Check plan (`m2-p2`, version 1.0.0, no `lab:`, `requires [wsl, node, git]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `files` | files | yes | glob `src/lib/ranking.*` and `tests/ranking.test.*`, type file |
| `ranks` | tests (files) | yes | `competitionRanks`: both D-02 examples; `[]`; one; all equal (five 70s → five 1s); unsorted input `[64, 91, 64, 77, 91, 91]` → `[5, 1, 5, 4, 1, 1]`; decimals `[70.25, 70.25, 70.2]`; a frozen input array does not throw and is unchanged |
| `totals` | tests (files) | yes | `subjectsTotal`: `[80, null, 70]` → 150; `[0.1, 0.2]` → 0.3; `[]` → 0; `[null, null]` → 0; `[33.335, 33.335]` → 66.67 |
| `ordinal` | tests (files) | yes | The eleven values of requirement 4; 0, −1, 1.5, `"1"` refused |
| `rank-class` | tests (files) | yes | A class of six (two tied, one with a `null` subject, one `withdrawn` with the highest total, one `alumni`): output has four rows in input order with exact `total`, `position`, `ordinal`; with the withdrawn student removed from the input the output is identical |
| `own-tests` | tests (run) | yes | At least 15 tests in `tests/ranking.test.*`, and `grep -c 'D-04' tests/ranking.test.*` ≥ 1 |
| `npm-test` | tests (run) | yes | `npm test --silent` → exit 0 |
| `lint` | static | yes | `run: [lint]` |

Messages: `ranks` "competitionRanks gave a wrong position, or changed the array it was
given." `totals` "subjectsTotal gave a wrong total. Check blanks and decimals." `ordinal`
"ordinal gave a wrong word, or accepted a value it must refuse." `rank-class` "rankClass
gave a wrong row. Check ties, a missing subject, and students who are not active."
`own-tests` "tests/ranking.test needs at least 15 tests, one of them named for D-04."
`npm-test` "npm test fails." `lint` "npm run lint reports problems."

### Needs

Unit 2.1. No network.

---

## Unit 2.3 — TypeScript and input you cannot trust

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m2-u3` / `m2-p3` |
| title | TypeScript and input you cannot trust |
| module / position | 2 / 3 |
| guidance | guided |
| minutes | 1140 |
| gpis_part | Score entry rules: marks against stored maxima; zero, blank and ABS are different (D-162, D-10) |
| requires | `[wsl, node, git]` |

### Outcomes

After this unit you can:

1. add types to functions and read a TypeScript error message;
2. model "a number, or `ABS`, or nothing" with a union type and narrow it safely;
3. turn text typed by a person into a checked value, or a clear error, without throwing;
4. calculate a score total from its parts and say exactly when no total exists;
5. run `tsc --noEmit` with `strict` and fix what it finds without `any`.

### Lesson (two parts)

| § | Section | Key ideas |
| :--- | :--- | :--- |
| A1 | Why types | A test checks the cases you thought of; a type checks every call. Types are removed before the code runs |
| A2 | Setting up | `npm i -D typescript`, `tsconfig.json` (the module rules above), `"typecheck": "tsc --noEmit"`, Node runs `.ts` directly |
| A3 | Basic types | `number`, `string`, `boolean`, arrays, object types, `type` aliases, optional `?` |
| A4 | Unions and literals | `number \| "ABS" \| null`; narrowing with `typeof` and `===` |
| A5 | `unknown` at the edge | Input from a form is `unknown`; check, then narrow. Never `any` |
| B1 | Results, not exceptions | `{ ok: true, value } \| { ok: false, error }`: a discriminated union; the caller must look at `ok` |
| B2 | Parsing a mark | Trim; blank → `null`; `ABS` any case; a strict pattern for digits (`"1e2"`, `"0x10"`, `" -1"`, `"12."` refused); range 0 to max; at most two decimals |
| B3 | Zero, blank, ABS | Three facts: "scored nothing", "not entered", "was absent". None may turn into another (D-162, D-10) |
| B4 | The total | CA raw / 60 × 50 + exam / examMax × 50, to two decimals; `null` unless every part is a number |
| B5 | Maxima are data | The maximum arrives as an argument (it is stored on the record, D-27); a 140 exam (D-171) is the same function with another number |
| B6 | In GPIS | `raw-marks.ts`: the same rules are checked again by the Server Action and by database CHECK constraints: three layers |

- **Diagram:** a flow: text from the box → `parseMark` → `number` / `"ABS"` / `null` / error → `calculateTotal` → total or `null`.
- **Common mistakes**
  1. `Number("")` is 0 → a blank becomes a zero → test for blank **before** converting.
  2. `value \|\| null` → a real 0 becomes `null` → compare with `=== null`.
  3. `parseFloat("12abc")` is 12 → rubbish is accepted → match the whole text against a pattern.
  4. `as number` to silence an error → the wrong value runs anyway → narrow with a check.
  5. Treating `ABS` as 0 in the total → an absent pupil gets a low grade → no total.

### Guided example — "Parsing a height" (a different field, same technique)

Folder `~/academy-labs/scratch/u2-3/`. A form asks for a pupil's height in centimetres:
50–250, at most one decimal, blank allowed, `N/A` allowed.

1. `npm i -D typescript`; `tsconfig.json`; `npx tsc --noEmit` on an empty `src/`.
2. Types first: `type Height = number | "N/A" | null`, `type Result<T> = …`.
3. `parseHeight(input: unknown): Result<Height>`; test-first for blank, `"  "`, `null`.
4. `"n/a"`, `"N/A "`.
5. The pattern for digits with one optional decimal; tests for `"170"`, `"170.5"`, `"170.55"`, `"1e2"`, `"17O"` (letter O).
6. Range; then show `tsc` refusing `result.value` before `result.ok` is checked.
7. Break it on purpose: put the blank test after `Number(...)`; watch `""` become 0; put it back.
8. `npm run typecheck`, `npm test`, commit.

What you just used: `unknown`, union types, narrowing, a result type, a whole-text pattern, `tsc`.

### Quiz plan (`m2-u3-quiz`, 8 questions, pass mark 6)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Predict: `Number("")` | 0 | `NaN` (that is `Number("abc")`); `null`; error |
| 2 | GPIS D-162: parts 15, 15, 15, 15 and exam blank. Total? | No total (`null`) | 50 (treats blank exam as 0); 100; 60 (shows the raw CA as the final) |
| 3 | GPIS D-162: Individual 12, Class Test 13.5, Group 14, Project 10, Exam 68/100. Final? | 75.25 | 117.5 (adds raw marks); 83.5 (CA not scaled: 49.5 + 34); 75 (rounds to a whole number: not the rule) |
| 4 | GPIS D-171: exam 112 out of 140, JHS 2. Exam scaled? | 40 | 56 (the JHS 3 mock scale, ×70); 112 (not scaled); 80 (thinks 112/140 is a percentage to print) |
| 5 | A pupil was absent for Group Work; the teacher types `ABS`. What does the total show? | Nothing: the result is incomplete, and it records that there is an absence | 0 for that part and a total (invents a zero); the average of the other parts (invented rule); an error that blocks saving (ABS is a valid entry) |
| 6 | Find the mistake: `const mark = input \|\| null` | A typed 0 becomes `null` | "`\|\|` cannot be used with `null`"; "`const` cannot hold `null`"; "Nothing is wrong" |
| 7 | Which type is right for a value that comes from a form? | `unknown` | `any` (switches checking off); `string` (it may be missing or a number); `never` |
| 8 | Predict: `parseFloat("12abc")`, and what a strict mark parser must do with `"12abc"` | 12; refuse it | `NaN`; accept 12 (silently drops what the teacher typed); `"12abc"`; accept as text |

### Lab — project 2.3 Score rules (repo project)

**What done means** — `src/lib/marks.ts`:

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | TypeScript is set up as in the module rules; `npm run typecheck` passes; `grading` and `ranking` are now `.ts` with typed parameters and results; earlier checks `m2-p1` and `m2-p2` still pass | `typescript-setup`, `static`, `old-rules-still-pass` |
| 2 | Types exported: `RawMark = number \| "ABS" \| null`; `MarkResult` (`{ ok: true; value: RawMark } \| { ok: false; error: string }`); `Marks` (`individual`, `classTest`, `group`, `project`, `exam`, each `RawMark`); `Calculated` (`caRaw`, `caScaled`, `examScaled`, `total`: `number \| null`; `complete`, `hasAbsence`: `boolean`) | `static` (self-review for names) |
| 3 | `parseMark(input: unknown, max: number): MarkResult`. `null`, `undefined`, `""`, `"   "` → `null`. `"ABS"`, `"abs"`, `" Abs "` → `"ABS"`. Numbers, or text of digits with at most two decimals, from 0 to `max` → the number. `0` and `"0"` → 0 | `parse-accepts` |
| 4 | Refused (with `ok: false` and an error sentence that names the maximum when the mark is too high): above `max`, negative, three decimals, `"1e2"`, `"0x10"`, `"12."`, `".5"`, `"12abc"`, `NaN`, `Infinity`, `true`, `[]`, `{}` | `parse-refuses` |
| 5 | `parseMark` never throws | `parse-refuses` |
| 6 | `calculateTotal(marks: Marks, examMax = 100): Calculated`. Maxima: 15 for each of the four parts, `examMax` for the exam. CA scaled = CA raw / 60 × 50; exam scaled = exam / `examMax` × 50; every number rounded to two decimals; total = CA scaled + exam scaled | `total` |
| 7 | `total` is `null` unless all five parts are numbers. `complete` is true when no part is `null`. `hasAbsence` is true when any part is `"ABS"`. A blank or `ABS` is never counted as 0 | `total-incomplete` |
| 8 | `calculateTotal` throws `RangeError` if a number is outside its maximum (it trusts `parseMark`, but checks) | `total` |
| 9 | Your own tests (`tests/marks.test.ts`), at least 25; no `any` in `src/` | `npm-test`, `no-any` |

**Steps (guided):** (1) install TypeScript, write `tsconfig.json`, add `typecheck` to
`package.json` and to `verify.sh`; (2) rename `grading.mjs` → `.ts`, add types, fix imports
in tests, run both old checkers; same for `ranking`; (3) types of requirement 2;
(4) `parseMark`: blank first, then `ABS`, then the pattern, then the range, each test-first;
(5) the refusal list; (6) `calculateTotal`: the all-numbers case with the worked example
(12, 13.5, 14, 10, 68 → 49.5, 41.25, 34, 75.25); (7) blank, then `ABS`; (8) `examMax` 140;
(9) search for `any`; commit per step.

**Hints:** (a) A pattern that must match the **whole** text starts with `^` and ends with `$`.
(b) Decide "is every part a number?" once, with `every`. (c) `tsc` errors name a file and a
line; read the first one only, fix, run again.

**Finished state:** `tsconfig.json`; `src/lib/{grading,ranking,marks}.ts`; tests in `.ts` or
`.mjs`; `package.json` scripts `lint`, `test`, `typecheck`, `verify`.

### Debugging lab — "The pupil who got zero"

| Item | Design |
| :--- | :--- |
| Seeded | `entry.ts` (`readMark(text, max)` and `sheetTotal(row)`), `entry.test.ts` with 7 passing tests |
| Symptom | "A teacher left Project Work empty for one pupil. The sheet shows a total, and it is low." Then: "A teacher typed 0 for a pupil who handed in nothing. The sheet says the mark is missing." |
| Fault 1 | `readMark` does `Number(text.trim())` before testing for blank, so `""` → 0 |
| Fault 2 | `sheetTotal` tests parts with `if (!mark)`, so a real 0 is treated as missing |
| Evidence | Observe: both rows, input and output. Causes: wrong maximum; blank read as 0; total ignores missing parts. Tests: `readMark("", 15)`; `readMark("0", 15)`; `sheetTotal` with one `null`. Fix 1: move the blank test up (2 lines). Fix 2: `mark === null` |
| Fixed state | `readMark("", 15)` → `null`; `readMark("0", 15)` → 0; a row with one blank has no total; a row with a 0 has a total; two new tests; D-10 is quoted in `diagnosis.md` |

### Own build — the JHS 3 mock scheme

GPIS D-27 / D-80: CA out of 30, whole number; Exam raw out of 100 (or 140 for Integrated
Science, D-171) scaled to 70 **as a whole number, halves up**; Final out of 100.

1. `src/lib/mock-marks.ts` exports `calculateMockTotal(marks: { ca: RawMark; exam: RawMark }, examMax = 100)`.
2. `parseMark` is reused; a CA with decimals is refused by a new `parseWholeMark`.
3. Exam 80/100 → 56. Exam 112/140 → 56. Exam 113/140 → 57 (56.5 goes up).
4. Blank and `ABS` behave as in the lab.
5. No rule is copied between the two files: what they share is imported.
6. `notes/unit-2-3.md`: a table of five inputs with their results under the normal and the mock scheme.

### Review

- **Checklist extras:** blank is tested before converting. A typed 0 survives. `ABS` never becomes a number. No `any`, no `as`.
- **Compare with GPIS:** (1) Read `parseRawMark` in `raw-marks.ts`. It returns a `short` message as well as `error`. Where on a phone screen would each be shown? (2) GPIS checks marks in the browser, in the Server Action and in the database. Name one way each of the first two can be skipped. (3) `calculateRawAssessment` has a comment about rounding "from unrounded components". Find a set of marks where rounding each part first would change the total.
- **Mastery:** (1) With the lesson closed, write the type for "a number, ABS or blank" and a function that says which one it got. (2) Work out by hand: 9, 10.5, 15, 12 and exam 47/100. (3) Explain to a teacher why an empty box and a 0 print differently. (4) Read aloud and explain a `tsc` error you cause on purpose.

### Check plan (`m2-p3`, version 1.0.0, no `lab:`, `requires [wsl, node, git]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `typescript-setup` | files | yes | `tsconfig.json`, `src/lib/marks.ts`, `src/lib/grading.ts`, `src/lib/ranking.ts` are files; `src/lib/grading.mjs` and `src/lib/ranking.mjs` are `absent`; glob `tests/marks.test.*` |
| `parse-accepts` | tests (files) | yes | Requirement 3, for `max` 15 and 100; also `"15"`, `"15.00"`, `"7.5"`, `7.25`, `" 12 "` |
| `parse-refuses` | tests (files) | yes | Requirement 4 list; `"15.01"` for max 15 has an error containing `15`; no call throws |
| `total` | tests (files) | yes | Worked example → `{caRaw: 49.5, caScaled: 41.25, examScaled: 34, total: 75.25, complete: true, hasAbsence: false}`; all zeros → total 0; all maxima → 100; 112/140 → examScaled 40; `7.33, 7.33, 7.33, 7.33, 33.33` → exact two-decimal values (computed by the builder from GPIS's `calculateRawAssessment` and written as literals); a part of 16 → `RangeError` |
| `total-incomplete` | tests (files) | yes | One blank → `total: null`, `complete: false`; exam blank → `caScaled` still a number; one `ABS` → `total: null`, `complete: true`, `hasAbsence: true`; all blank → every number `null` |
| `old-rules-still-pass` | tests (files) | yes | A copy of two tests each from `m2-p1` and `m2-p2` (same helper: `.ts` first) |
| `no-any` | tests (run) | yes | `grep -rnE '(:\s*any\b\|\bas any\b\|<any>)' src ; true` → `expect_stdout: ""` |
| `npm-test` | tests (run) | yes | `npm test --silent` → exit 0 |
| `static` | static | yes | `run: [lint, tsc]` |

Messages: `typescript-setup` "TypeScript is not set up as required, or grading and ranking
are not converted to .ts yet." `parse-accepts` "parseMark refused or changed a value it must
accept. Check blank, ABS and zero." `parse-refuses` "parseMark accepted a value it must
refuse, threw an error, or its message does not name the maximum." `total` "calculateTotal
gave a wrong number for a complete set of marks." `total-incomplete` "calculateTotal gave a
total, or wrong flags, when a part was blank or ABS." `old-rules-still-pass` "After the move
to TypeScript, grading or ranking no longer behaves as before." `no-any` "The type any is
used in src/." `npm-test` "npm test fails." `static` "Lint or the type check reports
problems."

### Needs

Units 2.1–2.2. **Network: yes** (`npm install typescript`).

---

## Unit 2.4 — Dates, time zones and text

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m2-u4` / `m2-p4` |
| title | Dates, time zones and text |
| module / position | 2 / 4 |
| guidance | guided |
| minutes | 1080 |
| gpis_part | "Today at the school", term dates, and finding a student by name in any word order (D-247) |
| requires | `[wsl, node, git]` |

### Outcomes

After this unit you can:

1. explain the difference between a moment (`Date`) and a calendar date (`"2026-12-14"`);
2. get "today at the school" correctly on a server in any time zone;
3. check that a text is a real calendar date, and do day arithmetic that never slips at midnight;
4. find which term a date falls in, including the first and last day;
5. clean and split text, and match names in any word order without caring about case or full stops.

### Lesson (two parts)

| § | Section | Key ideas |
| :--- | :--- | :--- |
| A1 | Two different things | A moment in time (the same everywhere) and a date on a calendar (depends on where you are). A birthday is a calendar date |
| A2 | `Date` | It holds a moment. `new Date()`, `toISOString()` (always UTC), `getDate()` (uses the machine's zone: the trap) |
| A3 | The school's zone | `Africa/Accra`; `toLocaleDateString("en-CA", { timeZone })` gives `YYYY-MM-DD`. Name the zone even though Accra is UTC+0: the server may not be |
| A4 | Dates as text | `YYYY-MM-DD` sorts correctly as text; compare with `<` and `<=` |
| A5 | Real dates | 30 February does not exist; build with `Date.UTC` and read back; leap years |
| A6 | Day arithmetic | Whole days in UTC: `addDays`, `daysBetween`. Never add 24 × 60 × 60 × 1000 to a local time |
| B1 | Periods | A term is `startsOn` to `endsOn`, both included. "Which term is this date in?" may be "none" |
| B2 | Text | `trim`, `toLocaleLowerCase`, `split(/\s+/)`, `filter(Boolean)`, `includes`, `replaceAll` |
| B3 | A little pattern language | `/\./g`, `\s+`, `^…$`, `test`, `replace` |
| B4 | Matching names | D-247: every typed word, any order, full stops dropped. "o. adu" finds "Godfred O. Adu" |
| B5 | Clocks in tests | A function that reads the clock cannot be tested; give it `now` as a parameter with a default |

- **Diagram:** one moment (`2026-12-14T23:30:00Z`) shown as three calendar dates: Los Angeles 14 Dec, Accra 14 Dec, Tokyo 15 Dec.
- **Common mistakes**
  1. `new Date().toISOString().slice(0, 10)` for "today" → right in Accra by luck, wrong for any other school → name the zone.
  2. `new Date("2026-02-30")` → silently becomes 2 March → check by reading the parts back.
  3. Comparing `Date` objects with `===` → always false → compare the text or `getTime()`.
  4. Ending a period at midnight → the last day is left out → compare calendar dates with `<=`.
  5. `name.includes(query)` → "adu godfred" does not find "Godfred Adu" → split the query into words.

### Guided example — "Library due dates"

Folder `~/academy-labs/scratch/u2-4/`. Rule (made up): a book is due 14 days after it was
borrowed; the library is in `Asia/Tokyo`.

1. `new Date("2026-12-14T23:30:00Z")`: print `toISOString()` and `toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" })`. Two different dates.
2. `libraryToday(now = new Date())`; test it with three fixed moments.
3. Run the same test with `TZ=America/Los_Angeles node --test`: still green. Then show a version using `getDate()` going red.
4. `isRealDate("2026-02-30")` → false, test-first; `"2028-02-29"` → true.
5. `dueDate("2026-12-25")` → `"2027-01-08"` with UTC arithmetic.
6. `isOverdue(due, today)` with text comparison.
7. A title search: `matchesTitle("Things Fall Apart", "apart things")` → true: split, lower-case, `every`.
8. Commit.

What you just used: `Date`, `Date.UTC`, `toLocaleDateString` with a zone, text comparison of dates, `split`, `every`, a `now` parameter.

### Quiz plan (`m2-u4-quiz`, 8 questions, pass mark 6)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | A server in Virginia (UTC−5) runs at 01:00 UTC on 15 December. A function uses `new Date().getDate()`. What day does it report? | 14 | 15 (that is the UTC date, and the school's); 16; it depends on the browser (this runs on the server) |
| 2 | Predict: `new Date("2026-02-30").toISOString().slice(0, 10)` | `"2026-03-02"` | `"2026-02-30"` (thinks it is kept); error (JavaScript does not refuse); `"2026-02-28"` (thinks it is clamped) |
| 3 | A term runs 2026-09-14 to 2026-12-18. Is 2026-12-18 in it? | Yes: both ends are included | No, the end is not included (cuts the last school day); only until noon (calendar dates have no hours); only if it is a weekday (not part of the rule) |
| 4 | Why can `"2026-09-14" < "2026-12-18"` be trusted? | In `YYYY-MM-DD`, text order is date order | "JavaScript turns them into dates" (it compares text); "It cannot be trusted"; "Because both are 10 characters long" (length alone is not enough) |
| 5 | GPIS D-247: the query `asante g.` against "Godfred Kofi Asante" | Match | No match: wrong order (order does not matter); no match: the full stop (ignored); no match: "g" is not a whole word (a typed word only has to appear in the name) |
| 6 | GPIS D-247: the query `ama mensah` against "Ama Serwaa Birikran" | No match: "mensah" is not in the name | Match (one word is enough: no, every word must appear); match on first name only; error |
| 7 | Find the mistake: `function isToday(d) { return d === schoolToday(); }` in a unit test | It reads the real clock, so the test's result depends on the day it runs | "`===` cannot compare text"; "It should use `==`"; "Nothing is wrong" |
| 8 | Predict: `"  Ama   Birikran ".trim().split(" ").length` | 4 | 2 (forgets the three spaces between give empty pieces); 3; 5 |

### Lab — project 2.4 School dates and names (repo project)

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/school-date.ts` exports `SCHOOL_TIME_ZONE = "Africa/Accra"` and `schoolToday(now: Date = new Date()): string` (`YYYY-MM-DD`), correct whatever the machine's time zone is | `today`, `any-machine-zone` |
| 2 | `isIsoCalendarDate(text)`: true only for a real date written `YYYY-MM-DD` | `real-dates` |
| 3 | `addDays(iso, days)` and `daysBetween(from, to)` work on whole calendar days; `daysBetween` gives `null` if either text is not a real date | `day-arithmetic` |
| 4 | `termFor(date, terms)`: `terms` is `[{ name, startsOn, endsOn }]`; returns the term whose period includes `date` (both ends included), or `null`; refuses (throws `RangeError`) if `date` is not a real date or if two terms overlap | `term-for` |
| 5 | `src/lib/name-search.ts` exports `nameSearchWords(text): string[]` (lower-case words; full stops removed; no empty words) and `matchesName(fullName, query): boolean` | `name-words`, `name-match` |
| 6 | `matchesName`: every word of the query appears somewhere in the name (D-247); case does not matter; an empty query matches every name | `name-match` |
| 7 | No function reads the clock except through the `now` default | `no-hidden-clock` |
| 8 | Your own tests (20 or more), typecheck and lint pass | `npm-test`, `static` |

Sample terms for tests and lesson (labelled **sample**, not GPIS's real calendar):
Term 1 2026-09-14 to 2026-12-18; Term 2 2027-01-11 to 2027-04-01; Term 3 2027-04-26 to 2027-07-29.

**Steps (guided):** (1) `schoolToday` with three fixed moments; (2) run your tests under two
other `TZ` values; (3) `isIsoCalendarDate`; (4) `addDays`, `daysBetween`, across a month end,
a year end and 29 February 2028; (5) `termFor`: inside, first day, last day, the holiday
between terms, overlap refused; (6) `nameSearchWords`; (7) `matchesName`; (8) search your
files for `new Date()` and `Date.now()`.

**Hints:** (a) `en-CA` formats a date as `YYYY-MM-DD`. (b) Build a date with `Date.UTC`, then
read year, month and day back and compare with what you were given. (c) `every` on the query
words.

**Finished state:** the two source files and their tests.

### Debugging lab — "The term ended a day early"

| Item | Design |
| :--- | :--- |
| Seeded | `calendar.ts` (`currentTerm(now, terms)` and `findPupils(list, query)`), tests that pass when run in UTC |
| Symptom | "On the last day of term the dashboard says 'No current term'." (It happens only when the tests are run with `TZ=America/New_York`, and on the last day in any zone.) Then: "Searching 'kyei esi' finds nobody, but 'esi kyei' finds Esi Kyei." |
| Fault 1 | `currentTerm` builds `new Date(term.endsOn)` (midnight UTC at the **start** of the last day) and tests `now <= end`, so the last day is outside from 00:00:01; and it uses local `getDate()` for today |
| Fault 2 | `findPupils` uses `name.toLowerCase().includes(query.toLowerCase())` |
| Evidence | Observe: the date, the zone, the output. Causes: term data wrong; end not included; machine time zone. Tests: call with 2026-12-18T10:00Z; run with `TZ=…`; print `end.toISOString()`. Fix 1: compare `YYYY-MM-DD` texts from a zone-named "today" (replace 3 lines). Fix 2: words and `every` |
| Fixed state | Last day of term → Term 1 in every `TZ`; "kyei esi" finds Esi Kyei; new tests for both; the old tests pass under `TZ=America/New_York` and `TZ=Asia/Tokyo` |

### Own build — age on a date

1. `src/lib/age.ts` exports `ageOn(dateOfBirth, onDate)`: completed years, both as `YYYY-MM-DD`.
2. Born 29 February: the birthday in a year without one counts on 1 March.
3. `onDate` before `dateOfBirth`, or an unreal date, is refused.
4. `ageToday(dateOfBirth, now = new Date())` uses `schoolToday`.
5. `src/lib/initials.ts` exports `initials("Godfred Kofi Asante")` → `"GKA"`; extra spaces and full stops do not matter; an empty name is refused.
6. Tests first; `notes/unit-2-4.md` lists the three dates you found hardest and why.

### Review

- **Checklist extras:** my tests pass under two other `TZ` values. Both ends of a period are tested. No hidden clock. Blank queries are tested.
- **Compare with GPIS:** (1) Read the comment at the top of `src/lib/school-date.ts`. Ghana is UTC+0 all year, so why does GPIS still name the zone? (2) `matchesStudentSearch` in `name-class-search.ts` also searches the student's code and understands "name, class". What does the comma do? (3) GPIS stores a date of birth as a date, not a moment. What would go wrong for a pupil born at 00:30 if it were a moment?
- **Mastery:** (1) From an empty file: "today in `Pacific/Auckland`" with a test that passes on any machine. (2) By hand: `daysBetween("2027-12-25", "2028-03-01")`. (3) Write `matchesName` again from memory, with four tests. (4) Explain "moment" and "calendar date" to someone using a birthday as the example.

### Check plan (`m2-p4`, version 1.0.0, no `lab:`, `requires [wsl, node, git]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `today` | tests (files) | yes | `schoolToday(new Date("2026-12-14T23:59:59Z"))` → `"2026-12-14"`; `…T00:00:00Z` on the 15th → `"2026-12-15"`; a `Date` made from `"2026-12-14T23:30:00-05:00"` → `"2026-12-15"`; `SCHOOL_TIME_ZONE` value |
| `any-machine-zone` | tests (files) | yes | The test starts child Node processes with `TZ=Pacific/Kiritimati` and `TZ=America/Los_Angeles`, each importing the learner's module and printing `schoolToday` for a fixed moment; both print the Accra date |
| `real-dates` | tests (files) | yes | True: `2026-12-14`, `2028-02-29`, `2000-02-29`. False: `2026-02-30`, `2027-02-29`, `1900-02-29`, `2026-13-01`, `2026-4-5`, `14/12/2026`, `""`, `2026-12-14T00:00` |
| `day-arithmetic` | tests (files) | yes | `addDays("2026-12-25", 14)` → `2027-01-08`; `addDays("2028-02-28", 1)` → `2028-02-29`; `addDays(x, -1)`; `daysBetween("2026-09-14", "2026-12-18")` → 95; negative when reversed; `null` for an unreal date |
| `term-for` | tests (files) | yes | With the sample terms: first day, last day, a middle day of each term; `2026-12-19` and `2027-04-10` → `null`; overlapping terms and an unreal date → `RangeError`; the `terms` array is not changed |
| `name-words` | tests (files) | yes | `"Adu O. Godfred"` → `["adu", "o", "godfred"]`; `"  "` → `[]`; `"A.B. Mensah"` → `["a", "b", "mensah"]` |
| `name-match` | tests (files) | yes | Any order; case; full stops; a missing word fails; a word may match inside a longer word (`"god"` matches Godfred, as in GPIS); empty query → true |
| `no-hidden-clock` | tests (run) | yes | `grep -rnE 'Date\.now\(\)\|new Date\(\)' src/lib \| grep -v 'now: Date = new Date()' ; true` → `expect_stdout: ""` |
| `npm-test` | tests (run) | yes | `npm test --silent` → exit 0 |
| `static` | static | yes | `run: [lint, tsc]` |

Messages: `today` "schoolToday gave the wrong date for a fixed moment." `any-machine-zone`
"schoolToday changes when the computer's time zone changes." `real-dates` "isIsoCalendarDate
accepted a date that does not exist, or refused a real one." `day-arithmetic` "addDays or
daysBetween gave a wrong answer. Check month ends and leap years." `term-for` "termFor gave
the wrong term. Check the first day, the last day and the days between terms." `name-words`
"nameSearchWords gave the wrong words." `name-match` "matchesName gave a wrong answer. Check
word order, case, full stops and an empty query." `no-hidden-clock` "A function reads the
clock directly. Only a now parameter with a default may do that." `npm-test` "npm test
fails." `static` "Lint or the type check reports problems."

### Needs

Units 2.1–2.3. No network.

---

## Unit 2.5 — Reading and repairing code

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m2-u5` / `m2-p5` |
| title | Reading and repairing code |
| module / position | 2 / 5 |
| guidance | guided |
| minutes | 960 |
| gpis_part | Admission helpers: admission numbers (D-48), name splitting (D-46), House assignment (D-70) |
| requires | `[wsl, node, git]` |

### Outcomes

After this unit you can:

1. read a module you did not write and say what each function promises;
2. turn a bug report into a failing test before touching the code;
3. find the cause with small experiments, not by guessing;
4. make the smallest fix and show, with the diff, that it is small;
5. leave working code alone.

### Lesson

| § | Section | Key ideas |
| :--- | :--- | :--- |
| 1 | Reading order | Tests first (what is promised), then exports, then one function at a time; write one sentence per function |
| 2 | From report to test | "For input X I expected Y and got Z." A test with exactly that. It must fail for the right reason |
| 3 | Finding the cause | Shrink the input; print one value; halve the code path; `node --inspect` or `console.log` and remove it after |
| 4 | The smallest fix | Change the line that is wrong. Do not rename, reformat or "improve" the lines round it |
| 5 | Proving it | The new test passes; every old test passes; `git diff --stat` is small |
| 6 | Commit shape | `Test: …` (failing test), then `Fix: …` (the change). One bug, two commits |
| 7 | In GPIS | "Never change working code merely to make an error message disappear." "Stay inside the task." OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON |

- **Diagram:** none.
- **Common mistakes**
  1. Fixing before reproducing → you cannot know the fix worked → failing test first.
  2. A test that fails for another reason (a typo, a wrong import) → it proves nothing → read the failure message.
  3. Rewriting the function "more cleanly" → new bugs, a diff nobody can review → smallest change.
  4. Fixing the test to match the code → the bug becomes the rule → the rule comes from the decision, not from the code.
  5. Three fixes in one commit → nobody can tell which change did what → one bug, two commits.

### Guided example — "Lunch money"

Folder `~/academy-labs/scratch/u2-5/`. `example.md` gives a 30-line module `lunch.ts`
(`changeDue(paid, price)` in pesewas and `formatGhs(pesewas)`) with one bug: `formatGhs(5)`
prints `GHS 0.5` (missing zero padding).

1. Read the three tests; write one sentence per function.
2. The report: "5 pesewas shows as GHS 0.5". Write the failing test; run; read the message.
3. Shrink: call `formatGhs` with 5, 50, 105. Which fail?
4. Print the two halves (cedis, pesewas) to see which is wrong.
5. Fix one expression (`padStart(2, "0")`). Run all tests.
6. `git diff --stat`: 1 file, 1 line. Commit `Test: …` and `Fix: …` separately (use `git add -p`).
7. Note what you were tempted to tidy, and leave it.

What you just used: reading tests as a contract, a reproducing test, shrinking, `git add -p`, `git diff --stat`.

### Quiz plan (`m2-u5-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | First action on a bug report | Reproduce it with a failing test | Read all the code (slow, and you do not know what to look for); try a likely fix (you cannot tell if it worked); ask for it to be rewritten |
| 2 | Your new test fails with "Cannot find module". What does that prove about the bug? | Nothing: the test fails for another reason | "The bug is confirmed"; "The module is the bug"; "The test is finished" |
| 3 | GPIS D-70: House 1 has 12 pupils, House 2 has 9, House 3 has 9, House 4 has 11. The new pupil joins | House 2 | House 3 (takes the last of the tie); House 1 (takes the first name, ignoring counts); House 4 |
| 4 | GPIS D-48: admissions in 2027 so far: `ADM/GPIS/2027/001` and `/002`; 150 exist for 2026. Next for 2027? | `ADM/GPIS/2027/003` | `ADM/GPIS/2027/153` (counts all years); `ADM/GPIS/2027/151`; `ADM/GPIS/2026/151` |
| 5 | GPIS D-46: the full name "Ama Serwaa Birikran" is imported as | first name "Ama", last name "Serwaa Birikran", no middle name | first "Ama", middle "Serwaa", last "Birikran" (D-46 leaves middle empty); first "Ama Serwaa", last "Birikran"; a row error |
| 6 | While fixing a bug you see an ugly but working function next to it. What do you do? | Leave it; note it for later | Tidy it in the same commit (hides the real change); rewrite both; delete it |

### Lab — project 2.5 Repair, do not rewrite (lab project)

- **Start:** `npx academy init m2-p5` → `~/academy-labs/m2-p5/admissions-helper` (a Git
  repository with a tag `start`).
- **Situation:** a small module used by the admissions office. Three reports came in.

**Seed builds** a repository (fixed author and dates, 3 commits, tag `start`):

| Path | Contents |
| :--- | :--- |
| `src/admission-number.ts` | `nextAdmissionNumber(existing: string[], year: number): string` — D-48. **Bug A:** it takes the highest NNN among **all** entries, without filtering by year |
| `src/full-name.ts` | `splitFullName(fullName): { firstName, lastName } \| { error }` — D-46. **Bug B:** it splits on a single space, so `"Ama  Birikran"` (two spaces) gives an empty last-name piece and `"  Ama Birikran"` an empty first name |
| `src/house.ts` | `assignHouse(counts: Record<string, number>): string` — D-70. **Bug C:** it keeps the candidate when `count <= best`, so of several Houses with the fewest pupils the **last** name wins, not the first |
| `tests/*.test.ts` | 9 tests, all passing; none touches the three bugs |
| `package.json` | `"type": "module"`, `"test": "node --test"`; no dependencies (no `npm install` needed) |
| `REPORTS.md` | Three reports in users' words: "The first pupil of 2027 got number 151." "A name pasted from Excel was saved with no surname." "Houses 2 and 3 were equal and the new pupil went to House 3." Each quotes its rule with the D-number |

About 90 lines of source in all, written in an unfamiliar but correct style (a `reduce`, a
regular expression, an object lookup) so that reading takes effort.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | All three reports are fixed | `admission-number`, `full-name`, `house` |
| 2 | Behaviour that was right stays right | `still-right` |
| 3 | For each bug there is a commit whose message starts `Test: ` and a later one that starts `Fix: ` (3 + 3) | `test-commits`, `fix-commits` |
| 4 | The change to `src/` since `start` is at most 12 lines (added + removed) | `small-diff` |
| 5 | No file in `src/` was renamed, added or deleted | `same-files` |
| 6 | `npm test` passes; history has no secret | `npm-test`, `history` |

**Steps (guided):** (1) read `REPORTS.md`, then the tests, then the code; write one sentence
per function in `NOTES.md`; (2) report A: write the failing test, commit `Test: …`; (3) find
the line; fix; all tests; `git diff --stat`; commit `Fix: …`; (4) the same for B; (5) the same
for C; (6) check the total diff against `start`.

**Hints:** (a) For A, ask what `existing` contains for other years. (b) For B, print the
pieces after the split with `JSON.stringify`. (c) For C, try three Houses with equal counts
and see which is returned.

**Finished state:** 9 commits or more (3 seeded + 6); source differs from `start` by ≤ 12
lines; 12 or more tests.

### Debugging lab — "Fixed, and broken again"

| Item | Design |
| :--- | :--- |
| Seeded | A repository `class-codes/`: `canonical.ts` with `canonicalClassKey(name)` (lower-case, remove spaces and punctuation: "J.H.S 3" → `jhs3`), 6 tests, and a history of 5 commits. The **fourth** commit ("Tidy canonical name helper") changed `replace(/[^a-z0-9]/g, "")` to `replace(/[^a-z0-9]/, "")` (dropped the `g` flag) while reformatting 20 lines |
| Symptom | "Importing 'J.H.S 3' used to work. Since last week it says the class is unknown." |
| Fault | One character lost inside a large "tidy" commit; only one fault here. The work is finding **which commit**, with `git log -p`, `git bisect` or by checking out each commit and running one command |
| Evidence | Observe: input, output, expected. Causes: the import list changed; the function changed; the data changed. Tests: `git log --oneline`; run a one-line reproduction at each commit (or `git bisect run`); `git show <sha>`. Cause: the commit and the exact line. Fix: restore the flag; add the missing test |
| Fixed state | `canonicalClassKey("J.H.S 3")` → `"jhs3"`; a new test; the fix commit changes one line; `diagnosis.md` names the commit that broke it and says what in its shape made the bug easy to miss. Rule used: D-45 (class matching ignores case, spacing and punctuation, and is never fuzzy) |

### Own build — a second pair of eyes on your own code

1. Choose one of your own functions from 2.1–2.4. Ask "what input did I never test?" and find one that gives a wrong or surprising answer (there usually is one). If you cannot find one in 45 minutes, say so and choose `ordinal` with numbers above 1,000,000 or `matchesName` with accented letters.
2. Write the failing test; commit `Test: …`.
3. Fix with the smallest change; commit `Fix: …`.
4. `notes/unit-2-5.md`: the report in a user's words, the cause in one sentence, the diff size.
5. Nothing else in the file changes.

### Review

- **Checklist extras:** each of my new tests failed first, for the right reason. My diff is small and I can explain every changed line. I left something ugly alone.
- **Compare with GPIS:** (1) In the read-only copy run `git log --oneline --grep="Fix" | head`. Open one with `git show`. How many lines of source changed, and is there a test in the same commit? (2) GPIS's rules say "Stay inside the task." Describe the commit in the debugging lab that broke that rule and what it cost. (3) Find where GPIS assigns a House (search for "House" under `src/lib/admissions`). How does it break ties?
- **Mastery:** (1) Given a bug report from a classmate about any function, produce a failing test in ten minutes. (2) Explain why a test that fails for the wrong reason is worse than no test. (3) Use `git bisect` on a five-commit repository you make yourself. (4) State D-48, D-46 and D-70 from memory.

### Check plan (`m2-p5`, version 1.0.0, `lab: root ~/academy-labs/m2-p5/admissions-helper`, `requires [wsl, node, git]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `admission-number` | tests (files) | yes | 2027 list with 150 entries for 2026 and two for 2027 → `ADM/GPIS/2027/003`; first of a year → `/001`; unordered input; 099 → `100` |
| `full-name` | tests (files) | yes | `"Ama  Birikran"`, `"  Ama Birikran "`, a tab between words → first "Ama", last "Birikran"; `"Ama Serwaa Birikran"` → last "Serwaa Birikran"; `"Ama"` and `"   "` → an error |
| `house` | tests (files) | yes | `{House 1: 12, House 2: 9, House 3: 9, House 4: 11}` → House 2; all equal → House 1; keys given in another order → still the alphabetically first of the smallest |
| `still-right` | tests (files) | yes | The 9 seeded tests, copied |
| `test-commits` | tests (run) | yes | `git log --format=%s start..HEAD \| grep -c '^Test: '` → a number ≥ 3 |
| `fix-commits` | tests (run) | yes | `git log --format=%s start..HEAD \| grep -c '^Fix: '` → a number ≥ 3 |
| `small-diff` | tests (run) | yes | `git diff --numstat start -- src \| awk '{s+=$1+$2} END {exit !(s>0 && s<=12)}'` → exit 0 |
| `same-files` | tests (run) | yes | `git diff --name-status start -- src \| grep -cv '^M' ; true` → `"0\n"` |
| `npm-test` | tests (run) | yes | `npm test --silent` → exit 0 |
| `history` | git | yes | `min_commits: 9`, `message_min_chars: 15`, `no_secrets: true` |

Messages: `admission-number` "nextAdmissionNumber gives a wrong number. Read report A and
D-48 again." `full-name` "splitFullName gives a wrong result for a name with extra spaces,
or changed for a normal name." `house` "assignHouse chose the wrong House when counts are
equal." `still-right` "Something that worked at the start no longer works." `test-commits`
"There are fewer than three commits whose message starts with Test:." `fix-commits` "There
are fewer than three commits whose message starts with Fix:." `small-diff` "The change to
src/ since the start is more than 12 lines. Repair, do not rewrite." `same-files` "A file in
src/ was added, deleted or renamed." `npm-test` "npm test fails." `history` "Too few
commits, a message that says too little, or a secret."

### Needs

Units 2.1–2.4. No network (the seeded project has no dependencies).

---

## Unit 2.6 — Types that model the school

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m2-u6` / `m2-p6` |
| title | Types that model the school |
| module / position | 2 / 6 |
| guidance | guided |
| minutes | 1080 |
| gpis_part | The temporal model: a student has no class; membership is a dated record; a score points to its membership (D-19 to D-23) |
| requires | `[wsl, node, git]` |

### Outcomes

After this unit you can:

1. describe a real thing (a student, a class, a membership, a score) as a type;
2. make wrong data impossible to write, using literal unions, `readonly` and required fields;
3. explain why a student record has no class field, and find the current class from memberships;
4. write functions over these types without `any` and without `as`;
5. write a type-level test: code that must **not** compile.

### Lesson (two parts)

| § | Section | Key ideas |
| :--- | :--- | :--- |
| A1 | A type is a promise about data | Object types, `readonly`, optional against `\| null` (missing against "known to be empty") |
| A2 | Small exact sets | `type StudentStatus = "active" \| "withdrawn" \| "alumni"`; a typing mistake becomes a compile error |
| A3 | Identifiers | `StudentId`, `ClassId` as branded numbers, so a class id cannot be passed where a student id is wanted |
| A4 | Tagged unions again | `Result<T>`; exhaustive `switch` with `never` |
| A5 | Generic helpers | `Array<T>`, `Record<K, V>`, `Pick`, `Omit`, `Readonly` |
| B1 | The obvious model, and why it is wrong | `student.classId`: one overwritable value. Reprint last term's card → today's class, wrong cohort, and it looks normal |
| B2 | Membership | Student, class, academic year, `startedOn`, `endedOn \| null`, terms covered. Several per student per year, never overlapping (D-19, D-22) |
| B3 | Moves happen at term boundaries | So a term always belongs to exactly one class (D-20) |
| B4 | A score points to its membership | Resolved once when written, never worked out again when read (D-21). It also carries its maxima (D-27) |
| B5 | Two statuses | Student: active, withdrawn, alumni. Membership: open or ended. Withdrawal ends the membership and sets the status. Alumni is a status, not a class (D-23) |
| B6 | "Who is on the roll?" | Open membership for that class and term **and** `status === "active"` (D-04) |

- **Diagram (Mermaid `erDiagram`):** `Student ||--o{ Membership`, `SchoolClass ||--o{ Membership`, `AcademicYear ||--o{ Term`, `Membership ||--o{ Score`. No line from Student to SchoolClass.
- **Common mistakes**
  1. Adding `classId` to `Student` "for convenience" → two sources of truth → derive it.
  2. `status: string` → `"Active"`, `"actve"` are accepted → a literal union.
  3. `endedOn?: string` → "not ended" and "forgot to load it" look the same → `string \| null`, required.
  4. `as Student` on data from outside → the compiler is told a lie → check, then narrow.
  5. Filtering on status only (or membership only) for a class list → a withdrawn pupil with an open membership appears, or an active pupil in another class does → both (D-04).

### Guided example — "A lending library, typed"

Folder `~/academy-labs/scratch/u2-6/`. Books, members and loans; a book has **no** "borrower"
field: who has it now is derived from the open loan (the same idea, another subject).

1. Types `Book`, `Member`, `Loan { bookId, memberId, lentOn, returnedOn: string | null }`.
2. `type MemberStatus = "current" | "left"`; show the compile error for `"curent"`.
3. Branded ids: pass a `BookId` where a `MemberId` is wanted; read the error.
4. `currentBorrower(bookId, loans): MemberId | null` test-first.
5. Two open loans for one book: decide it is an error; return a `Result`.
6. An exhaustive `switch` on `MemberStatus`; add a third status and watch the compiler point at the `switch`.
7. A type-level test file with `// @ts-expect-error` on a `Book` that has `borrowerId`; run `tsc`; remove the bad line and see `tsc` complain that the error it expected is gone.
8. Commit.

What you just used: literal unions, branded ids, `| null`, `Result`, `never`, `@ts-expect-error`.

### Quiz plan (`m2-u6-quiz`, 8 questions, pass mark 6)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | GPIS D-19: where is a student's current class kept? | Nowhere as a field: it is derived from the open membership record | In `students.class_id` (the legacy design, the one GPIS removed); in both, kept in step (two copies drift); in the score rows |
| 2 | GPIS D-21: Ama was in Basic 3A in Term 1 and moved to Basic 3B for Term 2. Her Term 1 report card is reprinted in Term 3. Class and cohort? | Basic 3A, ranked among the Term 1 class | Basic 3B (her class today: the legacy bug); both classes; whichever the admin picks |
| 3 | GPIS D-23: a pupil leaves the school in February. What changes? | The membership gets an end date and the student's status becomes `withdrawn` | Only the status (the membership stays open: lists go wrong); the student row is deleted (history lost); the pupil is moved to a class called "Left" (a status is not a class) |
| 4 | GPIS D-23: where do graduates go? | Nowhere: `alumni` is a student status; memberships and scores stay as they are | A class named "Alumni"; a separate archive table; they are deleted after a year |
| 5 | GPIS D-04: who is on a class list? | Students with an open membership for that class and term, and status `active` | Everyone with status `active` (any class); everyone with an open membership (includes a withdrawn pupil whose membership was not ended); everyone who ever had a membership |
| 6 | Predict: `type S = "active" \| "withdrawn"`; `const s: S = "Active"` | Compile error | Runs and stores "Active"; becomes "active"; a runtime error |
| 7 | Find the mistake: `type Membership = { …; endedOn?: string }` | "Not ended" and "field missing" cannot be told apart; use a required `string \| null` | "`?` is not allowed in types"; "Dates must be `Date`"; "Nothing is wrong" |
| 8 | GPIS D-20: why may a pupil change class only at a term boundary? | So that every term belongs to exactly one class, and a term's scores have one cohort | To reduce paperwork (not the stated reason); because the database is slow; because terms are short |

### Lab — project 2.6 Typed data shapes (repo project)

**What done means** — `src/lib/school-types.ts` and `src/lib/membership.ts`:

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | Exported types: `StudentId`, `ClassId`, `AcademicYearId`, `TermId`, `MembershipId` (branded numbers); `StudentStatus` (`"active" \| "withdrawn" \| "alumni"`); `Student` (`id`, `firstName`, `middleName: string \| null`, `lastName`, `dateOfBirth`, `status`); `SchoolClass` (`id`, `name`); `AcademicYear` (`id`, `name`, `startsOn`, `endsOn`); `Term` (`id`, `academicYearId`, `number: 1 \| 2 \| 3`, `startsOn`, `endsOn`); `Membership` (`id`, `studentId`, `classId`, `academicYearId`, `startedOn`, `endedOn: string \| null`, `termIds: readonly TermId[]`); `Score` (`membershipId`, `termId`, `subject`, `marks: Marks`, `examMax: 100 \| 140`, `status: "draft" \| "submitted"`) | `shapes` |
| 2 | `Student` has **no** class, year or term field; the type checker refuses one | `shapes` |
| 3 | Every property is `readonly` | `shapes` |
| 4 | `openMembership(memberships, studentId): Result<Membership \| null>`: the membership with `endedOn === null`; an error result if there are two | `open-membership` |
| 5 | `membershipForTerm(memberships, studentId, termId): Membership \| null`: the membership whose `termIds` include the term (D-20 says there is at most one; two is refused with an error) | `membership-for-term` |
| 6 | `overlaps(a, b): boolean` for two memberships of one student: periods overlap when each starts on or before the other ends; an open membership has no end | `overlaps` |
| 7 | `classRoll(students, memberships, classId, termId): Student[]`: D-04, both conditions; ordered by last name, then first name | `class-roll` |
| 8 | No `any`, no `as` (except in the one branded-id helper), typecheck and lint pass; your own tests, at least 15 | `no-any-no-as`, `npm-test`, `static` |

`Marks` is imported from `marks.ts` (unit 2.3).

**Steps (guided):** (1) the id brands and one helper `asStudentId(n)`; (2) `StudentStatus`,
`Student`; write a `@ts-expect-error` test that a `classId` on a student is refused;
(3) the other types, one at a time, each with one "must not compile" line in
`tests/school-types.check.ts`; (4) `openMembership`; (5) `membershipForTerm`; (6) `overlaps`,
with the six ways two periods can sit; (7) `classRoll` with a fixture of eight students that
includes: withdrawn with an ended membership, withdrawn with a (wrongly) open one, active in
another class, alumni, moved at a term boundary; (8) search for `any` and `as`.

**Hints:** (a) A brand: `number & { readonly __brand: "StudentId" }`. (b) Draw two periods
on a line before writing `overlaps`. (c) `classRoll` is two `filter`s and a `toSorted`.

**Finished state:** two source files, a tests file, a type-check file; `tsc` passes.

### Debugging lab — "Last term's card shows this term's class"

| Item | Design |
| :--- | :--- |
| Seeded | `card.ts`: `reportHeader(student, memberships, classes, termId)` returns `{ name, className }`; fixture data where Ama moved from Basic 3A (Term 1) to Basic 3B (Term 2); 4 passing tests that only ask for the current term |
| Symptom | "I reprinted Ama's Term 1 card. It says Basic 3B. She was in 3A then." Then, after fix 1: "Kofi left in November. His Term 1 card now has no class at all." |
| Fault 1 | The function finds the class through the **open** membership, ignoring `termId` (a read-time lookup of "today") |
| Fault 2 | After the first fix, the code still filters `student.status === "active"` before looking, so a withdrawn pupil's old term has no header |
| Evidence | Observe: both outputs. Causes: wrong fixture; uses current class; term ids mixed up. Tests: call with Term 1 and Term 2; print the membership chosen. Fix 1: choose the membership by term (D-21). Fix 2: remove the status filter here; quote D-23: status and membership are separate facts, and a past term's card is about the past |
| Fixed state | Term 1 → Basic 3A; Term 2 → Basic 3B; Kofi's Term 1 → his class; two new tests; D-21 quoted in `diagnosis.md` |

### Own build — a year in memberships

1. `src/lib/history.ts` exports `classHistory(memberships, classes, years, studentId)`: one line per membership, oldest first: `{ yearName, className, from, to }` (`to` is `null` when open).
2. `gaps(memberships, studentId)`: periods between memberships (an absence, D-23), each `{ from, to }`.
3. `repeatedYears(memberships, studentId)`: classes the student had in two consecutive academic years (repeating is two memberships; no flag).
4. A fixture student who was withdrawn for one term, returned, and repeated a year; tests first.
5. `notes/unit-2-6.md`: draw this student's timeline in text.

### Review

- **Checklist extras:** `Student` has no class. Every "must not compile" line still fails to compile. `classRoll` uses both conditions and I have a test named for D-04.
- **Compare with GPIS:** (1) Read "The temporal model" in GPIS's `AGENTS.md`. Which of your types carries out each of D-19, D-21 and D-23? (2) GPIS prevents overlapping memberships in the database (D-22), not in code. Your `overlaps` is code. What can a database constraint do that your function cannot? (Module 4 builds it.) (3) Open `docs/LEGACY_TEMPORAL_FINDINGS.md` and read the first finding. Which line of your debugging lab is the same mistake?
- **Mastery:** (1) From memory, write the `Membership` type and say why each field is there. (2) Explain to a head teacher, in four sentences, why reprinting an old card went wrong in the old system. (3) Write `classRoll` again in 15 minutes with three tests. (4) Add a fourth student status in a scratch copy and list every place the compiler sends you.

### Check plan (`m2-p6`, version 1.0.0, no `lab:`, `requires [wsl, node, git]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `files` | files | yes | `src/lib/school-types.ts`, `src/lib/membership.ts`; glob `tests/membership.test.*` |
| `shapes` | tests (files) | yes | A type-level test. It writes nothing into the project: it makes a temporary folder under the system temp directory holding a `tsconfig.json` that `extends` the project's and lists `fixtures/shapes.check.ts` (copied there, importing the learner's types by absolute path), runs the project's own `node_modules/.bin/tsc --noEmit -p` on it, and expects exit 0. The fixture has valid values for every type and about 14 `// @ts-expect-error` lines: a student with `classId`, with `academicYearId`, with `term`; status `"inactive"` and `"Active"`; `endedOn` missing; `endedOn: undefined`; term `number: 4`; `examMax: 120`; score `status: "approved"`; a `ClassId` passed as `StudentId`; assignment to `student.status`; push to `termIds`; a score without `membershipId` |
| `open-membership` | tests (files) | yes | None → ok `null`; one open → it; ended only → `null`; two open → `ok: false` |
| `membership-for-term` | tests (files) | yes | Ama: Term 1 → the 3A membership, Term 2 → 3B, a term of another year → `null`; two memberships naming one term → throws |
| `overlaps` | tests (files) | yes | Before / after (false); touching on the same day (true); inside; equal; open against later (true); open against earlier ended (false); the function is symmetric |
| `class-roll` | tests (files) | yes | The eight-student fixture: exact ids in exact order for (3A, Term 1), (3B, Term 2), (3A, Term 2); the withdrawn student with a wrongly open membership is absent; inputs unchanged |
| `no-any-no-as` | tests (run) | yes | `grep -rnE '(:\s*any\b\|<any>\|\bas (any\|unknown)\b)' src ; true` → `""`; and `grep -rcE '\bas [A-Z]' src/lib/membership.ts` → `"0\n"` (joined with `&&`) |
| `npm-test` | tests (run) | yes | `npm test --silent` → exit 0 |
| `static` | static | yes | `run: [lint, tsc]` |

Messages: `shapes` "The types allow something they must refuse, or refuse valid data. A
student must have no class field; statuses and maxima must be exact sets; properties must be
read-only." `open-membership` "openMembership gave the wrong record, or accepted two open
memberships." `membership-for-term` "membershipForTerm did not return the membership that
covers the term." `overlaps` "overlaps gave a wrong answer. Check periods that touch and
open memberships." `class-roll` "classRoll is wrong. It needs both conditions of D-04 and
the right order." `no-any-no-as` "any or a type assertion is used where it is not allowed."
`npm-test` "npm test fails." `static` "Lint or the type check reports problems."

Fixtures: `shapes.check.ts`, `roll-fixture.mjs` (the eight students as plain data).

### Needs

Units 2.1–2.5 (`Marks` from 2.3). No network.

---

## After module 2 the learner has

`src/lib/`: `grading.ts`, `ranking.ts`, `marks.ts`, `school-date.ts`, `name-search.ts`,
`school-types.ts`, `membership.ts` (plus own builds), all pure, typed and tested. Modules 3–5
import them; module 4 moves the same rules into database constraints; module 8 returns to
`ranking.ts` for speed.
