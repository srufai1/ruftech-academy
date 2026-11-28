# Module 10 — Python track

| Unit | Title | Project | Kind | Level | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P.1 | Python core | py-p1 | Repo | half | 1050 | 5 |
| P.2 | Log report again | py-p2 | Seeded lab | half | 960 | 4 |
| P.3 | API consumer | py-p3 | Seeded lab | half | 1050 | 4 |
| P.4 | FastAPI service [Docker optional] | py-p4 | Repo | independent | 1140 | 6 |
| P.5 | Join the two | py-p5 | Repo | independent | 1050 | 6 |
| P.6 | Was it worth it? | py-p6 | Repo | independent | 990 | 4 |

## Module rules (decided here)

Use slug py and content/module-10/. Repo units keep the service under services/results/ in gpis-rebuild. P.2 and P.3 use disposable seeded labs. Learners activate a local venv before invoking the checker so python resolves consistently. Record versions in services/results/requirements.txt (FastAPI, uvicorn, psycopg, pytest, httpx and mypy). Course Node tests spawn the public Python entry points and assert actual outputs; pytest and mypy are tests/run commands, never step kinds. Use Decimal for marks and explicit decimal serialisation. Keep local API simulations offline. Bind development services to loopback. Only Next.js talks to the reporting service from the server after checking the staff session and class access. Paper and screen rules remain the same across languages.

Use the eight-step sequence, review checklist and reflection in 00-guide.md. Use text diagrams. Debugging and own builds are self-reviewed [Q1]. For each own build commit the variation and put the comparison in `notes/<unit-id>.md`. Read GPIS after a pass, or after a written 30-minute attempt in a half-guided unit.

## File and interface contract

Print the paths and the named inputs, outputs and routes from the check plan in the corresponding lab.

| Unit | Deliverables relative to its working directory |
| :--- | :--- |
| P.1 | services/results/results_core.py; services/results/tests/test_core.py; services/results/requirements.txt |
| P.2 | report.py; answers.md |
| P.3 | export.py; tests/test_export.py |
| P.4 | services/results/app.py; services/results/tests/test_api.py; supabase/migrations/*results_reader*.sql |
| P.5 | src/lib/results-service.ts; services/results/tests/test_integration.py; docs/ops/results-service.md |
| P.6 | services/results/decision.md; services/results/evidence.csv |

## GPIS rules used in this module

| Source in the read-only GPIS | Text to use |
| :--- | :--- |
| D-01, D-02, D-03, D-04, Q-07 | “Ties share a position; the next position skips ahead by the number of tied students.” Creche–JHS 2 grades are calculated on the common scale; rank one eligible class at a time. |
| D-10, D-27, D-162, D-171 | “Missing subject scores print blank”. Use stored maxima; JHS Integrated Science exam is out of 140. Distinguish blank, ABS and numerical zero. |
| D-80, D-81, D-218 | “Both are sums over exactly the same selected set.” JHS 3 mock raw and aggregate count all cores plus the two highest elective finals. Only submitted data reaches a document. |
| D-21, D-218 | “Reprint reproduces the issued snapshot”. Use the period membership and preserve the identity and contents of issued records. |
| GPIS AGENTS.md rules 1, 2, 3 and 8 | “Every table has RLS enabled with explicit policies.” Request claims and server-side authorisation precede private reads. |

---

## Unit P.1 — Python core

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `py-u1` / `py-p1` |
| title | Python core |
| module / position | 10 / 1 |
| guidance | half |
| minutes | 1050 |
| gpis_part | Use explicit mark and result types. Map Python None, the ABS marker and numeric zero distinctly. |
| requires | [wsl, node, git, python] |

### Outcomes

After this unit you can

1. Port a typed boundary
2. Prove cross-language parity
3. Keep decimal boundaries

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Port a typed boundary | Use explicit mark and result types. Map Python None, the ABS marker and numeric zero distinctly. |
| 2. Prove cross-language parity | Use the module 2 reference inputs and module 8 aggregate vectors as data. Compare serialised public outputs. |
| 3. Keep decimal boundaries | Parse numbers from decimal strings and round at the same stage as TypeScript. |

**Text diagram** fixture → typed Python boundary → decimal result → parity comparison

**Common mistakes**

1. 49.5 → raw → 41.25
2. Both missing → truthiness bug → Zero is an assessed mark
3. [1,1,2] → dense rank → [1,1,3]

### Guided example — Price a library fine

In a scratch folder.

1. (full) Parse decimal strings 0.10 and 0.20 and show an exact sum of 0.30.
2. (full) Keep missing price None and a waived charge as separate values.
3. (task) Type-check the return type of the sum function.
4. (task) Compare the printed decimal with an independently calculated fixture.

### Quiz plan (`py-u1-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | D-162 CA 49.5 of 60 scaled to 50? | 41.25 | 49.5 (raw). 82.5 (percentage) |
| 2 | Zero versus None? | Zero is an assessed mark | Both missing (truthiness bug). Both absent (different states) |
| 3 | D-02 [90,90,80]? | [1,1,3] | [1,1,2] (dense rank). [1,2,3] (splits tie) |
| 4 | Final 80 under D-81? | Grade point 1 | 2 (wrong inclusive edge). Highest (D-01 words on wrong slip) |
| 5 | Whole D-81 example? | Raw 426 aggregate 14 | Raw 14 (grade sum). Aggregate 6 (count) |
| 6 | Type checker passes? | Type consistency checked | School rules proved (needs examples). Runtime inputs trusted (needs validation) |

### Lab — Python core

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `services/results/results_core.py`, `services/results/tests/test_core.py`, `services/results/requirements.txt` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Course Node test invokes python from services/results and imports results_core. Contract grade(score) returns module 2.1 remark, competition_ranks(totals) returns positions in original order, calculate_total(marks,exam_max) mirrors module 2.3, aggregate(offerings) mirrors 8.2. Bridge uses JSON on stdin/stdout with decimals as strings for exact comparison. Exercise every D-01 and D-81 edge, [80,90,90]→[3,1,1], 12/13.5/14/10 + exam 68→75.25; missing part→None; ABS distinct; all six mock finals→426/14. | `parity` |
| 4 | Run cd services/results && python -m pytest -q tests/test_core.py; exit 0, pytest’s passed summary present. Include all original module 2 grading/ranking/marks examples plus 8.2 incomplete and tie cases. | `pytest` |
| 5 | Run cd services/results && python -m mypy --strict results_core.py; exit 0, stdout contains Success: no issues found. | `types` |

**Hints (folded).** Look at services/results/results_core.py. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Parse numbers from decimal strings and round at the same stage as TypeScript. Check with `npx academy check py-p1`.

### Debugging lab — The disappearing zero

| Item | Design |
| :--- | :--- |
| Seeded | Scratch calculation uses if mark on inputs 0, None and ABS. |
| Symptom | A zero mark shows as a blank. |
| Fault (builder only) | Truthiness conflates zero with missing. |
| Observe | A zero mark shows as a blank. |
| Possible causes | Bad parser, rounding, presence test. |
| Tests | Inspect parsed values, test before arithmetic, compare explicit None check. |
| Cause | Truthiness conflates zero with missing. |
| Fix | Separate the three states before calculating. |
| Fixed state | Zero contributes numerically, None and ABS keep their own states. |

### Own build

1. Add generated boundary vectors.
2. Compare JSON results with TypeScript.
3. Describe one case where a type check cannot catch a wrong answer.
4. Commit this variation. In `notes/py-u1.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Parse numbers from decimal strings and round at the same stage as TypeScript. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Where are the numeric bands in src/lib/assessments/report-card.ts?
2. Why does D-171 require an exam maximum parameter?

**Mastery, without notes**

1. Port one boundary.
2. Predict one tie.
3. Run strict type checking.
4. Explain a parity failure.

### Check plan (`py-p1`, version 1.0.0, no `lab:`, requires [wsl, node, git, python])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `services/results/results_core.py`, `services/results/tests/test_core.py`, `services/results/requirements.txt` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| parity | tests | yes | `tests/parity.test.mjs` via files. Course Node test invokes python from services/results and imports results_core. Contract grade(score) returns module 2.1 remark, competition_ranks(totals) returns positions in original order, calculate_total(marks,exam_max) mirrors module 2.3, aggregate(offerings) mirrors 8.2. Bridge uses JSON on stdin/stdout with decimals as strings for exact comparison. Exercise every D-01 and D-81 edge, [80,90,90]→[3,1,1], 12/13.5/14/10 + exam 68→75.25; missing part→None; ABS distinct; all six mock finals→426/14. |
| pytest | tests | yes | Run cd services/results && python -m pytest -q tests/test_core.py; exit 0, pytest’s passed summary present. Include all original module 2 grading/ranking/marks examples plus 8.2 incomplete and tie cases. |
| types | tests | yes | Run cd services/results && python -m mypy --strict results_core.py; exit 0, stdout contains Success: no issues found. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `parity` — A Python result differs from the shared GPIS vector.
- `pytest` — The Python core tests did not pass.
- `types` — The public Python types did not pass strict checking.

### Needs

Module 9 and the module 2/8 calculation fixtures. WSL, Git, Node and Python 3.11+ with a project-specific virtual environment. Network for initial dependency installation only.

---

## Unit P.2 — Log report again

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `py-u2` / `py-p2` |
| title | Log report again |
| module / position | 10 / 2 |
| guidance | half |
| minutes | 960 |
| gpis_part | Extract status and path from the module 1.2 access-log format independently of the client address. |
| requires | [wsl, node, python] |

### Outcomes

After this unit you can

1. Parse a quoted request
2. Aggregate and order failures
3. Separate command outcomes

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Parse a quoted request | Extract status and path from the module 1.2 access-log format independently of the client address. |
| 2. Aggregate and order failures | Group by status and path. Sort by count descending then path ascending; same count and path uses status ascending as a course tie-break. |
| 3. Separate command outcomes | No failures is a successful report; missing argument and missing file have distinct exit codes. |

**Text diagram** line → parsed request → (status,path) counts → sorted five

**Common mistakes**

1. Both → threshold too low → Only 400 counts
2. Merge status only → loses path → Separate groups
3. Exit 2 → file exists → Print no failures and exit 0

### Guided example — Count library desk events

In a scratch folder.

1. (full) Read three desk records, two returns and a loan. Group by event to get 2 and 1.
2. (full) Sort the groups and render one line per event.
3. (task) Try a filename containing a space.
4. (task) Feed an empty file and compare it with a missing file.

### Quiz plan (`py-u2-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | HTTP 399 and 400? | Only 400 counts | Both (threshold too low). Neither (400 boundary missed) |
| 2 | Two 404s with distinct paths? | Separate groups | Merge status only (loses path). Group by client (wrong question) |
| 3 | No failure rows? | Print no failures and exit 0 | Exit 2 (file exists). Print nothing (contract requires text) |
| 4 | No argument? | Usage on stderr, exit 1 | Exit 0 (wrong invocation). Print failure list (no input) |
| 5 | Two groups tied? | Compare paths A–Z | Use first seen (input order changes). Sort status first (wrong key) |
| 6 | Five wrong GPIS logins under D-170? | 30-minute account lock; log entries alone do not prove account state | Five-minute lock (wrong rule). Five HTTP errors always prove one lock (identities unknown) |

### Lab — Log report again

**Start.** Run `npx academy init py-p2`. Create logs/ with byte-identical module 1.2 access.log, term 1 access.log, empty.log and no-failures.log. Add malformed.log and debug/report.py with the documented tie fault. No background processes.Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `report.py`, `answers.md` | `deliverables` |
| 2 | Spawn python report.py access.log. Require exact module 1.2 output: 9 401 /login; 6 500 /students/import; 4 403 /api/scores; 4 404 /favicon.ico; 2 500 /reports/print, newline after every row. Filename term 1 access.log yields 3 404 /favicon.ico then 1 401 /login. Compare source bytes before/after. | `golden` |
| 3 | Invoke without args → exit 1, empty stdout, usage on stderr. Missing path → exit 2, empty stdout. Empty and no-failures logs → exact no failures plus newline, exit 0. A malformed line ahead of one valid 404 is skipped with a diagnostic on stderr; the good row remains. | `cli` |
| 4 | answers.md headings Parsing, Ordering, Errors; 20 words per heading describing parser boundaries, stable ordering and error channels. | `explanation` |

**Hints (folded).** Look at report.py. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** No failures is a successful report; missing argument and missing file have distinct exit codes. Check with `npx academy check py-p2`.

### Debugging lab — The wrong fifth line

| Item | Design |
| :--- | :--- |
| Seeded | Seed debug/report.py and five tied failures with different paths, then reverse the file. |
| Symptom | The fifth line changes with file order. |
| Fault (builder only) | Ties retain insertion order. |
| Observe | The fifth line changes with file order. |
| Possible causes | Missing row, grouping key, tie order. |
| Tests | Compare raw counts, group pairs, reverse input. |
| Cause | Ties retain insertion order. |
| Fix | Sort ties by path then status before truncating. |
| Fixed state | Both input orders print the same top five. |

### Own build

1. Add an anonymised daily summary.
2. Keep the original CLI contract intact.
3. Demonstrate a malformed line cannot erase valid results.
4. Commit this variation. In `notes/py-u2.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** No failures is a successful report; missing argument and missing file have distinct exit codes. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does GPIS D-170 separate identity-level lock state from IP traffic limits?
2. What would AGENTS.md rule 7 forbid putting into example logs?

**Mastery, without notes**

1. Reproduce the five lines.
2. Test a space in a filename.
3. Separate stdout and stderr.
4. Compare an empty and missing file.

### Check plan (`py-p2`, version 1.0.0, lab root `logs`, seed `fixtures/seed.sh`, requires [wsl, node, python])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `report.py`, `answers.md` |
| golden | tests | yes | `tests/golden.test.mjs` via files. Spawn python report.py access.log. Require exact module 1.2 output: 9 401 /login; 6 500 /students/import; 4 403 /api/scores; 4 404 /favicon.ico; 2 500 /reports/print, newline after every row. Filename term 1 access.log yields 3 404 /favicon.ico then 1 401 /login. Compare source bytes before/after. |
| cli | tests | yes | `tests/cli.test.mjs` via files. Invoke without args → exit 1, empty stdout, usage on stderr. Missing path → exit 2, empty stdout. Empty and no-failures logs → exact no failures plus newline, exit 0. A malformed line ahead of one valid 404 is skipped with a diagnostic on stderr; the good row remains. |
| explanation | doc | yes | answers.md headings Parsing, Ordering, Errors; 20 words per heading describing parser boundaries, stable ordering and error channels. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `golden` — Report contents, tie order or source integrity differ from module 1.2.
- `cli` — The CLI confused empty, malformed or missing input.
- `explanation` — The explanation misses a command boundary.

### Needs

Module 9 and the module 2/8 calculation fixtures. WSL, Git, Node and Python 3.11+ with a project-specific virtual environment. Network for initial dependency installation only. Reuse the shipped 1.2 synthetic logs; no Supabase account.

---

## Unit P.3 — API consumer

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `py-u3` / `py-p3` |
| title | API consumer |
| module / position | 10 / 3 |
| guidance | half |
| minutes | 1050 |
| gpis_part | Request the next cursor exactly once; stop on null and reject repeated cursors. |
| requires | [wsl, node, python] |

### Outcomes

After this unit you can

1. Follow pagination
2. Bound retries
3. Write safe CSV

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Follow pagination | Request the next cursor exactly once; stop on null and reject repeated cursors. |
| 2. Bound retries | Apply explicit timeouts and bounded retries for 429 with Retry-After. Preserve the last completed export on failure. |
| 3. Write safe CSV | Escape quoting and newlines using a CSV writer. Keep formula-like text inert when opened in a spreadsheet. |

**Text diagram** cursor → bounded request → validated page → temporary CSV → replace

**Common mistakes**

1. Loop → no progress → Stop with an error
2. Skip page → data lost → Retry the same page within budget
3. Delete comma → changes data → CSV writer quotes the field

### Guided example — Collect library arrival pages

In a scratch folder.

1. (full) Fake two pages of titles with next cursor B then null. Three titles are collected once.
2. (full) Quote a comma in a title and read the CSV back.
3. (task) Return 429 once with Retry-After 0 and compare the final output.
4. (task) Repeat cursor B and check the old export remains intact.

### Quiz plan (`py-u3-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Cursor B returned twice? | Stop with an error | Loop (no progress). Silently finish (partial data) |
| 2 | 429 once then success? | Retry the same page within budget | Skip page (data lost). Restart output by appending (duplicates) |
| 3 | Comma in a name? | CSV writer quotes the field | Delete comma (changes data). Split on commas (breaks columns) |
| 4 | Text begins with =? | Write as inert text for spreadsheet export | Evaluate it (not export data). Only quote CSV syntax (spreadsheet can still interpret it) |
| 5 | Timeout after page two? | Keep previous complete file | Publish half file (misleading). Wait forever (no budget) |
| 6 | D-218 reprint of one issued result? | Read the stored issue each time | Treat retry as a new issue (duplicates). Read current draft (different data) |

### Lab — API consumer

**Start.** Run `npx academy init py-p3`. Seed export/ with empty starter export.py, sample pages A/B, a prior export and debug/ trace. The checker’s short-lived fake HTTP server is a test fixture; it starts no learner service.Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `export.py`, `tests/test_export.py` | `deliverables` |
| 2 | Course Node harness starts a loopback fake API on an ephemeral port then spawns python export.py --url URL --out FILE. GET first page then ?cursor=B with items [{id,name}], next=null. Fake returns 429 with Retry-After 0 once before B. Output header id,name, exactly one row per item in received order, zero exit. No internet. | `pages` |
| 3 | Repeated cursor B→B, malformed JSON, four consecutive 429s or >1s without headers: exit nonzero within 8s, leave prior output bytes intact. Contract max three attempts per page, timeout 1s per request; report reason to stderr. Cap Retry-After to 1s for this teaching API. | `bounds` |
| 4 | Parse exported bytes with an independent CSV reader. Comma, double quote and embedded newline round-trip. Prefix a single apostrophe to fields whose first non-whitespace character is =,+,- or @. Normal text unchanged. Require UTF-8 output. | `csv` |

**Hints (folded).** Look at export.py. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Escape quoting and newlines using a CSV writer. Keep formula-like text inert when opened in a spreadsheet. Check with `npx academy check py-p3`.

### Debugging lab — The endless last page

| Item | Design |
| :--- | :--- |
| Seeded | Seed debug/ trace: request A returns B; request B returns B again. |
| Symptom | The exporter never replaces the old file and keeps fetching. |
| Fault (builder only) | No visited cursor set. |
| Observe | The exporter never replaces the old file and keeps fetching. |
| Possible causes | Bad termination marker, retry loop, duplicate cursor. |
| Tests | Log status, attempt and cursor sequence; replay two 200 responses. |
| Cause | No visited cursor set. |
| Fix | Stop with a repeated-cursor diagnostic before requesting B again. |
| Fixed state | Two requests, nonzero exit, prior file unchanged. |

### Own build

1. Add a short export manifest.
2. Record row count without personal data.
3. Keep manifest and export consistent after a failed request.
4. Commit this variation. In `notes/py-u3.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Escape quoting and newlines using a CSV writer. Keep formula-like text inert when opened in a spreadsheet. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-218 distinguish retrying a read from issuing again?
2. Which GPIS AGENTS.md rule governs secrets in an exported diagnostic?

**Mastery, without notes**

1. Simulate 429.
2. Stop a repeated cursor.
3. Round-trip a quoted name.
4. Prove old output survives failure.

### Check plan (`py-p3`, version 1.0.0, lab root `export`, seed `fixtures/seed.sh`, requires [wsl, node, python])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `export.py`, `tests/test_export.py` |
| pages | tests | yes | `tests/pages.test.mjs` via files. Course Node harness starts a loopback fake API on an ephemeral port then spawns python export.py --url URL --out FILE. GET first page then ?cursor=B with items [{id,name}], next=null. Fake returns 429 with Retry-After 0 once before B. Output header id,name, exactly one row per item in received order, zero exit. No internet. |
| bounds | tests | yes | `tests/bounds.test.mjs` via files. Repeated cursor B→B, malformed JSON, four consecutive 429s or >1s without headers: exit nonzero within 8s, leave prior output bytes intact. Contract max three attempts per page, timeout 1s per request; report reason to stderr. Cap Retry-After to 1s for this teaching API. |
| csv | tests | yes | `tests/csv.test.mjs` via files. Parse exported bytes with an independent CSV reader. Comma, double quote and embedded newline round-trip. Prefix a single apostrophe to fields whose first non-whitespace character is =,+,- or @. Normal text unchanged. Require UTF-8 output. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `pages` — The export lost, duplicated or reordered a page.
- `bounds` — A broken source looped or replaced a complete export.
- `csv` — The CSV changed a name or left a formula-like value active.

### Needs

Module 9 and the module 2/8 calculation fixtures. WSL, Git, Node and Python 3.11+ with a project-specific virtual environment. Network for initial dependency installation only. Loopback fake API only.

---

## Unit P.4 — FastAPI service [Docker optional]

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `py-u4` / `py-p4` |
| title | FastAPI service [Docker optional] |
| module / position | 10 / 4 |
| guidance | independent |
| minutes | 1140 |
| gpis_part | A GET selects one class and term. Return an ordered synthetic result list with decimal strings and nullable totals. |
| requires | [wsl, node, git, python, supabase, lab-db, docker] |

### Outcomes

After this unit you can

1. Define the result contract
2. Separate service identity and reader privileges
3. Start and stop deliberately

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Define the result contract | A GET selects one class and term. Return an ordered synthetic result list with decimal strings and nullable totals. |
| 2. Separate service identity and reader privileges | A server-only token authenticates the caller. A dedicated reader sees only the published reporting projection. |
| 3. Start and stop deliberately | Run in WSL on loopback 8000. Optional container publishes loopback 8001 and serves the same contract. |

**Text diagram** Next server → bearer → FastAPI → read-only projection

**Common mistakes**

1. Empty success → hides auth failure → 401 without any database read
2. Allow with valid token → token not a DB grant → Database denies it
3. Include if recent → wrong state → Excluded from projection

### Guided example — Read a museum catalogue

In a scratch folder.

1. Define a GET that returns ids and titles for one collection.
2. Test valid service token, missing token and unknown collection separately.
3. Restrict the storage identity to the read projection.
4. Repeat the contract against a separately started process.

### Quiz plan (`py-u4-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Wrong service token? | 401 without any database read | Empty success (hides auth failure). Use admin fallback (wrong privilege) |
| 2 | Reader tries UPDATE? | Database denies it | Allow with valid token (token not a DB grant). Drop table (unrelated) |
| 3 | D-218 draft results? | Excluded from projection | Include if recent (wrong state). Approve at read time (no approval state) |
| 4 | Empty known class? | 200 with empty rows | 404 (class exists). Invent zero score (no data) |
| 5 | Missing total? | JSON null | String zero (real mark). Omit student (partial results may exist) |
| 6 | D-171 112/140 scaled to 50? | 40 | 56 (wrong max). 80 (percentage not component) |

### Lab — FastAPI service [Docker optional]

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `services/results/app.py`, `services/results/tests/test_api.py`, `supabase/migrations/*results_reader*.sql` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Learner starts python -m uvicorn app:app --host 127.0.0.1 --port 8000 inside services/results. Use synthetic lab class 900001, term 900001 with two persistent demo members and published totals 75.25 and null. GET /results/class/900001?term=900001 with server token → 200 {class_id:900001,term_id:900001,rows:[{student_id:900001,total:'75.25'},{student_id:900002,total:null}]}. Ascending student_id. Missing/wrong bearer → 401, unknown class → 404, invalid int → 422. No internal DB detail in response. | `contract` |
| 4 | Forward migration creates results_reader with no elevated role memberships and no BYPASSRLS, grants only select on public.published_class_results (class_id,term_id,student_id,total). As results_reader select rows of persistent fixture ordered by student_id; expect 900001/75.25 and 900002/null with numerics cast to text. UPDATE public.scores SET id=id WHERE false → expect_error true. SELECT has_table_privilege('results_reader','public.scores','insert') AS allowed → false. Service DSN uses this restricted identity; supply connection and token through ignored local configuration. | `readonly` |
| 5 | Run cd services/results && python -m pytest -q tests/test_api.py; exit 0 with passed cases including database unavailable → 503, no exception detail in response. | `python-tests` |
| 6 | Learner starts optional Docker packaging at loopback 8001. Repeat authorised and wrong-token GET and compare status and JSON to the WSL service. WSL path alone meets required checks. | `container` |

**Finished state.** Run in WSL on loopback 8000. Optional container publishes loopback 8001 and serves the same contract. Check with `npx academy check py-p4`.

### Debugging lab — The blank becomes zero

| Item | Design |
| :--- | :--- |
| Seeded | Scratch fake reader returns null and 0.00 for two class members. |
| Symptom | Response prints 0.00 for both. |
| Fault (builder only) | Serialiser replaces missing with zero. |
| Observe | Response prints 0.00 for both. |
| Possible causes | Query coalescing, decimal conversion, response default. |
| Tests | Inspect projection, inspect adapter output, compare serialised JSON. |
| Cause | Serialiser replaces missing with zero. |
| Fix | Preserve nullable decimal/string contract. |
| Fixed state | Missing remains null and an assessed zero remains 0.00. |

### Own build

1. Add a read-only service health response.
2. Keep record data out of error text.
3. Exercise database unavailable and recovered states.
4. Commit this variation. In `notes/py-u4.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Run in WSL on loopback 8000. Optional container publishes loopback 8001 and serves the same contract. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-218 limit the projection to submitted results?
2. Where do GPIS AGENTS.md rules 1 and 3 constrain the database identity?

**Mastery, without notes**

1. Test wrong token.
2. Read two ordered rows.
3. Prove write refusal.
4. Stop and restart the WSL service.

### Check plan (`py-p4`, version 1.0.0, no `lab:`, requires [wsl, node, git, python, supabase, lab-db])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `services/results/app.py`, `services/results/tests/test_api.py`, `supabase/migrations/*results_reader*.sql` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| contract | tests | yes | `tests/contract.test.mjs` via files. Learner starts python -m uvicorn app:app --host 127.0.0.1 --port 8000 inside services/results. Use synthetic lab class 900001, term 900001 with two persistent demo members and published totals 75.25 and null. GET /results/class/900001?term=900001 with server token → 200 {class_id:900001,term_id:900001,rows:[{student_id:900001,total:'75.25'},{student_id:900002,total:null}]}. Ascending student_id. Missing/wrong bearer → 401, unknown class → 404, invalid int → 422. No internal DB detail in response. |
| readonly | sql | yes | Forward migration creates results_reader with no elevated role memberships and no BYPASSRLS, grants only select on public.published_class_results (class_id,term_id,student_id,total). As results_reader select rows of persistent fixture ordered by student_id; expect 900001/75.25 and 900002/null with numerics cast to text. UPDATE public.scores SET id=id WHERE false → expect_error true. SELECT has_table_privilege('results_reader','public.scores','insert') AS allowed → false. Service DSN uses this restricted identity; supply connection and token through ignored local configuration. |
| python-tests | tests | yes | Run cd services/results && python -m pytest -q tests/test_api.py; exit 0 with passed cases including database unavailable → 503, no exception detail in response. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `contract` — The reporting service broke its response or access contract.
- `readonly` — Reader permissions or published fixture rows differ from contract.
- `python-tests` — The API tests failed their error contract.

### Live Docker check

Include `docker` in the unit’s `extra_checks`. Put these required live steps in
`check-docker/check.yaml` with id `py-p4-docker` and version `1.0.0`. Run it from the same project folder as the main check.
Run `npx academy check py-p4-docker` after starting the containers. The main check
can pass on its own. Progress shows “Docker · not yet” until the first live result.

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| container | tests | yes | `tests/container.test.mjs` via files. Learner starts optional Docker packaging at loopback 8001. Repeat authorised and wrong-token GET and compare status and JSON to the WSL service. |

### Needs

Module 9 and the module 2/8 calculation fixtures. WSL, Git, Node and Python 3.11+ with a project-specific virtual environment. Network for initial dependency installation only. Own marked Supabase project, restricted reader connection and local service token. Docker optional.

---

## Unit P.5 — Join the two

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `py-u5` / `py-p5` |
| title | Join the two |
| module / position | 10 / 5 |
| guidance | independent |
| minutes | 1050 |
| gpis_part | Validate request claims and class access in Next.js. Send only the server-side service token to FastAPI. |
| requires | [wsl, node, git, python, supabase, lab-db, playwright] |

### Outcomes

After this unit you can

1. Authorise before calling
2. Render three states
3. Rehearse the outage

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Authorise before calling | Validate request claims and class access in Next.js. Send only the server-side service token to FastAPI. |
| 2. Render three states | Distinguish loaded results, a known empty class and an unavailable service. Never turn transport failure into a zero mark. |
| 3. Rehearse the outage | Start or stop the service yourself; keep the web process up. Confirm recovery and record the request deadline. |

**Text diagram** browser → authorised server → bounded service read → ready / empty / unavailable

**Common mistakes**

1. Show zero → false data → Show Results unavailable; retry
2. Show 0 → real mark → Show blank per D-10
3. Browser → exposes credential → Next.js server

### Guided example — Join a library kiosk to stock counts

In a scratch folder.

1. Fetch two stock records from a local book service on the server.
2. Stop that service. Show Stock unavailable and preserve the rest of the page.
3. Restart it and show both records after reload.
4. Inspect browser requests to confirm the private token never travels to the browser.

### Quiz plan (`py-u5-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Service down? | Show Results unavailable; retry | Show zero (false data). Hide failure as empty class (wrong meaning) |
| 2 | Normal null? | Show blank per D-10 | Show 0 (real mark). Error 500 (valid partial result) |
| 3 | Who sends the service token? | Next.js server | Browser (exposes credential). URL query string (logs may retain it) |
| 4 | Different class selected? | Recheck class access | Reuse earlier allow (wrong resource). Trust URL id (client-controlled) |
| 5 | D-81 score 70? | Grade 2 on eligible mock | Grade 3 (threshold missed). Class position 2 (slip has none) |
| 6 | One localhost check? | Only local state verified | Proves deployment (different host). Proves outage and recovery together (requires two states) |

### Lab — Join the two

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/results-service.ts`, `services/results/tests/test_integration.py`, `docs/ops/results-service.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Playwright (Q4) at /capstone/class/900001/results?term=900001 using a lab staff session. With FastAPI running, show Class results, 75.25 and a blank cell for 900002; zero must remain visibly zero when supplied. Signed-out request redirects to login. Capture browser requests and assert no service bearer header sent to clients. | `join` |
| 4 | Use injected server fetch in results-service.ts, public readClassResults(classId,termId,fetcher). HTTP 503, ECONNREFUSED and a fetch exceeding 2s map to unavailable; valid 200 with [] maps to empty; successful retry maps to ready. Course harness checks the abort signal at deadline. | `failure` |
| 5 | docs/ops/results-service.md: Running, Stopped, Restarted, Deployment. Learner visits same signed-in route in each state. Record status and visible text; stopped shows Results unavailable and Retry, restart restores 75.25. Hosted verification if deployed is self-reviewed [Q3]. | `states` |
| 6 | http://localhost:3000/login: status 200, School username and Sign in, no sideways scroll, 44px targets. Protected results are exercised by join with a session. | `entry` |

**Finished state.** Start or stop the service yourself; keep the web process up. Confirm recovery and record the request deadline. Check with `npx academy check py-p5`.

### Debugging lab — False empty success

| Item | Design |
| :--- | :--- |
| Seeded | Scratch adapter converts every non-200 to an empty list. |
| Symptom | When FastAPI stops, the UI says no students. |
| Fault (builder only) | Blanket fallback collapses transport and business states. |
| Observe | When FastAPI stops, the UI says no students. |
| Possible causes | Empty class, expired token, unavailable server. |
| Tests | Read known fixture with correct token, inspect status, repeat with service stopped. |
| Cause | Blanket fallback collapses transport and business states. |
| Fix | Use separate typed states and bounded timeout. |
| Fixed state | Empty and unavailable display different messages. |

### Own build

1. Measure one slow service call.
2. Show bounded error feedback.
3. Record a recovery read after restart.
4. Commit this variation. In `notes/py-u5.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Start or stop the service yourself; keep the web process up. Confirm recovery and record the request deadline. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why would a zero fallback contradict D-10?
2. How does GPIS AGENTS.md rule 8 constrain the Next.js caller?

**Mastery, without notes**

1. Show healthy data.
2. Demonstrate refusal.
3. Stop the service and time feedback.
4. Restore it and reread.

### Check plan (`py-p5`, version 1.0.0, no `lab:`, requires [wsl, node, git, python, supabase, lab-db, playwright])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/results-service.ts`, `services/results/tests/test_integration.py`, `docs/ops/results-service.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| join | tests | yes | `tests/join.test.mjs` via files. Playwright (Q4) at /capstone/class/900001/results?term=900001 using a lab staff session. With FastAPI running, show Class results, 75.25 and a blank cell for 900002; zero must remain visibly zero when supplied. Signed-out request redirects to login. Capture browser requests and assert no service bearer header sent to clients. |
| failure | tests | yes | `tests/failure.test.mjs` via files. Use injected server fetch in results-service.ts, public readClassResults(classId,termId,fetcher). HTTP 503, ECONNREFUSED and a fetch exceeding 2s map to unavailable; valid 200 with [] maps to empty; successful retry maps to ready. Course harness checks the abort signal at deadline. |
| states | doc | yes | docs/ops/results-service.md: Running, Stopped, Restarted, Deployment. Learner visits same signed-in route in each state. Record status and visible text; stopped shows Results unavailable and Retry, restart restores 75.25. Hosted verification if deployed is self-reviewed [Q3]. |
| entry | page | yes | http://localhost:3000/login: status 200, School username and Sign in, no sideways scroll, 44px targets. Protected results are exercised by join with a session. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `join` — The joined screen lost results or exposed its service boundary.
- `failure` — A failed service was rendered as a successful result.
- `states` — The service outage and recovery evidence is incomplete.
- `entry` — The web application entry route is unavailable.

### Needs

Module 9 and the module 2/8 calculation fixtures. WSL, Git, Node and Python 3.11+ with a project-specific virtual environment. Network for initial dependency installation only. P.4 service, own Supabase, Chromium and local Next.js.

---

## Unit P.6 — Was it worth it?

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `py-u6` / `py-p6` |
| title | Was it worth it? |
| module / position | 10 / 6 |
| guidance | independent |
| minutes | 990 |
| gpis_part | Use identical synthetic classes, same time window and matching outputs for the original and service paths. |
| requires | [wsl, node, git, python] |

### Outcomes

After this unit you can

1. Compare like with like
2. Quantify operational cost
3. Make a reversible decision

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Compare like with like | Use identical synthetic classes, same time window and matching outputs for the original and service paths. |
| 2. Quantify operational cost | Separate service startup, steady latency, extra deployment, authentication, logging and outage handling. |
| 3. Make a reversible decision | Choose keep or remove for the learner’s own system. Name evidence that would change the answer. |

**Text diagram** equal workload → paired evidence → decision → reconsideration

**Common mistakes**

1. Two ms service cost → inputs differ → Not a fair comparison
2. Fastest 5% → other end → A threshold covering roughly 95% of observations
3. Prefer faster → incorrect history → Parity failed even if faster

### Guided example — Assess a library image thumbnail service

In a scratch folder.

1. Compare two ways to render the same 50 covers. Verify the same output count.
2. Separate startup time from warmed request time.
3. List the extra configuration and failure case.
4. Choose a design and state a reversal threshold.

### Quiz plan (`py-u6-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 10 versus 12 ms for different datasets? | Not a fair comparison | Two ms service cost (inputs differ). Faster is always better (correctness first) |
| 2 | P95 means? | A threshold covering roughly 95% of observations | Fastest 5% (other end). Average (different statistic) |
| 3 | D-218 issue read changes after migration? | Parity failed even if faster | Prefer faster (incorrect history). Ignore old issue (must reprint) |
| 4 | D-81 expected raw 426 now 425? | Investigate correctness before timing | Accept one point drift (exact rules). Change fixture (masks defect) |
| 5 | Cold startup? | Report separately from warmed latency | Mix without labelling (misleading). Discard all costs (operationally relevant) |
| 6 | Good reversal condition? | Measured threshold and observation period | Use Python forever (no reversal). Change by taste (no evidence) |

### Lab — Was it worth it?

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `services/results/decision.md`, `services/results/evidence.csv` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | services/results/decision.md headings Benefit, Cost, Failure, Decision, Reconsider. One page, 250–500 words in total; doc step enforces 20 per heading, word range by evidence test. Include deployment and support cost plus one concrete teaching benefit. | `decision` |
| 4 | Parse evidence.csv with header path,case,run,elapsed_ms,row_count and paths next,python. Require same case and row_count, ten paired warmed runs and separately named cold case each, nonnegative finite timings. Check decision.md word range. Learner computes medians and identifies limits; checker verifies shape and pairing only. | `evidence` |

**Finished state.** Choose keep or remove for the learner’s own system. Name evidence that would change the answer. Check with `npx academy check py-p6`.

### Debugging lab — The convincing shortcut

| Item | Design |
| :--- | :--- |
| Seeded | Scratch sheet compares cached Next results to first Python startup. |
| Symptom | Reported gap vanishes on the second run. |
| Fault (builder only) | Cold and warm observations were pooled. |
| Observe | Reported gap vanishes on the second run. |
| Possible causes | Different rows, build mode, cold start. |
| Tests | Compare row ids, runtime mode, first and later calls. |
| Cause | Cold and warm observations were pooled. |
| Fix | Separate cold series and rerun paired cases. |
| Fixed state | Both paths have labelled comparable samples. |

### Own build

1. Write a one-page rollback note.
2. Keep public result shape unchanged.
3. Name the owner and proof of successful removal.
4. Commit this variation. In `notes/py-u6.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Choose keep or remove for the learner’s own system. Name evidence that would change the answer. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Which D-218 guarantee must survive removal of the service?
2. How does GPIS’s single-school boundary in AGENTS.md affect the cost argument?

**Mastery, without notes**

1. Recompute a median.
2. Identify a confounder.
3. Defend one operational cost.
4. Explain how to reverse the decision.

### Check plan (`py-p6`, version 1.0.0, no `lab:`, requires [wsl, node, git, python])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `services/results/decision.md`, `services/results/evidence.csv` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| decision | doc | yes | services/results/decision.md headings Benefit, Cost, Failure, Decision, Reconsider. One page, 250–500 words in total; doc step enforces 20 per heading, word range by evidence test. Include deployment and support cost plus one concrete teaching benefit. |
| evidence | tests | yes | `tests/evidence.test.mjs` via files. Parse evidence.csv with header path,case,run,elapsed_ms,row_count and paths next,python. Require same case and row_count, ten paired warmed runs and separately named cold case each, nonnegative finite timings. Check decision.md word range. Learner computes medians and identifies limits; checker verifies shape and pairing only. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `decision` — The decision lacks a cost, failure or reconsideration condition.
- `evidence` — Measurements are unpaired or the decision exceeds the length contract.

### Needs

Module 9 and the module 2/8 calculation fixtures. WSL, Git, Node and Python 3.11+ with a project-specific virtual environment. Network for initial dependency installation only. Both P.5 paths running for measurements; no public deployment required.

## After module 10 the learner has

A typed reporting service, offline Python automation, authenticated server-to-server integration and a measurement-based decision about keeping the second service.
