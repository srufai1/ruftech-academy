# Module 7 — Security, testing and DevOps

| Unit | Title | Project | Kind | Level | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 7.1 | Negative tests | m7-p1 | Repo | half | 990 | 4 |
| 7.2 | Security review [Docker optional] | m7-p2 | Repo | half | 1050 | 5 |
| 7.3 | CI pipeline | m7-p3 | Repo | half | 990 | 5 |
| 7.4 | Deploy and configure | m7-p4 | Repo | independent | 1050 | 5 |
| 7.5 | Web stack debugging [Docker] | m7-p5 | Seeded lab | independent | 1110 | 4 |
| 7.6 | Incident and postmortem | m7-p6 | Repo | independent | 1050 | 5 |

## Module rules (decided here)

Use only synthetic records. Check SQL against the marked practice database. Each sql step sets up its own rows, uses qualified public names, and rolls back. Use the module 4 fixtures and claims for ADMIN and ASSESSMENT. Use id 900001 upwards and names beginning ZZ. Counts are integers, money and dates are text, and lists have explicit ordering. Page checks use a learner-started app at http://localhost:3000, status 200, 360 × 780, no sideways scroll and 44px controls. Browser interaction tests (Q4) load Playwright from the project and first assert the app answers. Use separate synthetic role sessions in ignored local storage-state files, never a test bypass in the app. Test refusals against synthetic policy matrices. A document step requires its exact headings and 20 words under each. Use hosted evidence for staging and a separate local browser check [Q3]. The Docker outcomes are recorded separately [Q8].

Use the eight-step sequence, review checklist and reflection in 00-guide.md. Use text diagrams. Debugging and own builds are self-reviewed [Q1]. For each own build commit the variation and put the comparison in `notes/<unit-id>.md`. Read GPIS after a pass, or after a written 30-minute attempt in a half-guided unit.

## File and interface contract

Print the paths and the named inputs, outputs and routes from the check plan in the corresponding lab.

| Unit | Deliverables relative to its working directory |
| :--- | :--- |
| 7.1 | tests/access-matrix.test.mjs; docs/security/access.csv |
| 7.2 | docs/security/review.md; docs/security/anon-functions.txt |
| 7.3 | scripts/ci.sh; .github/workflows/ci.yml |
| 7.4 | docs/ops/staging.md; docs/ops/staging-evidence.md |
| 7.5 | diagnosis.md; compose.yaml; start.sh; repaired-map.csv |
| 7.6 | docs/ops/incident.md; docs/ops/recovery.csv |

## GPIS rules used in this module

| Source in the read-only GPIS | Text to use |
| :--- | :--- |
| GPIS AGENTS.md rules 1–8 | “Every table has RLS enabled with explicit policies.” Use verified claims and keep privileged keys out of the application. |
| D-170 | “5 failed GPIS login attempts lock the account for 30 minutes”. |
| D-218 | “Existing issued snapshots and verification identities remain immutable.” |

---

## Unit 7.1 — Negative tests

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m7-u1` / `m7-p1` |
| title | Negative tests |
| module / position | 7 / 1 |
| guidance | half |
| minutes | 990 |
| gpis_part | Cross every role with every course table and operation. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Inventory permissions
2. Prove a refusal
3. Measure test sensitivity

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Inventory permissions | Cross every role with every course table and operation. |
| 2. Prove a refusal | A known row and a permitted read distinguish denial from a missing fixture. |
| 3. Measure test sensitivity | Each deliberately wrong decision should fail its own named assertion. |

**Text diagram** expected permission + observed decision → assertion

**Common mistakes**

1. Proves RLS → empty input → Inconclusive without a known row
2. Assume safe → broken reader could always deny → Add an allowed control
3. Five minutes → wrong unit → 30-minute lock

### Guided example — Library tickets

In a scratch folder.

1. (full) Model public catalogue reads as allowed and rare-book checkout as denied.
2. (full) Change checkout to allowed in a scratch copy and record the failed assertion.
3. (task) Restore that cell and change the visitor role.
4. (task) Compare the two named failures.

### Quiz plan (`m7-u1-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Empty table returns zero? | Inconclusive without a known row | Proves RLS (empty input). Proves write refusal (different operation) |
| 2 | All tests deny? | Add an allowed control | Assume safe (broken reader could always deny). Skip fixture (loses evidence) |
| 3 | D-170 fifth wrong password? | 30-minute lock | Five minutes (wrong unit). 60 minutes (idle rule) |
| 4 | One changed cell passes? | The suite missed that permission | All cells covered (counterexample). Remove mutation (hides gap) |
| 5 | Inactive staff? | Deny private access | Trust label (inactive). Trust screen (client only) |
| 6 | Role source? | Verified app_metadata | user_metadata (editable). Button text (display only) |

### Lab — Negative tests

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `tests/access-matrix.test.mjs`, `docs/security/access.csv` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Parse access.csv header role,table,operation,expected. Require anon,assessment,admin,root,inactive × module 4 and 5 contract tables × select,insert,update,delete; allow or deny exactly once per cell. Compare with forward migration grants. | `inventory` |
| 4 | Run tests/access-matrix.test.mjs with ACCESS_MATRIX set to a scratch CSV. Clean matrix exits 0 with both positive and negative assertions. Three copies separately flip anon/students/select, assessment/subject_returns/delete, inactive/issued_documents/insert to allow. Each must exit nonzero naming the changed cell. These are offline data fixtures. | `sensitivity` |

**Hints (folded).** Look at tests/access-matrix.test.mjs. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Each deliberately wrong decision should fail its own named assertion. Check with `npx academy check m7-p1`.

### Debugging lab — Always denied

| Item | Design |
| :--- | :--- |
| Seeded | Scratch reader returns deny on missing file; fixtures contain one allowed staff read. |
| Symptom | Every negative assertion passes on a missing file. |
| Fault (builder only) | No positive control. |
| Observe | Every negative assertion passes on a missing file. |
| Possible causes | Wrong path, wrong identity, incomplete assertions. |
| Tests | Check path, record role, require the known allowed read. |
| Cause | No positive control. |
| Fix | Require file existence and positive control. |
| Fixed state | Missing fixture fails, clean matrix passes. |

### Own build

1. Extend the matrix to a new table.
2. Include a permitted read.
3. Record a refusal with its role and operation.
4. Commit this variation. In `notes/m7-u1.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Each deliberately wrong decision should fail its own named assertion. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Which AGENTS.md rule establishes role identity?
2. Why does D-218 protect return history?

**Mastery, without notes**

1. Detect one flip.
2. Show a working control.
3. Identify a missing fixture.
4. Explain a zero-row false positive.

### Check plan (`m7-p1`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `tests/access-matrix.test.mjs`, `docs/security/access.csv` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| inventory | tests | yes | `tests/inventory.test.mjs` via files. Parse access.csv header role,table,operation,expected. Require anon,assessment,admin,root,inactive × module 4 and 5 contract tables × select,insert,update,delete; allow or deny exactly once per cell. Compare with forward migration grants. |
| sensitivity | tests | yes | Run tests/access-matrix.test.mjs with ACCESS_MATRIX set to a scratch CSV. Clean matrix exits 0 with both positive and negative assertions. Three copies separately flip anon/students/select, assessment/subject_returns/delete, inactive/issued_documents/insert to allow. Each must exit nonzero naming the changed cell. These are offline data fixtures. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `inventory` — The access grid omits or repeats a decision.
- `sensitivity` — An incorrect permission passed its negative test.

### Needs

Modules 4 and 5. Use synthetic data, WSL, Node and Git. Use only the learner’s marked lab database for SQL.

---

## Unit 7.2 — Security review [Docker optional]

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m7-u2` / `m7-p2` |
| title | Security review [Docker optional] |
| module / position | 7 / 2 |
| guidance | half |
| minutes | 1050 |
| gpis_part | Check claims, validation, table grants and storage scope. |
| requires | [wsl, node, git, supabase, lab-db, docker] |

### Outcomes

After this unit you can

1. Trace one private action
2. Inspect effective grants
3. Record evidence

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Trace one private action | Check claims, validation, table grants and storage scope. |
| 2. Inspect effective grants | PUBLIC grants can affect an anonymous caller even without an explicit anon grant. |
| 3. Record evidence | Record the redacted location, observed behaviour and a repeatable retest. |

**Text diagram** caller → trusted action → effective permission → result

**Common mistakes**

1. All data public → different privilege → Check intended exposure
2. Always harmless → extra privilege → Review effective owner and search path
3. Forty-five → old rule → Thirty minutes locked

### Guided example — Review a library noticeboard

In a scratch folder.

1. (full) Inventory public read and editor write, each with its caller.
2. (full) Read the synthetic role matrix and catalogue to compare grants.
3. (task) Inspect the write action’s identity source.
4. (task) Write a finding and a measurable retest.

### Quiz plan (`m7-u2-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Function has explicit anon grant? | Check intended exposure | All data public (different privilege). All safe (behaviour matters) |
| 2 | Definer function? | Review effective owner and search path | Always harmless (extra privilege). Always remove (could be necessary) |
| 3 | D-170 five failed attempts? | Thirty minutes locked | Forty-five (old rule). Sixty (idle clock) |
| 4 | Evidence contains a key? | Redact its value | Publish it (credential exposed). Ignore the location (cannot retest) |
| 5 | Storage object scope? | Check storage policies | Table policy alone (different object). Check title (display only) |
| 6 | Optional traffic evidence? | Compare a fabricated label in supplied teaching traces | Use real credentials (unnecessary). Infer role from TLS (transport only) |

### Lab — Security review [Docker optional]

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/security/review.md`, `docs/security/anon-functions.txt` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/security/review.md headings RLS, Definer functions, Actions, Storage, Secrets, Retest. Each finding names evidence, expected rule and retest. | `review` |
| 4 | SELECT DISTINCT p.proname FROM pg_proc p WHERE p.pronamespace='public'::regnamespace AND p.proname IN ('move_student','withdraw_student','admit_student','submit_subject','return_subject','issue_document','issue_updated') AND has_function_privilege('anon',p.oid,'execute') ORDER BY 1 → []. Inventory deliberately public entry points separately in anon-functions.txt, including signatures and rationale; compare effective inventory manually. | `anon` |
| 5 | Optional Docker loopback teaching service: compare supplied HTTP/TLS transcripts carrying synthetic ZZ-DEMO. docs/security/traffic.csv must contain http,visible and tls,encrypted. Reproduce the comparison with the learner-started simulator. | `traffic` |

**Hints (folded).** Look at docs/security/review.md. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Record the redacted location, observed behaviour and a repeatable retest. Check with `npx academy check m7-p2`.

### Debugging lab — The inherited permission

| Item | Design |
| :--- | :--- |
| Seeded | Catalogue lists a private function granted to PUBLIC. |
| Symptom | Anonymous inventory unexpectedly includes it. |
| Fault (builder only) | Inventory checked only explicit anon grants. |
| Observe | Anonymous inventory unexpectedly includes it. |
| Possible causes | Stale export, wrong schema, inherited rights. |
| Tests | Check date, schema and effective execute privilege. |
| Cause | Inventory checked only explicit anon grants. |
| Fix | Review effective grants and remove unintended public access by migration. |
| Fixed state | Private list is empty for anon. |

### Own build

1. Review a storage path.
2. Name its intended owner.
3. Record one allowed and one refused access.
4. Commit this variation. In `notes/m7-u2.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Record the redacted location, observed behaviour and a repeatable retest. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. What does AGENTS.md require of all new tables?
2. Why does D-218 make history a separate review target?

**Mastery, without notes**

1. Trace a private read.
2. Trace a write.
3. Explain inherited execute.
4. Redact a finding and retain enough to retest.

### Check plan (`m7-p2`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db, docker])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/security/review.md`, `docs/security/anon-functions.txt` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| review | doc | yes | docs/security/review.md headings RLS, Definer functions, Actions, Storage, Secrets, Retest. Each finding names evidence, expected rule and retest. |
| anon | sql | yes | SELECT DISTINCT p.proname FROM pg_proc p WHERE p.pronamespace='public'::regnamespace AND p.proname IN ('move_student','withdraw_student','admit_student','submit_subject','return_subject','issue_document','issue_updated') AND has_function_privilege('anon',p.oid,'execute') ORDER BY 1 → []. Inventory deliberately public entry points separately in anon-functions.txt, including signatures and rationale; compare effective inventory manually. |
| traffic | tests | no | `tests/traffic.test.mjs` via files. Optional Docker loopback teaching service: compare supplied HTTP/TLS transcripts carrying synthetic ZZ-DEMO. docs/security/traffic.csv must contain http,visible and tls,encrypted. Reproduce the comparison with the learner-started simulator. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `review` — The review missed a boundary or retest.
- `anon` — Anonymous callers have an unintended private operation.

### Needs

Modules 4 and 5. Use synthetic data, WSL, Node and Git. Use only the learner’s marked lab database for SQL. Optional Docker for local transcript comparison.

---

## Unit 7.3 — CI pipeline

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m7-u3` / `m7-p3` |
| title | CI pipeline |
| module / position | 7 / 3 |
| guidance | half |
| minutes | 990 |
| gpis_part | Guard source, lint, check types, build and run tests. Preserve each failure status. |
| requires | [wsl, node, git, github] |

### Outcomes

After this unit you can

1. Build one local gate
2. Use frozen dependencies
3. Prove failure locally

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Build one local gate | Guard source, lint, check types, build and run tests. Preserve each failure status. |
| 2. Use frozen dependencies | Install with npm ci on the project’s Node version. |
| 3. Prove failure locally | A synthetic detector sentinel in a disposable commit must fail the same gate as CI. |

**Text diagram** push → frozen install → local gate → exit

**Common mistakes**

1. Both codes returned → one shell status → Failure can be masked
2. Resolve silently → changes input → Frozen install fails
3. Sleep for 30 minutes → slow → Test 30 minutes with a fake clock

### Guided example — Check a library catalogue

In a scratch folder.

1. (full) Validate one clean book record and record exit zero.
2. (full) Misspell a required field in a scratch copy and observe exit one.
3. (task) Capture the log without masking exit status.
4. (task) Compare the local command with the workflow entry point.

### Quiz plan (`m7-u3-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Failed check then successful echo? | Failure can be masked | Both codes returned (one shell status). Tests rerun (no retry) |
| 2 | Lockfile differs? | Frozen install fails | Resolve silently (changes input). Skip install (missing packages) |
| 3 | D-170 five failures? | Test 30 minutes with a fake clock | Sleep for 30 minutes (slow). Skip boundary (loses coverage) |
| 4 | Protected value in CI? | Use a protected binding if required | Commit it (history persists). Echo it (log exposure) |
| 5 | Zero tests discovered? | Fail the gate | Pass (no execution). Count test files (not execution) |
| 6 | Why one script? | Local and hosted gates match | Makes environments identical (versions still matter). Protects branch automatically (provider setting) |

### Lab — CI pipeline

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `scripts/ci.sh`, `.github/workflows/ci.yml` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Parse CI YAML: push on main, checkout, project Node, npm ci, then bash scripts/ci.sh. Require guard, lint, tsc, build and executed tests in its clean output. | `workflow` |
| 4 | Run bash scripts/ci.sh from project, exit 0 with nonzero test count. | `clean` |
| 5 | In a disposable copy add inert ACADEMY_CI_DEMO_SECRET under src/ and make a local fixture commit. Run the same gate, expect nonzero and offending path, no matched value. Clean control passes. Keep the temporary commit outside learner history. | `bad` |

**Hints (folded).** Look at scripts/ci.sh. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** A synthetic detector sentinel in a disposable commit must fail the same gate as CI. Check with `npx academy check m7-p3`.

### Debugging lab — Green broken build

| Item | Design |
| :--- | :--- |
| Seeded | Scratch gate runs failing check then successful echo. |
| Symptom | CI passes despite the failure line. |
| Fault (builder only) | Last command overwrites the exit code. |
| Observe | CI passes despite the failure line. |
| Possible causes | Skipped case, stale log, status lost. |
| Tests | Count tests, date log, inspect status at each boundary. |
| Cause | Last command overwrites the exit code. |
| Fix | Propagate the first failing command. |
| Fixed state | Bad fixture now exits nonzero locally and in CI. |

### Own build

1. Seed a type error in a temporary copy.
2. Show later release steps are skipped.
3. Keep the clean gate in the learner repository.
4. Commit this variation. In `notes/m7-u3.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** A synthetic detector sentinel in a disposable commit must fail the same gate as CI. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Which two guards does GPIS CI use under AGENTS.md rules 1 and 3?
2. Which D-218 invariant should an offline test preserve?

**Mastery, without notes**

1. Trace an exit code.
2. Run clean copy.
3. Test inert marker.
4. Identify the shared entry point.

### Check plan (`m7-p3`, version 1.0.0, no `lab:`, requires [wsl, node, git, github])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `scripts/ci.sh`, `.github/workflows/ci.yml` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| workflow | tests | yes | `tests/workflow.test.mjs` via files. Parse CI YAML: push on main, checkout, project Node, npm ci, then bash scripts/ci.sh. Require guard, lint, tsc, build and executed tests in its clean output. |
| clean | tests | yes | Run bash scripts/ci.sh from project, exit 0 with nonzero test count. |
| bad | tests | yes | `tests/bad.test.mjs` via files. In a disposable copy add inert ACADEMY_CI_DEMO_SECRET under src/ and make a local fixture commit. Run the same gate, expect nonzero and offending path, no matched value. Clean control passes. Keep the temporary commit outside learner history. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `workflow` — The workflow and local gate differ.
- `clean` — The clean gate did not finish.
- `bad` — The guard accepted the synthetic bad commit.

### Needs

Modules 4 and 5. Use synthetic data, WSL, Node and Git. Use only the learner’s marked lab database for SQL. GitHub for a hosted run.

---

## Unit 7.4 — Deploy and configure

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m7-u4` / `m7-p4` |
| title | Deploy and configure |
| module / position | 7 / 4 |
| guidance | independent |
| minutes | 1050 |
| gpis_part | Record aliases, revision and variable names. Keep credential values in provider settings. |
| requires | [wsl, node, git, vercel, supabase, playwright] |

### Outcomes

After this unit you can

1. Identify staging resources
2. Prove idempotence
3. Verify the hosted release

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Identify staging resources | Record aliases, revision and variable names. Keep credential values in provider settings. |
| 2. Prove idempotence | Compare settings, migrations and visible output after a second run. |
| 3. Verify the hosted release | Use the staging hostname and dated evidence. A localhost request proves only the local route. |

**Text diagram** revision → build → alias → dated response

**Common mistakes**

1. Always expected → goal repeatability → Investigate drift
2. Same revision proved → different host → Hosted version still needs evidence
3. Open → staff provisioned → Disabled for staff system

### Guided example — Deploy a library timetable

In a scratch folder.

1. Release a static timetable marked v1 to a practice host.
2. Read its public title and record revision.
3. Repeat configuration and compare settings.
4. Roll back to the earlier timetable and verify its title.

### Quiz plan (`m7-u4-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Second run changes settings? | Investigate drift | Always expected (goal repeatability). Delete project (destroys evidence) |
| 2 | Local page loads? | Hosted version still needs evidence | Same revision proved (different host). Auth verified (no credentials used) |
| 3 | D-170 public signup? | Disabled for staff system | Open (staff provisioned). Use secret in client (privileged key) |
| 4 | Credential rotation? | Change protected binding and refresh deployment | Commit it (history). Use public variable (browser visibility) |
| 5 | Successful login page read? | Rendering proved | All roles tested (no role action). Migrations tested (separate check) |
| 6 | Rollback record? | Revision and restored response | PID (instances change). Time alone (no identity) |

### Lab — Deploy and configure

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/ops/staging.md`, `docs/ops/staging-evidence.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/ops/staging.md: Resources, Variables, First deploy, Repeat, Rollback. Include Vercel free tier and own Supabase, migration version and rollback revision. | `runbook` |
| 4 | docs/ops/staging-evidence.md: First run, Second run, Hosted login. Record time, host, revision, status and login text. Compare normalised settings and migrations. Human verifies hosted response [Q3]. | `hosted` |
| 5 | /login shows School username and Sign in. Local rendering under module page contract. | `local` |

**Finished state.** Use the staging hostname and dated evidence. A localhost request proves only the local route. Check with `npx academy check m7-p4`.

### Debugging lab — The old alias

| Item | Design |
| :--- | :--- |
| Seeded | Scratch aliases staging→v1 and candidate→v2; intended release v2. |
| Symptom | Staging still displays v1. |
| Fault (builder only) | The alias was never moved. |
| Observe | Staging still displays v1. |
| Possible causes | Wrong build, cached page, stale alias. |
| Tests | Read revision, fetch fresh response, compare alias target. |
| Cause | The alias was never moved. |
| Fix | Point staging at the validated candidate. |
| Fixed state | Repeated requests report v2. |

### Own build

1. Write a rollback drill.
2. Record revision before and after.
3. Keep a dated redacted settings inventory.
4. Commit this variation. In `notes/m7-u4.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Use the staging hostname and dated evidence. A localhost request proves only the local route. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does GPIS AGENTS.md distinguish staging from production?
2. Which D-170 authentication settings are hosted?

**Mastery, without notes**

1. Identify running revision.
2. Compare setting names.
3. Repeat deployment.
4. Verify rollback.

### Check plan (`m7-p4`, version 1.0.0, no `lab:`, requires [wsl, node, git, vercel, supabase, playwright])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/ops/staging.md`, `docs/ops/staging-evidence.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| runbook | doc | yes | docs/ops/staging.md: Resources, Variables, First deploy, Repeat, Rollback. Include Vercel free tier and own Supabase, migration version and rollback revision. |
| hosted | doc | yes | docs/ops/staging-evidence.md: First run, Second run, Hosted login. Record time, host, revision, status and login text. Compare normalised settings and migrations. Human verifies hosted response [Q3]. |
| local | page | yes | /login shows School username and Sign in. Local rendering under module page contract. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `runbook` — The runbook lacks repeat or rollback instructions.
- `hosted` — Hosted evidence or the second run is absent.
- `local` — Local sign-in did not render.

### Needs

Modules 4 and 5. Use synthetic data, WSL, Node and Git. Use only the learner’s marked lab database for SQL. Vercel, lab Supabase, network and Chromium.

---

## Unit 7.5 — Web stack debugging [Docker]

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m7-u5` / `m7-p5` |
| title | Web stack debugging [Docker] |
| module / position | 7 / 5 |
| guidance | independent |
| minutes | 1110 |
| gpis_part | The proxy routes to an app that reads its config and borrows a database connection. |
| requires | [wsl, node, docker] |

### Outcomes

After this unit you can

1. Trace a working request
2. Localise three failures
3. Prove recovery

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Trace a working request | The proxy routes to an app that reads its config and borrows a database connection. |
| 2. Localise three failures | Route mismatch, read denial and an exhausted pool leave different evidence. |
| 3. Prove recovery | Read the query result after a full restart. A listening socket alone is insufficient. |

**Text diagram** proxy → route → config → connection → query

**Common mistakes**

1. Proves DB access → socket only → Still check the query
2. Increase pool → different layer → Compare upstream route and request
3. Restart DB → wrong cause → Expected in a 30-minute window

### Guided example — Restore a label printer

In a scratch folder.

1. A local queue accepts a label but the worker cannot read its template.
2. Compare the worker’s expected path with actual file mode.
3. Give only the worker the needed read access.
4. Restart and confirm the printed text.

### Quiz plan (`m7-u5-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Open port? | Still check the query | Proves DB access (socket only). Proves routing (different layer) |
| 2 | HTTP 404? | Compare upstream route and request | Increase pool (different layer). Change mode (not evidence) |
| 3 | D-170 locked at minute 29? | Expected in a 30-minute window | Restart DB (wrong cause). Extend lock (fixed window) |
| 4 | Unreadable file? | Grant required read to the app identity | Make world writable (excessive). Change port (unrelated) |
| 5 | Pool exhausted? | Release borrowed connections | Open unlimited (worsens exhaustion). Suppress warning (no recovery) |
| 6 | No Docker? | Document supplied log diagnosis | Claim live repair (unverified). Use real system (wrong target) |

### Lab — Web stack debugging [Docker]

**Start.** Run `npx academy init m7-p5`. Build stack/ with compose.yaml, start.sh mode 0755, a wrong upstream route, unreadable fixture config, unreleased connection and deterministic logs for the written route. Start no services in the seed.Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `diagnosis.md`, `compose.yaml`, `start.sh`, `repaired-map.csv` | `deliverables` |
| 2 | diagnosis.md: Observe, Possible causes, Tests, Cause, Fix. Include evidence for all three supplied failures and expected result after restart. | `diagnosis` |
| 3 | Read repaired-map.csv, header symptom,layer,fixed; require 404,proxy,/health; EACCES,config,readable; pool_timeout,database,released. Required on either path. | `logs` |
| 4 | Learner runs start.sh (0755) then restarts compose. At loopback port 3185, three GET /health requests must return HTTP 200 JSON {route:true,config:true,query:1}. Verify recorded distinct service start times. Manual no-Docker path uses supplied logs [Q8]. | `health` |

**Finished state.** Read the query result after a full restart. A listening socket alone is insufficient. Check with `npx academy check m7-p5`.

### Debugging lab — Yesterday’s config

| Item | Design |
| :--- | :--- |
| Seeded | Two scratch config paths, mount points at the old one. |
| Symptom | Restart still loads the old route. |
| Fault (builder only) | Wrong mount source. |
| Observe | Restart still loads the old route. |
| Possible causes | Cache, wrong mount, stale process. |
| Tests | Compare response, mounted filename, worker start time. |
| Cause | Wrong mount source. |
| Fix | Mount the intended fixture. |
| Fixed state | Restart uses the new route. |

### Own build

1. Write one incident card per layer.
2. Give each a disconfirming observation.
3. Name a post-restart functional check.
4. Commit this variation. In `notes/m7-u5.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Read the query result after a full restart. A listening socket alone is insufficient. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Which AGENTS.md rule limits database targets?
2. Why must a D-218 reprint survive a service restart?

**Mastery, without notes**

1. Localise 404.
2. Localise EACCES.
3. Trace a borrowed connection.
4. Prove a second start works.

### Check plan (`m7-p5`, version 1.0.0, lab root `stack`, seed `fixtures/seed.sh`, requires [wsl, node, docker])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `diagnosis.md`, `compose.yaml`, `start.sh`, `repaired-map.csv` |
| diagnosis | doc | yes | diagnosis.md: Observe, Possible causes, Tests, Cause, Fix. Include evidence for all three supplied failures and expected result after restart. |
| logs | tests | yes | `tests/logs.test.mjs` via files. Read repaired-map.csv, header symptom,layer,fixed; require 404,proxy,/health; EACCES,config,readable; pool_timeout,database,released. Required on either path. |
| health | tests | no | `tests/health.test.mjs` via files. Learner runs start.sh (0755) then restarts compose. At loopback port 3185, three GET /health requests must return HTTP 200 JSON {route:true,config:true,query:1}. Verify recorded distinct service start times. Manual no-Docker path uses supplied logs [Q8]. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `diagnosis` — The diagnosis omits a fault or its proof.
- `logs` — A symptom was assigned to the wrong layer.

### Needs

Modules 1.3 and 4.6. Docker with Compose for live work, teaching images pre-pulled. Offline logs otherwise.

---

## Unit 7.6 — Incident and postmortem

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m7-u6` / `m7-p6` |
| title | Incident and postmortem |
| module / position | 7 / 6 |
| guidance | independent |
| minutes | 1050 |
| gpis_part | Read a synthetic canary via the learner’s staging app before and after the incident. |
| requires | [wsl, node, git, supabase, lab-db] |

### Outcomes

After this unit you can

1. Measure impact
2. Restore a scoped backup
3. Write a blameless report

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Measure impact | Read a synthetic canary via the learner’s staging app before and after the incident. |
| 2. Restore a scoped backup | Use an isolated drill table and compare the restored content with its recorded value. |
| 3. Write a blameless report | Separate observation, contributing conditions and follow-ups with owners and proof. |

**Text diagram** detect → scope → restore → read → prevent

**Common mistakes**

1. Nine → wrong subtraction → Twelve observed minutes
2. Assume restore works → file alone → Verify restored contents
3. Renumber all → references break → Preserve snapshot and identity

### Guided example — Restore a library schedule

In a scratch folder.

1. Save Monday’s synthetic opening time, 09:00, in a separate backup.
2. Replace that value in a disposable rehearsal table; observe the wrong read.
3. Restore only that record and compare its digest.
4. Write the detection gap and one acceptance test.

### Quiz plan (`m7-u6-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 09:00 to 09:12? | Twelve observed minutes | Nine (wrong subtraction). Whole day (unsupported) |
| 2 | Backup exists? | Verify restored contents | Assume restore works (file alone). Use production (wrong target) |
| 3 | D-218 old issue? | Preserve snapshot and identity | Renumber all (references break). Rebuild from live marks (wrong version) |
| 4 | Unverified timeline claim? | Label as hypothesis | Call it cause (unproven). Omit times (loses sequence) |
| 5 | Follow-up missing owner? | Assign owner and acceptance test | Declare complete (unverified). Assign blame (not a control) |
| 6 | Affected scope unknown? | State uncertainty and evidence | Claim all users (unsupported). Claim zero (unsupported) |

### Lab — Incident and postmortem

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/ops/incident.md`, `docs/ops/recovery.csv` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/ops/incident.md: Impact, Timeline, Evidence, Causes, Restoration, Follow-ups. Show initial and restored staging reads and measured impact. | `report` |
| 4 | By forward migration create public.incident_drill(id bigint primary key,note text), RLS on. Learner backs up synthetic id 900001, note ZZ timetable ready, removes only that drill row and restores it persistently. Checker SELECT id::int,note FROM public.incident_drill WHERE id=900001 ORDER BY id → [{id:900001,note:'ZZ timetable ready'}]. No checker insert can mask a missing restore. | `restored` |
| 5 | Read recovery.csv columns minute,event; require nonnegative nondecreasing minutes and ordered events detected,scoped,restored,verified. Compare staging reads manually. | `timeline` |

**Finished state.** Separate observation, contributing conditions and follow-ups with owners and proof. Check with `npx academy check m7-p6`.

### Debugging lab — The wrong day

| Item | Design |
| :--- | :--- |
| Seeded | Two scratch backups hold Monday and Tuesday canaries. |
| Symptom | Row count matches but the timetable is wrong. |
| Fault (builder only) | Backup selected by filename sort. |
| Observe | Row count matches but the timetable is wrong. |
| Possible causes | Missing row, wrong key, wrong backup date. |
| Tests | Compare counts, keys and dated manifest. |
| Cause | Backup selected by filename sort. |
| Fix | Select the verified backup and compare actual contents. |
| Fixed state | Expected day and identifier both match. |

### Own build

1. Restore another isolated canary.
2. Record recovery time and loss window.
3. Assign one follow-up a verifiable condition.
4. Commit this variation. In `notes/m7-u6.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Separate observation, contributing conditions and follow-ups with owners and proof. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does AGENTS.md limit agents to staging?
2. Which D-218 evidence would show that restoration rewrote history?

**Mastery, without notes**

1. Measure downtime.
2. Identify wrong backup.
3. Read the canary via the app.
4. Defend a preventive action.

### Check plan (`m7-p6`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/ops/incident.md`, `docs/ops/recovery.csv` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| report | doc | yes | docs/ops/incident.md: Impact, Timeline, Evidence, Causes, Restoration, Follow-ups. Show initial and restored staging reads and measured impact. |
| restored | sql | yes | By forward migration create public.incident_drill(id bigint primary key,note text), RLS on. Learner backs up synthetic id 900001, note ZZ timetable ready, removes only that drill row and restores it persistently. Checker SELECT id::int,note FROM public.incident_drill WHERE id=900001 ORDER BY id → [{id:900001,note:'ZZ timetable ready'}]. No checker insert can mask a missing restore. |
| timeline | tests | yes | `tests/timeline.test.mjs` via files. Read recovery.csv columns minute,event; require nonnegative nondecreasing minutes and ordered events detected,scoped,restored,verified. Compare staging reads manually. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `report` — The report lacks evidence for impact or recovery.
- `restored` — The restored practice row differs from its backup.
- `timeline` — The incident events are missing or out of order.

### Needs

Modules 4 and 5. Use synthetic data, WSL, Node and Git. Use only the learner’s marked lab database for SQL. Learner-owned staging, redacted backup and network.

## After module 7 the learner has

A permission inventory, shared CI gate, repeatable staging deployment and evidence of service and data recovery.
