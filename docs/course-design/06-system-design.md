# Module 6 — System design

| Unit | Title | Project | Kind | Level | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 6.1 | Capacity estimate | m6-p1 | Repo | half | 420–600 | 4 |
| 6.2 | Multi-tenancy options | m6-p2 | Repo | half | 420–600 | 4 |
| 6.3 | Scaling reads and caching | m6-p3 | Repo | half | 420–660 | 5 |
| 6.4 | Queues and slow work | m6-p4 | Repo | half | 420–630 | 4 |
| 6.5 | Rate limits and abuse | m6-p5 | Repo | half | 420–600 | 4 |
| 6.6 | Design review | m6-p6 | Repo | half | 420–630 | 4 |

## Module rules (decided here)

GPIS for 50 schools is a hypothetical design on paper. Keep the learner’s running system single-school. Put case artefacts in docs/design/. Label every invented load, price and target as a case assumption, with units and date. Document checks match exact level-two headings at 25 words each. Written reasoning is self-assessed. Use project-local Node tests for executable models.

Use the eight-step sequence, review checklist and reflection in 00-guide.md. Use text diagrams. The debugging lab and own build have separate checks. For each own build commit the variation and put the comparison in `notes/<unit-id>.md`. Read GPIS after a pass, or after a written 30-minute attempt in a half-guided unit.

## File and interface contract

Print the paths and the named inputs, outputs and routes from the check plan in the corresponding lab.

| Unit | Deliverables relative to its working directory |
| :--- | :--- |
| 6.1 | docs/design/capacity.md; docs/design/capacity.csv |
| 6.2 | docs/design/tenancy.md; docs/design/tenancy.csv |
| 6.3 | docs/design/reads.md; docs/design/plans.md |
| 6.4 | docs/design/jobs.md; docs/design/job-traces.csv |
| 6.5 | docs/design/limits.md; src/lib/design/limiter.mjs |
| 6.6 | docs/design/review.md; docs/design/defence.md |

## GPIS rules used in this module

| Source in the read-only GPIS | Text to use |
| :--- | :--- |
| GPIS AGENTS.md, repository boundary | “Single school. Not multi-tenant.” |
| D-218 | “Reprint reproduces the issued snapshot”. |
| D-170 | “5 failed GPIS login attempts lock the account for 30 minutes”. |
| D-21 | “Every score references the membership record it was earned under” (GPIS AGENTS.md). |

---

## Unit 6.1 — Capacity estimate

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m6-u1` / `m6-p1` |
| title | Capacity estimate |
| module / position | 6 / 1 |
| guidance | half |
| minutes | `{ min: 420, max: 600 }` |
| gpis_part | Separate students, reports, requests and stored bytes. A weekly average hides the release hour. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Estimate a peak
2. Convert units
3. Test sensitivity

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with counting chairs for the busiest assembly; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/sre-book/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Estimate a peak | Separate students, reports, requests and stored bytes. A weekly average hides the release hour. |
| 2. Convert units | A read takes requests; storing a snapshot takes bytes. State decimal MB or binary MiB. |
| 3. Test sensitivity | Double one input at a time and name the first limit reached. |

**Text diagram** schools × pupils × reads ÷ seconds → peak rate

**Common mistakes**

1. 450 → adds different quantities → 20,000 pupils
2. 20,003 → adds counts → 60,000 reads for 20,000 reports
3. 10 → wrong decimal → 100 reads/s

### Guided example — Size a library print run

In a scratch folder.

1. (full) Use 3 libraries and 20 cards per library: 60 cards.
2. (full) At 2 pages each, the printer owes 120 pages.
3. (task) Double copies per card and recompute.
4. (task) Spread the run over two hours and compare the peak.

### Quiz plan (`m6-u1-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 50 schools × 400 pupils? | 20,000 pupils | 450 (adds different quantities). 2,000 (drops a zero) |
| 2 | 3 reads per report? | 60,000 reads for 20,000 reports | 20,003 (adds counts). 6,667 (divides) |
| 3 | 60,000 reads over 600 seconds? | 100 reads/s | 10 (wrong decimal). 600 (window is not rate) |
| 4 | Bytes to decimal MB? | Divide by 1,000,000 | Multiply (inverse). Divide by 1,024 (KiB only) |
| 5 | D-218 reprint of one issue? | Read its stored snapshot | Issue again (extra writes). Read live draft (wrong source) |
| 6 | Peak doubled at same total? | Shorter release window can explain it | More storage always required (same reports). More pupils required (same total) |

### Lab — Capacity estimate

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/design/capacity.md`, `docs/design/capacity.csv` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/design/capacity.md: Schools, Peak window, Storage, Sensitivity. Include requests, rows, active users and storage assumptions with units. | `assumptions` |
| 4 | Read capacity.csv with header schools,pupils_per_school,staff_per_school,rows_per_report,reads_per_report,bytes_per_report,window_s,pupils,staff,rows,rps,bytes. Base row inputs 50,400,20,8,3,12000,600 must yield 20000,1000,160000,100,240000000. Second row changes window to 300 and rps to 200. Recompute each output from inputs; reject missing or non-finite cells. | `totals` |

**Hints (folded).** Compare the first and last inputs in the worked example. Read the named GPIS decision after a written attempt.

**Finished state.** Both CSV rows reconcile with the written assumptions. Check with `npx academy check m6-p1`.

### Debugging lab — The impossible peak

| Item | Design |
| :--- | :--- |
| Seeded | CSV has 600 seconds but formula divides by 10. |
| Symptom | Estimate says 6,000 requests/s. |
| Fault (builder only) | Minutes are treated as seconds. |
| Observe | Estimate says 6,000 requests/s. |
| Possible causes | Wrong pupil count, requests per card, time unit. |
| Tests | Recompute each factor, inspect column units, compare to a one-second example. |
| Cause | Minutes are treated as seconds. |
| Fix | Use seconds throughout the rate calculation. |
| Fixed state | 60,000 requests give 100/s. |

### Own build

1. Estimate a second release hour.
2. Hold the pupil count fixed and vary only cache hits.
3. State a measurement that would replace the guessed hit rate.
4. Commit this variation. In `notes/m6-u1.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Both CSV rows reconcile with the written assumptions. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-218 make reprints a separate read workload?
2. Which assumption changes first if the single-school boundary in GPIS AGENTS.md is relaxed?

**Mastery, without notes**

1. Recompute the base row.
2. Halve the window.
3. Convert bytes to MB.
4. Explain one uncertainty with a testable prediction.

**Debugging-lab check** (`m6-p1-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m6-p1-own`). Recompute both release-hour estimates from the recorded assumptions. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m6-p1`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/design/capacity.md`, `docs/design/capacity.csv` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| assumptions | doc | yes | docs/design/capacity.md: Schools, Peak window, Storage, Sensitivity. Include requests, rows, active users and storage assumptions with units. |
| totals | tests | yes | `tests/totals.test.mjs` via files. Read capacity.csv with header schools,pupils_per_school,staff_per_school,rows_per_report,reads_per_report,bytes_per_report,window_s,pupils,staff,rows,rps,bytes. Base row inputs 50,400,20,8,3,12000,600 must yield 20000,1000,160000,100,240000000. Second row changes window to 300 and rps to 200. Recompute each output from inputs; reject missing or non-finite cells. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `assumptions` — A capacity assumption or sensitivity section is absent.
- `totals` — The estimates do not reconcile with the stated inputs.

### Needs

Modules 4 and 5 for the data model. WSL, Git and Node. Offline unless the unit names the lab database.

---

## Unit 6.2 — Multi-tenancy options

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m6-u2` / `m6-p2` |
| title | Multi-tenancy options |
| module / position | 6 / 2 |
| guidance | half |
| minutes | `{ min: 420, max: 600 }` |
| gpis_part | Follow one request through authentication, storage and restore. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Trace a school boundary
2. Compare three designs
3. Defend a choice

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with two schools sharing a building with separate cupboards; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/sre-book/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Trace a school boundary | Follow one request through authentication, storage and restore. |
| 2. Compare three designs | Separate databases, separate schemas and shared school-keyed rows impose different operational costs. |
| 3. Defend a choice | Name a condition that would reverse the choice and the migration that would then be needed. |

**Text diagram** request → school identity → storage boundary → restore boundary

**Common mistakes**

1. Apply once → independent databases → Track 50 applications
2. Automatic tenant filter → must exist → Boundary can fail
3. Separate servers → schemas share server → One database can still be a common failure point

### Guided example — Store three libraries’ catalogues

In a scratch folder.

1. (full) Draw a separate box per catalogue and restore one box.
2. (full) Move to one shared table with a library key and mark every dependent key.
3. (task) Try a single-library restore on paper.
4. (task) Write down which choice meets a one-hour restore target.

### Quiz plan (`m6-u2-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 50 databases need a migration? | Track 50 applications | Apply once (independent databases). Skip 49 (leaves drift) |
| 2 | One shared table with an unscoped read? | Boundary can fail | Automatic tenant filter (must exist). Separate backup per row (unrelated) |
| 3 | One schema per school? | One database can still be a common failure point | Separate servers (schemas share server). No migration (schema still evolves) |
| 4 | Restore one school? | Include references and test isolation | Restore everything (affects others). Only restore names (loses relations) |
| 5 | D-21 score after a move? | Keep the original membership | Use latest class (history changes). Duplicate across schools (not a transfer rule) |
| 6 | GPIS itself? | Single school by design | Already shared (no tenant contract). Must change now (paper case only) |

### Lab — Multi-tenancy options

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/design/tenancy.md`, `docs/design/tenancy.csv` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/design/tenancy.md: Isolation, Cost, Migrations, RLS, Backup, Restore, Decision. Compare all three options in every section. | `options` |
| 4 | Parse tenancy.csv with columns option,isolation,cost,migrations,rls,backup,restore. Require exactly database,schema,shared in option; six non-empty comparisons per row. Human review traces restore and cross-school refusal for the chosen option. | `matrix` |

**Hints (folded).** Compare the first and last inputs in the worked example. Read the named GPIS decision after a written attempt.

**Finished state.** The matrix covers all three options and six operational criteria. Check with `npx academy check m6-p2`.

### Debugging lab — A restore that replaces two schools

| Item | Design |
| :--- | :--- |
| Seeded | Scratch restore plan has shared tables A,B and backup containing both. |
| Symptom | Restoring A changes B’s row count. |
| Fault (builder only) | Plan restores the whole shared table. |
| Observe | Restoring A changes B’s row count. |
| Possible causes | Backup scope, foreign key, command scope. |
| Tests | Inventory backup keys, trace references, simulate both before/after counts. |
| Cause | Plan restores the whole shared table. |
| Fix | Stage and validate the selected school’s rows. |
| Fixed state | B retains its original record set. |

### Own build

1. Compare school transfer and deletion boundaries.
2. Write a restore acceptance test.
3. State which option would be cheaper at two schools.
4. Commit this variation. In `notes/m6-u2.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** The matrix covers all three options and six operational criteria. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Which requirement in GPIS AGENTS.md makes tenant keys unnecessary there?
2. Why would D-21 membership references also need isolation in a shared case?

**Mastery, without notes**

1. Trace one cross-school refusal.
2. Count migration applications.
3. Draw one-school restore.
4. Defend a different option under a changed constraint.

**Debugging-lab check** (`m6-p2-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m6-p2-own`). Check the transfer, restore and two-school cost evidence in the comparison. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m6-p2`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/design/tenancy.md`, `docs/design/tenancy.csv` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| options | doc | yes | docs/design/tenancy.md: Isolation, Cost, Migrations, RLS, Backup, Restore, Decision. Compare all three options in every section. |
| matrix | tests | yes | `tests/matrix.test.mjs` via files. Parse tenancy.csv with columns option,isolation,cost,migrations,rls,backup,restore. Require exactly database,schema,shared in option; six non-empty comparisons per row. Human review traces restore and cross-school refusal for the chosen option. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `options` — The decision omits an operational boundary.
- `matrix` — The comparison lacks a design or criterion.

### Needs

Modules 4 and 5 for the data model. WSL, Git and Node. Offline unless the unit names the lab database.

---

## Unit 6.3 — Scaling reads and caching

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m6-u3` / `m6-p3` |
| title | Scaling reads and caching |
| module / position | 6 / 3 |
| guidance | half |
| minutes | `{ min: 420, max: 660 }` |
| gpis_part | Compare roster, class ranking and document reprint using the same school size and request mix. |
| requires | [wsl, node, git, supabase, lab-db] |

### Outcomes

After this unit you can

1. Measure three reads
2. Choose a cache key
3. Read a query plan

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a copied timetable after a lesson changes rooms; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/sre-book/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Measure three reads | Compare roster, class ranking and document reprint using the same school size and request mix. |
| 2. Choose a cache key | Include school, role scope, class, term and issue version where relevant. |
| 3. Read a query plan | Compare scanned rows and buffers on equal data. A small table may favour a sequential scan. |

**Text diagram** read → scoped key → hit or database → event invalidation

**Common mistakes**

1. Student alone → many issues → Issue id plus scope
2. Use bare class id → collision → Include school in cache key
3. Always expected → index changes access path → Investigate query or data mismatch

### Guided example — Cache a library catalogue

In a scratch folder.

1. (full) Measure a title lookup on 10,000 synthetic books. Keep the plan.
2. (full) Add a matching index in a transaction; repeat the lookup and compare results.
3. (task) Change an edition and identify its cache key.
4. (task) Compare frozen editions and current stock.

### Quiz plan (`m6-u3-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | A reprint cache key under D-218? | Issue id plus scope | Student alone (many issues). Today’s date (unrelated) |
| 2 | Same class number at 50 schools? | Include school in cache key | Use bare class id (collision). Use display colour (no identity) |
| 3 | Index changes the returned rows? | Investigate query or data mismatch | Always expected (index changes access path). Accept faster result (wrong rows) |
| 4 | TTL 60 seconds? | A stale value can survive until expiry | Always fresh (time passes). Always stale (new entry starts fresh) |
| 5 | Few rows read? | Sequential scan can cost less | Force index always (overhead). Delete plan evidence (need comparison) |
| 6 | Issue Updated? | Invalidate current pointers, retain old issue | Delete old snapshot (breaks reprint). Share draft key (wrong state) |

### Lab — Scaling reads and caching

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/design/reads.md`, `docs/design/plans.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/design/reads.md: Measurements, Keys, Expiry, Invalidation. Give three measured queries, sample size, unit, TTL and invalidating event for each. | `policy` |
| 4 | docs/design/plans.md: Before, After, Limits. Include equal row count, query, both plans and matched results. | `plan` |
| 5 | In checker scratch schema create zz_reads(id int,school int,term int); populate ids 900001..910000, school=(id%50), term=(id%3). ANALYZE; EXPLAIN (FORMAT JSON) SELECT id FROM zz_reads WHERE school=1 AND term=1 ORDER BY id; expect one plan row. Create index on (school,term,id); ANALYZE; repeat EXPLAIN, one row. SELECT count(*)::int AS n FROM zz_reads WHERE school=1 AND term=1 → 67. The learner supplies independently captured plans in plans.md; no fixed planner choice is graded. | `index` |

**Hints (folded).** Compare the first and last inputs in the worked example. Read the named GPIS decision after a written attempt.

**Finished state.** The learner records two plans and three scoped cache policies. Check with `npx academy check m6-p3`.

### Debugging lab — The wrong term’s ranking

| Item | Design |
| :--- | :--- |
| Seeded | Cache contains rank for term 1, then request term 2 for same class. |
| Symptom | Both terms show the first ranking. |
| Fault (builder only) | Term is missing from the key. |
| Observe | Both terms show the first ranking. |
| Possible causes | Identical marks, stale database view, colliding key. |
| Tests | Compare raw rows, bypass cache, print both keys. |
| Cause | Term is missing from the key. |
| Fix | Add term to read identity and exercise invalidation. |
| Fixed state | Distinct terms retain distinct results. |

### Own build

1. Measure a fourth read.
2. Specify its freshness budget.
3. Demonstrate one event that invalidates it.
4. Commit this variation. In `notes/m6-u3.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** The learner records two plans and three scoped cache policies. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why can a D-218 issued snapshot use a longer lifetime than a preview?
2. Why does D-21 require period membership in a roster key?

**Mastery, without notes**

1. Recompute a hit rate.
2. Describe a cold read.
3. Compare two plans.
4. Predict the result after an issue update.

**Debugging-lab check** (`m6-p3-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m6-p3-own`). Compare the fourth read before and after the recorded invalidation event. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m6-p3`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/design/reads.md`, `docs/design/plans.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| policy | doc | yes | docs/design/reads.md: Measurements, Keys, Expiry, Invalidation. Give three measured queries, sample size, unit, TTL and invalidating event for each. |
| plan | doc | yes | docs/design/plans.md: Before, After, Limits. Include equal row count, query, both plans and matched results. |
| index | sql | yes | In checker scratch schema create zz_reads(id int,school int,term int); populate ids 900001..910000, school=(id%50), term=(id%3). ANALYZE; EXPLAIN (FORMAT JSON) SELECT id FROM zz_reads WHERE school=1 AND term=1 ORDER BY id; expect one plan row. Create index on (school,term,id); ANALYZE; repeat EXPLAIN, one row. SELECT count(*)::int AS n FROM zz_reads WHERE school=1 AND term=1 → 67. The learner supplies independently captured plans in plans.md; no fixed planner choice is graded. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `policy` — The cache plan lacks a read, key or invalidation event.
- `plan` — The before/after measurement is incomplete.
- `index` — The comparison query or index fixture gave inconsistent results.

### Needs

Modules 4 and 5 for the data model. WSL, Git and Node. Offline unless the unit names the lab database. Marked Supabase lab only; use the module 4 transaction guard.

---

## Unit 6.4 — Queues and slow work

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m6-u4` / `m6-p4` |
| title | Queues and slow work |
| module / position | 6 / 4 |
| guidance | half |
| minutes | `{ min: 420, max: 630 }` |
| gpis_part | A request returns a job identity. The worker finishes a PDF or sends an SMS later. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Separate request and worker
2. Handle delivery twice
3. Describe recovery

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with jobs waiting their turn at one printer; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/sre-book/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Separate request and worker | A request returns a job identity. The worker finishes a PDF or sends an SMS later. |
| 2. Handle delivery twice | A stable job key ties retries to one logical delivery. A provider may accept before its acknowledgement arrives. |
| 3. Describe recovery | Track attempts, final failure and a useful user-visible state. |

**Text diagram** request → durable job → worker → receipt → ready

**Common mistakes**

1. Always failed → provider may have acted → Outcome may be unknown
2. Same key implicitly → different string → Can create a second delivery
3. Use latest draft → content changes → Render its issued snapshot

### Guided example — Queue library labels

In a scratch folder.

1. (full) Enqueue label L1 twice with one request key. Record one job.
2. (full) Let the printer finish, then lose its acknowledgement.
3. (task) Reconcile printer reference before retrying.
4. (task) Surface an unknown outcome where the printer cannot reconcile.

### Quiz plan (`m6-u4-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Lost acknowledgement? | Outcome may be unknown | Always failed (provider may have acted). Always retry now (may duplicate) |
| 2 | Retry uses a new key? | Can create a second delivery | Same key implicitly (different string). No effect (provider may accept) |
| 3 | D-218 old PDF? | Render its issued snapshot | Use latest draft (content changes). Update original (history breaks) |
| 4 | Worker crashes before starting? | Another worker may reclaim expired lease | Mark sent (no receipt). Lose job (persistent queue) |
| 5 | Three retries exhausted? | Expose terminal failure and evidence | Spin forever (no bound). Show success (false) |
| 6 | Which work stays on request? | Validate, authorise and durably enqueue | Send all SMS (blocks request). Trust school from form (scope missing) |

### Lab — Queues and slow work

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/design/jobs.md`, `docs/design/job-traces.csv` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/design/jobs.md: PDF, SMS, Retry, Duplicate, User states. Give text sequences for success, duplicate and lost acknowledgement. | `design` |
| 4 | Read job-traces.csv columns case,key,attempt,outcome,user_state. Require pdf-success,P1,1,stored,ready; sms-unknown,S1,1,no_ack,reconciling; sms-reconciled,S1,2,receipt,sent; duplicate,P1,2,existing,ready. No fresh key on a retry. | `traces` |

**Hints (folded).** Compare the first and last inputs in the worked example. Read the named GPIS decision after a written attempt.

**Finished state.** Both job types have a duplicate rule and a visible failure state. Check with `npx academy check m6-p4`.

### Debugging lab — The second text message

| Item | Design |
| :--- | :--- |
| Seeded | Provider ledger has receipt R1. Worker times out after provider acceptance. |
| Symptom | A parent receives two notices. |
| Fault (builder only) | Retry generates a new provider key. |
| Observe | A parent receives two notices. |
| Possible causes | Two pupils, two jobs, two provider keys. |
| Tests | Count recipients, count logical jobs, compare attempt identifiers. |
| Cause | Retry generates a new provider key. |
| Fix | Reconcile receipt and reuse the logical key. |
| Fixed state | One recipient, one successful delivery. |

### Own build

1. Design a failed PDF queue view.
2. Show last attempt and request id.
3. Separate retryable and terminal errors.
4. Commit this variation. In `notes/m6-u4.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Both job types have a duplicate rule and a visible failure state. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why should a queued reprint carry the D-218 issue id?
2. Which D-21 record determines the class printed later?

**Mastery, without notes**

1. Trace a lost ack.
2. Name a deduplication key.
3. Draw a lease expiry.
4. State what a parent sees while delivery is uncertain.

**Debugging-lab check** (`m6-p4-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m6-p4-own`). Check the queue example includes both retryable and terminal outcomes. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m6-p4`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/design/jobs.md`, `docs/design/job-traces.csv` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| design | doc | yes | docs/design/jobs.md: PDF, SMS, Retry, Duplicate, User states. Give text sequences for success, duplicate and lost acknowledgement. |
| traces | tests | yes | `tests/traces.test.mjs` via files. Read job-traces.csv columns case,key,attempt,outcome,user_state. Require pdf-success,P1,1,stored,ready; sms-unknown,S1,1,no_ack,reconciling; sms-reconciled,S1,2,receipt,sent; duplicate,P1,2,existing,ready. No fresh key on a retry. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `design` — The design misses a job or recovery path.
- `traces` — A retry trace lost its identity or user state.

### Needs

Modules 4 and 5 for the data model. WSL, Git and Node. Offline unless the unit names the lab database.

---

## Unit 6.5 — Rate limits and abuse

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m6-u5` / `m6-p5` |
| title | Rate limits and abuse |
| module / position | 6 / 5 |
| guidance | half |
| minutes | `{ min: 420, max: 600 }` |
| gpis_part | State the identity, endpoint, period and maximum for each operation. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Define a budget
2. Calculate a boundary
3. Explain feedback

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with sharing office time among several classes; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/sre-book/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Define a budget | State the identity, endpoint, period and maximum for each operation. |
| 2. Calculate a boundary | Use a supplied clock in milliseconds. At the start of a new window the previous budget expires. |
| 3. Explain feedback | Return a bounded retry time without revealing private information. |

**Text diagram** identity + operation + window → allowance → retry time

**Common mistakes**

1. Grant because third is near two → over limit → Refuse until the next window
2. Wait another window → off by one → Reset that bucket
3. 30-second endpoint delay → different control → 30-minute account lock

### Guided example — Limit print credits

In a scratch folder.

1. (full) Give each library desk two previews per fixed ten-second window.
2. (full) Two requests at 0 and 1 succeed; at 2 the desk waits until 10.
3. (task) Try a second desk in the same window.
4. (task) Retry the first at the exact boundary.

### Quiz plan (`m6-u5-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Third of two allowed? | Refuse until the next window | Grant because third is near two (over limit). Lock forever (bounded window) |
| 2 | Clock reaches next window? | Reset that bucket | Wait another window (off by one). Reset every endpoint (separate keys) |
| 3 | D-170 fifth wrong password? | 30-minute account lock | 30-second endpoint delay (different control). Five-minute lock (wrong duration) |
| 4 | Key only by IP? | Shared networks may penalise other users | Always identifies staff (shared IP). Proves a role (no identity proof) |
| 5 | One export and one search? | Separate operation budgets | One anonymous counter for all (wrong scope). Unlimited exports (expensive) |
| 6 | Why test a fake clock? | Repeat exact window boundaries | Make network faster (no network). Remove time checks (time is input) |

### Lab — Rate limits and abuse

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/design/limits.md`, `src/lib/design/limiter.mjs` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/design/limits.md: Login, Search, Export, Limit response. Give key, limit, window, false-positive cost and retry message for each. Label case budgets as assumptions. | `rationale` |
| 4 | Import createLimiter({limit:2,windowMs:10000}) from limiter.mjs, call take(key,nowMs). For key A at 0,9998,9999,10000 expect allowed true,true,false,true. Third retryAfterMs=1. Key B at 9999 allowed. New instance repeats independently. | `limiter` |

**Hints (folded).** Compare the first and last inputs in the worked example. Read the named GPIS decision after a written attempt.

**Finished state.** A deterministic limiter enforces the measured case budgets. Check with `npx academy check m6-p5`.

### Debugging lab — The shared refusal

| Item | Design |
| :--- | :--- |
| Seeded | Two desks use distinct keys but share a counter. |
| Symptom | The second desk gets refused on its first preview. |
| Fault (builder only) | Storage ignores the supplied key. |
| Observe | The second desk gets refused on its first preview. |
| Possible causes | Time moved, repeated request, shared state. |
| Tests | Freeze the clock, log calls by desk, compare bucket ids. |
| Cause | Storage ignores the supplied key. |
| Fix | Keep a bucket per key and window. |
| Fixed state | Both desks receive two independent credits. |

### Own build

1. Design an export budget for report week.
2. Show a retry time in seconds.
3. State one fairness cost and how to measure it.
4. Commit this variation. In `notes/m6-u5.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** A deterministic limiter enforces the measured case budgets. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. How is a request budget different from D-170’s consecutive failure lock?
2. Which GPIS security rule establishes caller identity before a private read?

**Mastery, without notes**

1. Test one millisecond before expiry.
2. Test the boundary.
3. Test two keys.
4. Explain a shared-network false positive.

**Debugging-lab check** (`m6-p5-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m6-p5-own`). Check the export budget units and recompute its retry delay. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m6-p5`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/design/limits.md`, `src/lib/design/limiter.mjs` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| rationale | doc | yes | docs/design/limits.md: Login, Search, Export, Limit response. Give key, limit, window, false-positive cost and retry message for each. Label case budgets as assumptions. |
| limiter | tests | yes | `tests/limiter.test.mjs` via files. Import createLimiter({limit:2,windowMs:10000}) from limiter.mjs, call take(key,nowMs). For key A at 0,9998,9999,10000 expect allowed true,true,false,true. Third retryAfterMs=1. Key B at 9999 allowed. New instance repeats independently. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `rationale` — An endpoint lacks a justified budget.
- `limiter` — The limiter failed a boundary or mixed two identities.

### Needs

Modules 4 and 5 for the data model. WSL, Git and Node. Offline unless the unit names the lab database.

---

## Unit 6.6 — Design review

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m6-u6` / `m6-p6` |
| title | Design review |
| module / position | 6 / 6 |
| guidance | half |
| minutes | `{ min: 420, max: 630 }` |
| gpis_part | Follow report week across storage, cache and queue capacity. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Connect assumptions to decisions
2. Defend a trade-off
3. Revise after evidence

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with defending a building plan before construction; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/sre-book/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Connect assumptions to decisions | Follow report week across storage, cache and queue capacity. |
| 2. Defend a trade-off | Compare an alternative against an explicit measurable constraint. |
| 3. Revise after evidence | Identify which measurements would change the choice and who would act. |

**Text diagram** assumption → decision → consequence → evidence → revision

**Common mistakes**

1. Double every latency → not linear → Recompute affected estimates
2. Hide alternatives → weak defence → Specify measurable evidence
3. Mutable preview → changes → Issued snapshot

### Guided example — Defend a library kiosk

In a scratch folder.

1. (full) Choose local caching for ten kiosks with intermittent links.
2. (full) Test a closure notice that must reach every desk in one minute.
3. (task) Describe what breaks when a link is down for an hour.
4. (task) Revise the decision and record the cost.

### Quiz plan (`m6-u6-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 50 schools doubled to 100? | Recompute affected estimates | Double every latency (not linear). Keep totals unchanged (load changes) |
| 2 | Decision has no reversal condition? | Specify measurable evidence | Hide alternatives (weak defence). Give a date alone (not evidence) |
| 3 | Which GPIS D-218 data stays fixed? | Issued snapshot | Mutable preview (changes). Draft (still editable) |
| 4 | One-school restore? | Demonstrate other schools remain intact | Restore whole fleet (different objective). Check uptime only (misses data) |
| 5 | Worst-case SMS outcome unknown? | Discuss reconciliation | Assume exactly once (no receipt). Hide failures (no recovery) |
| 6 | Graph labelled fast? | Add unit, workload and window | Add colour (no unit). Use one average (hides peaks) |

### Lab — Design review

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/design/review.md`, `docs/design/defence.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/design/review.md: Goal, Capacity, Isolation, Reads, Jobs, Limits, Failure, Decision. Link 6.1–6.5 and trace one report from request to reprint. | `review` |
| 4 | docs/design/defence.md: Alternative, Evidence, Reversal, Self-review. Include a checked item for each prior unit and a written answer to a restore, stale-read and duplicate-job challenge. | `defence` |

**Hints (folded).** Compare the first and last inputs in the worked example. Read the named GPIS decision after a written attempt.

**Finished state.** A reader can follow one report through all five earlier design decisions. Check with `npx academy check m6-p6`.

### Debugging lab — The defence uses last term’s figures

| Item | Design |
| :--- | :--- |
| Seeded | Review claims 40 schools; capacity sheet uses 50 and gives 20,000 pupils. |
| Symptom | Slide and estimate disagree. |
| Fault (builder only) | Narrative copied an earlier assumption. |
| Observe | Slide and estimate disagree. |
| Possible causes | Wrong worksheet, rounding, obsolete narrative. |
| Tests | Check CSV inputs, recalculate base, compare quoted number. |
| Cause | Narrative copied an earlier assumption. |
| Fix | Update the cited baseline and dependent tables. |
| Fixed state | One report traces the same load from ingress to storage. |

### Own build

1. Defend an outage-day design.
2. Include a measurable recovery goal.
3. Name a rejected design and a condition to reconsider it.
4. Commit this variation. In `notes/m6-u6.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** A reader can follow one report through all five earlier design decisions. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does GPIS AGENTS.md defer multi-tenancy?
2. Which D-218 guarantee would be lost if reprints read live data?

**Mastery, without notes**

1. Recalculate one headline number.
2. Trace one recovery.
3. Defend one rejected option.
4. Name evidence that would reverse the decision.

**Debugging-lab check** (`m6-p6-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m6-p6-own`). Read the recovery target and verify that the rejected option has a stated reconsideration condition. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m6-p6`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/design/review.md`, `docs/design/defence.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| review | doc | yes | docs/design/review.md: Goal, Capacity, Isolation, Reads, Jobs, Limits, Failure, Decision. Link 6.1–6.5 and trace one report from request to reprint. |
| defence | doc | yes | docs/design/defence.md: Alternative, Evidence, Reversal, Self-review. Include a checked item for each prior unit and a written answer to a restore, stale-read and duplicate-job challenge. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `review` — The review omits part of the design.
- `defence` — The defence lacks an alternative, evidence or reversal point.

### Needs

Modules 4 and 5 for the data model. WSL, Git and Node. Offline unless the unit names the lab database.

## After module 6 the learner has

A six-part design and a written defence for the 50-school case, with reproducible arithmetic, a query-plan comparison and a tested limiter.
