# Module 9 — Capstone

| Unit | Title | Project | Kind | Level | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 9.1 | Proposal | m9-p1 | Repo | independent | 780–1140 | 4 |
| 9.2 | MVP specification | m9-p2 | Repo | independent | 900–1380 | 4 |
| 9.3 | Implementation plan | m9-p3 | Repo | independent | 720–1080 | 5 |
| 9.4 | Build and review | m9-p4 | Repo | independent | 1680–2520 | 8 |
| 9.5 | Release and defence | m9-p5 | Repo | independent | 900–1380 | 5 |

## Module rules (decided here)

Use only synthetic records. Check SQL against the marked practice database. Each sql step sets up its own rows, uses qualified public names, and rolls back. Use the module 4 fixtures and claims for ADMIN and ASSESSMENT. Use the guide §10.4 allocation table and names beginning ZZ. Counts are integers, money and dates are text, and lists have explicit ordering. Page checks use a learner-started app at http://localhost:3000, status 200, 360 × 780, no sideways scroll and 44px controls. Use local page actions for browser interactions. Use separate synthetic role sessions in ignored local storage-state files, never a test bypass in the app. Independent. Deliver BOTH the Creche–JHS 2 report card and the JHS 3 results slip, plus exactly one workstream. Record teacher, fees or books as the sole word in docs/capstone/track.txt. The branch requirements below are course-sized slices of the corresponding GPIS workflows. Teacher: an active year-bound assignment gives access to the assigned class only and an ended assignment denies access. Fees: settle original-period debt with immutable exact-GHS allocations, reject overpayment and replay the same request safely. Books: sell against available stock, keep a separate ledger and receipt, and prove exactly one success for the last copy. Use a server action, database enforcement, a phone view and a refusal for the chosen slice. Documents need 25 words per named heading unless a limit is given. A pass includes a self-assessed oral defence without notes.

Use the eight-step sequence, review checklist and reflection in 00-guide.md. Use text diagrams. The debugging lab and own build have separate checks. For each own build commit the variation and put the comparison in `notes/<unit-id>.md`. Read GPIS after a pass, or after a written 30-minute attempt in a half-guided unit.

## File and interface contract

Print the paths and the named inputs, outputs and routes from the check plan in the corresponding lab.

| Unit | Deliverables relative to its working directory |
| :--- | :--- |
| 9.1 | docs/capstone/proposal.md; docs/capstone/track.txt |
| 9.2 | docs/capstone/spec.md; tests/capstone/core.test.mjs; tests/capstone/track.test.mjs |
| 9.3 | docs/capstone/plan.md; docs/capstone/tasks.csv |
| 9.4 | src/lib/capstone/results.ts; src/app/capstone/page.tsx; docs/capstone/review.md |
| 9.5 | README.md; docs/capstone/release.md; docs/capstone/defence.md |

## GPIS rules used in this module

| Source in the read-only GPIS | Text to use |
| :--- | :--- |
| D-01, D-02, D-03, D-04, D-10 | “Ties share a position; the next position skips ahead by the number of tied students.” Rank active open members in one class on subject totals. Incomplete subjects add nothing. Creche–JHS 2 uses D-01 remarks. |
| D-10, D-162, D-171, D-27, D-80 | “Missing subject scores print blank”. Creche–JHS 2 CA 60 scales to 50 and exam to 50. Use stored maxima, including JHS Integrated Science out of 140. JHS 3 uses a mock sitting and CA 30 plus scaled exam 70. |
| D-81 and D-218 | “No class position, and no D-01 remark words.” All cores and the best two electives determine raw and aggregate. Only submitted subject rows feed a result. An incomplete slip can print unofficially; an official issue needs completion. |
| D-218, D-07, D-33, D-34 | “Reprint reproduces the issued snapshot”. Print reports through a shared portrait A4 layer. ID card sheets are the exception. |
| D-97 and D-105 | “Class Teacher functionality is now part of the GPIS MVP”. Assignments are year-bound, time-bound and one-to-one while active. |
| D-90 and D-124 | “All amounts remain exact GHS.” Fees settle oldest original debt first. Allocation lines are immutable. |
| D-113 to D-116 | “Sale, frozen items, stock, movements and audit commit together or all roll back.” Books has its own ledger and receipt identity. |
| D-254, D-257, D-266 | “One phone bottom bar for every role”. Score entry uses one bottom action; show one main action on a calm screen. |

---

## Unit 9.1 — Proposal

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m9-u1` / `m9-p1` |
| title | Proposal |
| module / position | 9 / 1 |
| guidance | independent |
| minutes | `{ min: 780, max: 1140 }` |
| gpis_part | Identify who enters, issues and reprints the report and who owns the option workflow. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Define a user problem
2. Bound the deliverable
3. Defend two trade-offs

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with asking whom a new register will help; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/workbook/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Define a user problem | Identify who enters, issues and reprints the report and who owns the option workflow. |
| 2. Bound the deliverable | Name both document types, one chosen option and explicit exclusions. |
| 3. Defend two trade-offs | Pair each decision with an alternative, its cost and a testable risk. |

**Text diagram** user need → core + one option → exclusions → risk

**Common mistakes**

1. Zero → missing scope → Exactly one beside report cards
2. Rank by aggregate → not a slip field → No class position
3. Everyone with a link → scope unproved → Name an authorised document user

### Guided example — A community library project

In a scratch folder.

1. Define a librarian’s need to issue and reprint loan slips.
2. Choose one addition, overdue reminders, and exclude membership billing.
3. Compare batch and immediate reminders on delivery cost.
4. Identify duplicate delivery as a risk and name its test.

### Quiz plan (`m9-u1-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | How many optional workstreams? | Exactly one beside report cards | Zero (missing scope). All three (outside scope) |
| 2 | JHS 3 under D-81? | No class position | Rank by aggregate (not a slip field). Use D-01 words (different scale) |
| 3 | Who owns reprint? | Name an authorised document user | Everyone with a link (scope unproved). Database owner by default (unnecessary privilege) |
| 4 | Risk statement? | Give failure, impact and a test | Only a feature title (no failure). Only a deadline (no test) |
| 5 | Two choices with no cost? | State what each gives up | Choose both (evades trade-off). Remove alternative (no comparison) |
| 6 | What can section checks prove? | Presence and length | Correctness of reasoning (human review). Working app (not built yet) |

### Lab — Proposal

Open with what the learner is building and why. Use the numbered requirements below as the steps. State the observable result of each numbered step. Fold each hint and suggest trying for 30 minutes first. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/capstone/proposal.md`, `docs/capstone/track.txt` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/capstone/proposal.md headings Problem, Users, Scope, Exclusions, Trade-offs, Risks. Require both core documents, chosen slice, two trade-offs and two risks in human review. | `proposal` |
| 4 | Read track.txt trimmed. Exactly one of teacher,fees,books. In proposal Scope repeat that choice and name Report card and Results slip. | `track` |

**Finished state.** Pair each decision with an alternative, its cost and a testable risk. Check with `npx academy check m9-p1`.

### Debugging lab — Two projects in one proposal

| Item | Design |
| :--- | :--- |
| Seeded | Scratch proposal selects fees but lists stock sales as required. |
| Symptom | Acceptance list now needs two optional modules. |
| Fault (builder only) | The exclusions contradict the scope. |
| Observe | Acceptance list now needs two optional modules. |
| Possible causes | Wrong track file, vague story, contradictory requirement. |
| Tests | Compare track label, scope and exclusions line by line. |
| Cause | The exclusions contradict the scope. |
| Fix | Keep one option and move the other outside scope. |
| Fixed state | Every required outcome maps to core or chosen slice. |

### Own build

1. Write a one-paragraph sponsor brief.
2. Name a measurable success condition.
3. Include a risk a non-technical reader can recognise.
4. Commit this variation. In `notes/m9-u1.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Pair each decision with an alternative, its cost and a testable risk. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-81 distinguish a slip from a report card?
2. Which decision sets the boundary of your chosen slice: D-97, D-124 or D-113?

**Mastery, without notes**

1. State scope from memory.
2. Name one exclusion.
3. Defend two decisions.
4. Describe one failing outcome.

**Debugging-lab check** (`m9-p1-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m9-p1-own`). Inspect the sponsor brief for a measurable outcome and the named risk. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m9-p1`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/capstone/proposal.md`, `docs/capstone/track.txt` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| proposal | doc | yes | docs/capstone/proposal.md headings Problem, Users, Scope, Exclusions, Trade-offs, Risks. Require both core documents, chosen slice, two trade-offs and two risks in human review. |
| track | tests | yes | `tests/track.test.mjs` via files. Read track.txt trimmed. Exactly one of teacher,fees,books. In proposal Scope repeat that choice and name Report card and Results slip. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `proposal` — A proposal section is missing or too short.
- `track` — The proposal and chosen workstream disagree.

### Needs

Modules 1–8, especially 5.6, 7.4 and 8.2. WSL, Git and Node. All evidence uses synthetic school data.

---

## Unit 9.2 — MVP specification

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m9-u2` / `m9-p2` |
| title | MVP specification |
| module / position | 9 / 2 |
| guidance | independent |
| minutes | `{ min: 900, max: 1380 }` |
| gpis_part | Specify 3–5 stories with role, initial state, action and visible outcome. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Write observable stories
2. Trace data lineage
3. Specify refusal and retry

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with agreeing what the first register must contain; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/workbook/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Write observable stories | Specify 3–5 stories with role, initial state, action and visible outcome. |
| 2. Trace data lineage | Trace a membership and sitting through submitted scores into a frozen issue. |
| 3. Specify refusal and retry | Capture an unauthorised operation, missing data, and the chosen option’s boundary. |

**Text diagram** story → data boundary → acceptance assertion

**Common mistakes**

1. Best one → wrong count → Best two by final score
2. Count code lines → implementation metric → Add observable acceptance evidence
3. Current class → later move changes history → The one covering the period under D-21

### Guided example — Specify a library return kiosk

In a scratch folder.

1. Describe returning a book already on loan and the expected receipt.
2. Write a variant for an unknown copy that leaves loan state unchanged.
3. Draw the copy-to-loan relationship and the receipt snapshot.
4. Name one acceptance test that starts red because the feature is absent.

### Quiz plan (`m9-u2-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | D-81 all core plus how many electives? | Best two by final score | Best one (wrong count). All electives (wrong set) |
| 2 | Story without an outcome? | Add observable acceptance evidence | Count code lines (implementation metric). Call it done (untestable) |
| 3 | Which membership for a result? | The one covering the period under D-21 | Current class (later move changes history). Text label (no identity) |
| 4 | A failing acceptance test before build? | Expected if it asserts missing behaviour | Delete it (loses spec). Replace with true (no test) |
| 5 | Unauthorised attempt? | Require denial and unchanged state | Check button only (server may accept). Check status alone (could still write) |
| 6 | Blank score? | Preserve as missing | Coerce to zero (actual mark). Use class mean (invented result) |

### Lab — MVP specification

Open with what the learner is building and why. Use the numbered requirements below as the steps. State the observable result of each numbered step. Fold each hint and suggest trying for 30 minutes first. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/capstone/spec.md`, `tests/capstone/core.test.mjs`, `tests/capstone/track.test.mjs` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/capstone/spec.md: Data flow, Data model, Stories, Acceptance, Security. Stories numbered S1..S3 to S5, covering both document types and chosen option, each with observable result. | `spec` |
| 4 | Parse story ids from Stories and test declarations in the two named acceptance files. Require 3–5 distinct ids and coverage of each, at least one core and one track case, no skipped or todo declarations. Syntax-check both with node --check. Assertions can still be red at this stage. | `contracts` |

**Finished state.** Capture an unauthorised operation, missing data, and the chosen option’s boundary. Check with `npx academy check m9-p2`.

### Debugging lab — The shape that lost the sitting

| Item | Design |
| :--- | :--- |
| Seeded | Scratch spec keys a JHS 3 result by student and term only, with Mock 1 and Mock 2. |
| Symptom | Request for Mock 2 shows a Mock 1 grade. |
| Fault (builder only) | The data model omits sitting identity. |
| Observe | Request for Mock 2 shows a Mock 1 grade. |
| Possible causes | Wrong enrolment, missing mark, wrong key. |
| Tests | Compare memberships, marks and mock ids for both queries. |
| Cause | The data model omits sitting identity. |
| Fix | Include sitting in the read identity and test two mocks. |
| Fixed state | Each result uses only its selected sitting. |

### Own build

1. Specify a refusal for the chosen option.
2. Specify empty-state wording.
3. Link both to a testable story.
4. Commit this variation. In `notes/m9-u2.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Capture an unauthorised operation, missing data, and the chosen option’s boundary. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Which parts of D-81 force the mock sitting into the model?
2. Why is a D-218 reprint a different story from a new issue?

**Mastery, without notes**

1. Draw the result lineage.
2. Identify three stories.
3. Test one refusal.
4. Explain why a red test is useful here.

**Debugging-lab check** (`m9-p2-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m9-p2-own`). Trace the refusal and empty state to a testable story. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m9-p2`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/capstone/spec.md`, `tests/capstone/core.test.mjs`, `tests/capstone/track.test.mjs` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| spec | doc | yes | docs/capstone/spec.md: Data flow, Data model, Stories, Acceptance, Security. Stories numbered S1..S3 to S5, covering both document types and chosen option, each with observable result. |
| contracts | tests | yes | `tests/contracts.test.mjs` via files. Parse story ids from Stories and test declarations in the two named acceptance files. Require 3–5 distinct ids and coverage of each, at least one core and one track case, no skipped or todo declarations. Syntax-check both with node --check. Assertions can still be red at this stage. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `spec` — The specification omits a flow, story or boundary.
- `contracts` — A story has no executable acceptance case.

### Needs

Modules 1–8, especially 5.6, 7.4 and 8.2. WSL, Git and Node. All evidence uses synthetic school data.

---

## Unit 9.3 — Implementation plan

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m9-u3` / `m9-p3` |
| title | Implementation plan |
| module / position | 9 / 3 |
| guidance | independent |
| minutes | `{ min: 720, max: 1080 }` |
| gpis_part | Start with a proof for the riskiest dependency, then build narrow vertical slices. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Break a slice into reversible tasks
2. Estimate with dependencies
3. Prove order with history

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with putting school jobs in dependency order; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/workbook/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Break a slice into reversible tasks | Start with a proof for the riskiest dependency, then build narrow vertical slices. |
| 2. Estimate with dependencies | Each task has hours, predecessor and a result that proves it is done. |
| 3. Prove order with history | Existing module code predates the plan. Distinguish new capstone implementation by its dedicated paths. |

**Text diagram** risk trial → dependencies → vertical slices → acceptance evidence

**Common mistakes**

1. Earlier filename → no chronology → Plan commit is an ancestor of first capstone implementation
2. Parallelise both → both need results → No valid task order
3. 4 always → assumes no dependencies → 9 work hours before scheduling

### Guided example — Plan an archive search release

In a scratch folder.

1. List indexing, query and UI with individual proofs.
2. Treat memory usage as the risky assumption; measure it first.
3. Give the second and third tasks dependencies and estimates.
4. Read git ancestry to show the plan came first.

### Quiz plan (`m9-u3-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Plan before build means? | Plan commit is an ancestor of first capstone implementation | Earlier filename (no chronology). Earlier wall clock only (editable timestamp) |
| 2 | Cycle A→B→A? | No valid task order | Parallelise both (both need results). Ignore one dependency (changes plan) |
| 3 | Estimate 2+3+4 hours? | 9 work hours before scheduling | 4 always (assumes no dependencies). 24 (unsupported) |
| 4 | D-218 highest-risk reprint? | Prove original remains unchanged after correction | Polish button first (risk untested). Read live data (breaks invariant) |
| 5 | What is a vertical slice? | One small outcome through UI, action and storage | All tables first (horizontal layer). All styling first (no working flow) |
| 6 | Completed risk trial? | Record result and decision | Mark green from estimate (no evidence). Hide failure (still informative) |

### Lab — Implementation plan

Open with what the learner is building and why. Use the numbered requirements below as the steps. State the observable result of each numbered step. Fold each hint and suggest trying for 30 minutes first. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `docs/capstone/plan.md`, `docs/capstone/tasks.csv` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/capstone/plan.md: Risk trial, Order, Estimates, Proof, Revision. Describe highest risk and a scratch experiment that does not begin production implementation. | `plan` |
| 4 | tasks.csv header id,depends,hours,proof. Use T1..Tn, semicolon-separated predecessors, positive numeric hours and a named observable per row; require at least five tasks, no cycles, every predecessor exists, and risk trial first. | `graph` |
| 5 | Use git log --reverse --format=%H -- docs/capstone/plan.md and first commit touching src/lib/capstone/ or src/app/capstone/. Plan must already be committed; if implementation exists, require distinct commits and git merge-base --is-ancestor PLAN FIRST_BUILD exit 0. Rerun in 9.4. | `ancestry` |

**Finished state.** Existing module code predates the plan. Distinguish new capstone implementation by its dedicated paths. Check with `npx academy check m9-p3`.

### Debugging lab — The convenient estimate

| Item | Design |
| :--- | :--- |
| Seeded | Scratch CSV has T2 dependent on T3 and T3 on T2. |
| Symptom | Neither task is ready although both are estimated. |
| Fault (builder only) | Circular dependency. |
| Observe | Neither task is ready although both are estimated. |
| Possible causes | Missing id, cycle, zero hours. |
| Tests | Validate ids, traverse dependencies, inspect hours. |
| Cause | Circular dependency. |
| Fix | Extract the shared prerequisite and reorder tasks. |
| Fixed state | Every task can be scheduled once. |

### Own build

1. Budget a delay to the riskiest task.
2. Show its downstream effect.
3. Record a smaller viable delivery path.
4. Commit this variation. In `notes/m9-u3.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Existing module code predates the plan. Distinguish new capstone implementation by its dedicated paths. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. What does D-218 make risky about changing live results?
2. Which of D-105, D-124 or D-115 motivates your first option experiment?

**Mastery, without notes**

1. Sort a task graph.
2. Find a cycle.
3. Recompute hours.
4. Verify plan ancestry.

**Debugging-lab check** (`m9-p3-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m9-p3-own`). Recalculate the critical delivery path after the proposed delay. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m9-p3`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `docs/capstone/plan.md`, `docs/capstone/tasks.csv` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| plan | doc | yes | docs/capstone/plan.md: Risk trial, Order, Estimates, Proof, Revision. Describe highest risk and a scratch experiment that does not begin production implementation. |
| graph | tests | yes | `tests/graph.test.mjs` via files. tasks.csv header id,depends,hours,proof. Use T1..Tn, semicolon-separated predecessors, positive numeric hours and a named observable per row; require at least five tasks, no cycles, every predecessor exists, and risk trial first. |
| ancestry | tests | yes | `tests/ancestry.test.mjs` via files. Use git log --reverse --format=%H -- docs/capstone/plan.md and first commit touching src/lib/capstone/ or src/app/capstone/. Plan must already be committed; if implementation exists, require distinct commits and git merge-base --is-ancestor PLAN FIRST_BUILD exit 0. Rerun in 9.4. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `plan` — The plan lacks a risk trial or proof.
- `graph` — Dependencies or estimates are inconsistent.
- `ancestry` — The plan was not committed before implementation.

### Needs

Modules 1–8, especially 5.6, 7.4 and 8.2. WSL, Git and Node. All evidence uses synthetic school data.

---

## Unit 9.4 — Build and review

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m9-u4` / `m9-p4` |
| title | Build and review |
| module / position | 9 / 4 |
| guidance | independent |
| minutes | `{ min: 1680, max: 2520 }` |
| gpis_part | Rehearse Creche–JHS 2 ties and missing marks, then JHS 3 mock selection and incompleteness. |
| requires | [wsl, node, git, supabase, lab-db, playwright] |

### Outcomes

After this unit you can

1. Deliver both result types
2. Prove the workstream
3. Verify across boundaries

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with checking one finished class report end to end; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/workbook/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Deliver both result types | Rehearse Creche–JHS 2 ties and missing marks, then JHS 3 mock selection and incompleteness. |
| 2. Prove the workstream | Drive one successful transaction, a refusal and a repeat or historical read appropriate to the chosen option. |
| 3. Verify across boundaries | Use public functions, a signed-in browser, a role-aware database check and small feature commits. |

**Text diagram** marks → submission → preview → issue → correction and reprint

**Common mistakes**

1. 1,1,2 → dense → 1,1,3 under D-02
2. Aggregate 426 → raw score → Four named cores plus two electives yield 426 and 14
3. Select other two → could change result → Slip incomplete with unavailable totals

### Guided example — Build an event ticketing slice

In a scratch folder.

1. Reserve one test seat and issue a ticket with an immutable seat number.
2. Rename the seat and reprint the ticket; the original wording stays.
3. Race two requests for the last seat and record one success.
4. Review the refusal and the receipt with a second reader.

### Quiz plan (`m9-u4-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 90,90,80 in Basic 3? | 1,1,3 under D-02 | 1,1,2 (dense). 1,2,3 (loses tie) |
| 2 | D-81 worked cohort? | Four named cores plus two electives yield 426 and 14 | Aggregate 426 (raw score). Position 1 (not on slip) |
| 3 | One blank elective? | Slip incomplete with unavailable totals | Select other two (could change result). Treat as grade 9 (missing is not a grade) |
| 4 | After D-218 issue? | Return whole subject with reason before correction | Edit snapshot (immutable). Approve draft (no approved state) |
| 5 | Last copy sold twice? | One sale succeeds under D-115 | Two sales (negative stock). Two receipts one stock event (inconsistent) |
| 6 | D-124 fee retry? | Same actor/key/payload returns same outcome | Duplicate payment (double allocation). Recompute prior allocation (immutable) |

### Lab — Build and review

Open with what the learner is building and why. Use the numbered requirements below as the steps. State the observable result of each numbered step. Fold each hint and suggest trying for 30 minutes first. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/capstone/results.ts`, `src/app/capstone/page.tsx`, `docs/capstone/review.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Import buildReport and buildSlip from results.ts. Report fixture [{id,status,open,finals}] with active/open totals 90,90,80, inactive 99 and closed 100 → positions 1,1,3 only. finals [null,80] prints blank and contributes 80. Slip accepts 8.2 offerings and selected mock id: D-81 six finals → raw 426, aggregate 14; unrelated mock ignored; missing final → INCOMPLETE and NOT AVAILABLE; no position/remark. Include stored max 140 with raw 112 → 80 percent. | `core` |
| 4 | Run node --test tests/capstone/core.test.mjs tests/capstone/track.test.mjs, require at least one executed passing case in each. The course integration test reads track.txt and exercises the selected workstream contract with synthetic role fixtures. Teacher: assigned A allowed, B denied, ended assignment loses access. Fees: 6.00 applied to 4.00 then 5.00 yields 4.00 and 2.00; repeat same request keeps one receipt; overpayment refused. Books: two requests for one copy yield one completed sale and zero stock; retry winner yields same sale. Verify after reload. No public practice bypass. | `track` |
| 5 | Lint, tsc and production build each exit 0. | `project` |
| 6 | Repeat 5.6 freeze fixture, two numerical submissions for id 900001 in same term, issued document id saved before update. SELECT (old.payload=baseline.payload) AS stable,(new.id<>old.id) AS revised from scratch baseline joined to public.issued_documents by captured ids → true,true. As ASSESSMENT altering issued payload errors. Compare issued snapshot identifiers again after denied write. | `snapshots` |
| 7 | /login at localhost:3000 shows School username and Sign in. Authenticated phone checks use track and assert a 360px layout without horizontal scrolling, 44px actions and one main action per screen. | `entry` |
| 8 | Repeat 9.3 ancestry check. Require at least three commits after the plan touching implementation/tests before the review; report their subjects for self-review. | `history-order` |

**Finished state.** Use public functions, a signed-in browser, a role-aware database check and small feature commits. Check with `npx academy check m9-p4`.

### Debugging lab — The unofficial issue

| Item | Design |
| :--- | :--- |
| Seeded | Seed a scratch mock with one missing elective; preview correctly says incomplete. |
| Symptom | Printing the preview creates an official issue id. |
| Fault (builder only) | Unofficial print reuses issue action. |
| Observe | Printing the preview creates an official issue id. |
| Possible causes | Wrong data completeness, wrong button binding, print stylesheet. |
| Tests | Inspect result state, trace the action, count issues before/after print. |
| Cause | Unofficial print reuses issue action. |
| Fix | Keep unofficial print local to preview. |
| Fixed state | Incomplete result prints unofficial wording with no issue id or verification QR. |

### Own build

1. Add an edge case for the chosen workstream.
2. Document one failure with before/after evidence.
3. Demonstrate an authorised correction and an unchanged old report.
4. Commit this variation. In `notes/m9-u4.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Use public functions, a signed-in browser, a role-aware database check and small feature commits. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. How does D-81 distinguish an unofficial slip from official issue?
2. What does your option share with D-218 and what document identity differs, especially under D-116?

**Mastery, without notes**

1. Reproduce a tie.
2. Show an incomplete slip.
3. Prove one refusal in the chosen track.
4. Reprint after a correction.

**Debugging-lab check** (`m9-p4-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m9-p4-own`). Replay the chosen correction; compare the old report with its stored evidence. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m9-p4`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db, playwright])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/capstone/results.ts`, `src/app/capstone/page.tsx`, `docs/capstone/review.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| core | tests | yes | `tests/core.test.mjs` via files. Import buildReport and buildSlip from results.ts. Report fixture [{id,status,open,finals}] with active/open totals 90,90,80, inactive 99 and closed 100 → positions 1,1,3 only. finals [null,80] prints blank and contributes 80. Slip accepts 8.2 offerings and selected mock id: D-81 six finals → raw 426, aggregate 14; unrelated mock ignored; missing final → INCOMPLETE and NOT AVAILABLE; no position/remark. Include stored max 140 with raw 112 → 80 percent. |
| track | tests | yes | Run node --test tests/capstone/core.test.mjs tests/capstone/track.test.mjs, require at least one executed passing case in each. The course integration test reads track.txt and exercises the selected workstream contract with synthetic role fixtures. Teacher: assigned A allowed, B denied, ended assignment loses access. Fees: 6.00 applied to 4.00 then 5.00 yields 4.00 and 2.00; repeat same request keeps one receipt; overpayment refused. Books: two requests for one copy yield one completed sale and zero stock; retry winner yields same sale. Verify after reload. No public practice bypass. |
| report-journey | page | yes | Use the saved practice Admin session. From the issued-document list, click the link for the original synthetic report; assert its printed score, reload, and assert it again. Return to the list, open the corrected issue and check its own score. The integration tests above cover the selected workstream's permissions, retries and concurrent writes. |
| project | static | yes | Lint, tsc and production build each exit 0. |
| snapshots | sql | yes | Repeat 5.6 freeze fixture, two numerical submissions for id 900001 in same term, issued document id saved before update. SELECT (old.payload=baseline.payload) AS stable,(new.id<>old.id) AS revised from scratch baseline joined to public.issued_documents by captured ids → true,true. As ASSESSMENT altering issued payload errors. Compare issued snapshot identifiers again after denied write. |
| entry | page | yes | /login at localhost:3000 shows School username and Sign in. Authenticated phone checks use track and assert a 360px layout without horizontal scrolling, 44px actions and one main action per screen. |
| history-order | tests | yes | `tests/history-order.test.mjs` via files. Repeat 9.3 ancestry check. Require at least three commits after the plan touching implementation/tests before the review; report their subjects for self-review. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `core` — A core document changed a school rule.
- `track` — The selected workflow failed its success, refusal or repeat case.
- `project` — The integrated application failed a project gate.
- `snapshots` — A corrected result changed an earlier official record.
- `entry` — The app entry page failed the phone check.
- `history-order` — The build history lacks the planned sequence.

### Needs

Modules 1–8, especially 5.6, 7.4 and 8.2. WSL, Git and Node. All evidence uses synthetic school data. Learner’s signed-in Supabase practice sessions, running app, Chromium and network.

---

## Unit 9.5 — Release and defence

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m9-u5` / `m9-p5` |
| title | Release and defence |
| module / position | 9 / 5 |
| guidance | independent |
| minutes | `{ min: 900, max: 1380 }` |
| gpis_part | State the revision, staging URL, migration state and rollback target. |
| requires | [wsl, node, git, supabase, lab-db, playwright, vercel] |

### Outcomes

After this unit you can

1. Release a reproducible revision
2. Demonstrate the two document paths
3. Defend scope and trade-offs

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with showing a finished register to the headteacher; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://sre.google/workbook/table-of-contents/) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Release a reproducible revision | State the revision, staging URL, migration state and rollback target. |
| 2. Demonstrate the two document paths | Show a report, a slip and one chosen workstream on synthetic records. Record dated hosted proof. |
| 3. Defend scope and trade-offs | Explain the design without notes and compare one concrete difference with GPIS. |

**Text diagram** release revision → staging evidence → defence → rollback proof

**Common mistakes**

1. Local screenshot → wrong host → Time, host, revision and observed result
2. Latest projection → wrong version → Show original snapshot
3. Grade 2 → misses inclusive boundary → Grade 1 for an eligible final

### Guided example — Release a library reservation tool

In a scratch folder.

1. Tag a tested revision and record its schema version.
2. Demonstrate book reservation and refusal from the practice site.
3. Roll back the alias and verify the earlier revision.
4. Answer a reviewer asking why the receipt is versioned.

### Quiz plan (`m9-u5-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Hosted demo evidence? | Time, host, revision and observed result | Local screenshot (wrong host). Build exit alone (not a request) |
| 2 | Reprint of earlier issue? | Show original snapshot | Latest projection (wrong version). Hide previous correction (no proof) |
| 3 | D-81 80 points? | Grade 1 for an eligible final | Grade 2 (misses inclusive boundary). D-01 remark (wrong document) |
| 4 | Rollback includes schema? | State compatibility and validate reads | Assume any revision works (dependency risk). Erase history (irreversible) |
| 5 | Both core views present but no option? | Capstone incomplete | Pass on core only (scope missing). Count two documents as two options (different requirement) |
| 6 | Who judges the oral defence? | Learner self-assesses against prompts | Checker scores reasoning (doc only matches structure). Hosting provider (not an assessor) |

### Lab — Release and defence

Open with what the learner is building and why. Use the numbered requirements below as the steps. State the observable result of each numbered step. Fold each hint and suggest trying for 30 minutes first. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `README.md`, `docs/capstone/release.md`, `docs/capstone/defence.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | docs/capstone/release.md: Revision, Demo, Migration state, Rollback, Release notes. Record hosted evidence for both core views and the option, synthetic data only. README.md states setup, test and deployment commands in human review. | `release` |
| 4 | docs/capstone/defence.md: Architecture, Trade-offs, Evidence, Compare with GPIS, Limits. Answer four closed-notes prompts, then record gaps. Human reviews reasoning. | `defence` |
| 5 | /login shows School username and Sign in under the module page contract. Repeat signed-in 9.4 evidence at staging manually [Q3]; store revision, timestamps and observed outcome, no session details. | `local-demo` |

**Finished state.** Explain the design without notes and compare one concrete difference with GPIS. Check with `npx academy check m9-p5`.

### Debugging lab — The demo points behind the release

| Item | Design |
| :--- | :--- |
| Seeded | Scratch release note cites SHA B; staging page advertises SHA A. |
| Symptom | Reviewer sees an older report layout. |
| Fault (builder only) | Alias still targets previous deployment. |
| Observe | Reviewer sees an older report layout. |
| Possible causes | Browser cache, wrong build, wrong alias. |
| Tests | Check fresh response, build SHA, alias target. |
| Cause | Alias still targets previous deployment. |
| Fix | Move alias to the validated candidate and repeat both document checks. |
| Fixed state | Staging and release evidence identify B. |

### Own build

1. Record a two-minute alternative design defence.
2. Give one piece of evidence that could change it.
3. State one deliberate exclusion and its cost.
4. Commit this variation. In `notes/m9-u5.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Explain the design without notes and compare one concrete difference with GPIS. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does GPIS D-33 favour one print layer?
2. Which choice differs from the GPIS implementation of your selected track?

**Mastery, without notes**

1. Identify deployed revision.
2. Reproduce a report without notes.
3. Explain the rejected design.
4. Demonstrate rollback evidence.

**Debugging-lab check** (`m9-p5-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m9-p5-own`). Check the defence recording, reconsideration evidence and documented exclusion. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m9-p5`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db, playwright, vercel])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `README.md`, `docs/capstone/release.md`, `docs/capstone/defence.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| release | doc | yes | docs/capstone/release.md: Revision, Demo, Migration state, Rollback, Release notes. Record hosted evidence for both core views and the option, synthetic data only. README.md states setup, test and deployment commands in human review. |
| defence | doc | yes | docs/capstone/defence.md: Architecture, Trade-offs, Evidence, Compare with GPIS, Limits. Answer four closed-notes prompts, then record gaps. Human reviews reasoning. |
| local-demo | page | yes | /login shows School username and Sign in under the module page contract. Repeat signed-in 9.4 evidence at staging manually [Q3]; store revision, timestamps and observed outcome, no session details. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `release` — The release record lacks demo or recovery evidence.
- `defence` — The defence is missing an argument or comparison.
- `local-demo` — Local demo entry did not render.

### Needs

Modules 1–8, especially 5.6, 7.4 and 8.2. WSL, Git and Node. All evidence uses synthetic school data. Own Vercel staging, Supabase lab and authorised demo identities; no live school data.

## After module 9 the learner has

Both report types and one chosen workstream, a tested revision on staging, release and rollback evidence, and a self-assessed defence.
