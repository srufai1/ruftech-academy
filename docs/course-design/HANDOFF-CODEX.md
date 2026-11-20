# Handoff prompt — finish the course design (modules 5 to 10, open questions)

Copy everything below the line into Codex as one prompt.

---

You are the course architect for **Ruftech Academy** (repository `srufai1/ruftech-academy`,
branch `main`). Your task is to **finish the course design**: write the remaining design files
in `docs/course-design/`. Design only. Do **not** write lesson prose, quiz files, checks or
any code. A builder will build one module at a time from your files, so each file must be
complete enough that the builder makes **no course decisions of their own**.

## 1. What already exists (read these first, in this order)

1. `AGENTS.md` — rules for agents in this repository.
2. `docs/decisions.md` — ADR-1 to ADR-8, and "Known limits".
3. `docs/curriculum.md` — the 58 projects (= units), the module goals, the checker kinds per
   project, the Docker labs table, the guidance levels.
4. `docs/checker.md`, `docs/platform.md` — how the local checker and the platform work.
5. `packages/shared/src/content-schema.ts` and `content-load.ts` — the exact limits of a
   unit's front matter, quiz and `check.yaml`.
6. `packages/checker/src/steps/*.ts` — the **seven** step kinds and exactly what each can do
   (`files`, `doc`, `git`, `tests`, `static`, `sql`, `page`). Read them; do not guess.
7. `docs/course-design/00-guide.md` — **the rules every unit follows.** Obey it.
8. `docs/course-design/01-command-line.md` … `04-databases.md` — finished modules.
   **`04-databases.md` is the model to copy**: same block order, same table shapes, same
   level of detail, same style of check plan and messages.
9. `docs/course-design/99-builder-notes.md` — what the builder found while building
   modules 1–2. Respect it (for example: diagrams are **text only**; the site does not render
   Mermaid).
10. `content/module-01/` and `content/module-02/` — built units, the quality bar.
11. The GPIS repository, read-only (`srufai1/gpis-school-system`): `AGENTS.md`,
    `docs/CURRENT_RULES.md`, `docs/DECISIONS.md`, `docs/BUSINESS_RULES.md`, and code under
    `src/lib/`. Clone it to `~/reference/gpis-school-system` if it is not there.
    **Never edit, commit to or run it.** If you cannot reach it, stop and say so.

## 2. What you must write

| File | Content |
| :--- | :--- |
| `05-backend.md` | Module 5 — Backend and auth in Next.js: units 5.1 Login and roles, 5.2 Admit a student, 5.3 Student import, 5.4 Submit scores, 5.5 Send back and resubmit, 5.6 Issue a document |
| `06-system-design.md` | Module 6 — System design, case study "GPIS for 50 schools": 6.1–6.6 |
| `07-security-devops.md` | Module 7 — Security, testing and DevOps: 7.1–7.6 (7.5 is **[Docker]**; 7.2 has an optional **[Docker]** traffic lab) |
| `08-algorithms.md` | Module 8 — Algorithms: 8.1 Ranking at scale, 8.2 BECE aggregate, 8.3 Oldest debt first, 8.4 Search, 8.5 Number puzzle (optional) |
| `09-capstone.md` | Module 9 — Capstone: stages 9.1–9.5 (report cards end to end + one chosen workstream) |
| `10-python.md` | Python track (module number 10, `course.yaml` slug `py`): P.1–P.6 (P.4 container is an optional **[Docker]** extra) |
| `99-open-questions.md` | Every question the documents cannot answer, with options (see section 6) |

For **every unit**, give these blocks in this order (exactly as in `04-databases.md`):

1. **Front matter** — `id`, `project`, `title`, `module`, `position`, `guidance`, `minutes`,
   `gpis_part`, `requires`.
2. **Outcomes** — 3 to 5 testable "After this unit you can…".
3. **Lesson** — a table of sections and key ideas; one diagram idea (text); "Common
   mistakes" (what people do → what happens → what to do instead).
4. **Guided example** — a worked task on a **different** subject from the lab, in steps.
   Half guided: first half "(full)", second half "(task)". Independent: a different problem
   of the same kind.
5. **Quiz plan** — 6 to 8 questions: idea, right answer, why each wrong option is wrong.
   Pass mark = questions − 2. At least one question uses a GPIS rule with real numbers.
6. **Lab** — start state; numbered "What done means" table (requirement → check step);
   Steps only if guided; Hints (folded) only if half guided; none if independent; finished
   state. Schema or file names the checks rely on are a **contract** printed in `lab.md`.
7. **Debugging lab** — table: seeded, symptom, fault(s), evidence under the five headings
   (`Observe`, `Possible causes`, `Tests`, `Cause`, `Fix`), fixed state.
8. **Own build** — 4 to 7 requirements, no steps.
9. **Review** — checklist extras, 2–3 "Compare with GPIS" questions (each pointing to a real
   GPIS file or decision), 4 mastery tasks.
10. **Check plan** — `check.yaml` plan: `id`, version `1.0.0`, `lab:` or none, `requires`;
    a table of every step (id, kind, required, exactly what it verifies: paths, modes,
    commands and expected output, SQL with setup rows and expected rows, page URLs and
    texts); then a message for every required step.
11. **Needs** — earlier units, tools, accounts, network.

Each module file starts with: a unit table (unit, title, project, kind, level, minutes,
check steps), "Module rules (decided here)", a contract table if the module adds schema or
files, and "GPIS rules used in this module" (quoted, with D-numbers). It ends with "After
module N the learner has".

## 3. Decisions already made — keep them

| Topic | Decision |
| :--- | :--- |
| Ids | Unit `m<N>-u<K>`, project `m<N>-p<K>`, quiz `m<N>-u<K>-quiz`. Python: `py-u<K>`, `py-p<K>`, folder `content/module-10/` |
| Where work happens | Repo projects run from `~/projects/gpis-rebuild` (no `lab:` key). Seeded labs live under `~/academy-labs/<check id>/…`. Python service in `~/projects/gpis-rebuild/services/results/` |
| Levels | Module 5: half. Module 6: half. Module 7: 7.1–7.3 half, 7.4–7.6 independent. Module 8: see Q2. Module 9: independent. Python: P.1–P.3 half, P.4–P.6 independent |
| Lab database | The learner's free Supabase project `gpis-rebuild-dev`; `LAB_DATABASE_URL` in `.env`; marker table `academy_lab`; check rows use ids from 900001 and names starting `ZZ `; everything in a `sql` step is rolled back |
| Schema | Module 4's contract (`04-databases.md`) is the starting schema for module 5. Extend it by new migrations only; never edit an old one. Every new table: RLS on, deny by default |
| Roles | From JWT `app_metadata.role`: `admin`, `assessment` (module 4); module 5 may add `root` only if a GPIS rule needs it — cite it |
| App | Next.js on `http://localhost:3000`, started by the learner (`npm run dev`); the checker starts nothing. Pages read data through `src/lib/…` functions (module 3 used `src/lib/sample-queries.ts`; module 5 replaces it with Supabase queries) |
| SQL checks | Cast counts `::int`, dates and numerics `::text`, always `order by`. Act as a role with `set local role authenticated` + `set_config('request.jwt.claims', …, true)` (see 4.4) |
| Browser checks | `page` steps load one `localhost` URL at 360 × 780 and cannot click or type. Behaviour that needs clicking uses a `tests` step whose test file drives Playwright from the project; mark those steps "(Q4)" |
| Debugging labs and own builds | Self-reviewed, no check (builder's interim answer to Q1). Still design each with exact seed, faults, evidence and fixed state |
| Diagrams | Text only (no Mermaid) |
| Minutes | About module weeks × 13 hours, shared over the units (Q6) |

## 4. GPIS rules to use (verify each against `docs/DECISIONS.md` before quoting)

Quote every rule with its decision number. **Never invent a rule, never round one off.** If
a unit needs a rule you cannot find, put it in `99-open-questions.md`; do not choose a
default.

| Rule | Summary (check the text) | Used in |
| :--- | :--- | :--- |
| AGENTS.md security rules 1–8 | No secret key in `src/`; role from `app_metadata`; RLS on every table; every schema change a migration; validate on client, server and database; `getClaims()` before a Server Component queries | 5.1, 7.1–7.3 |
| D-13 / D-99 / D-170 / D-204 | Lockout after 5 wrong passwords; lockout length 30 minutes (D-170 amended D-99's 45); idle timeout — **see Q11** | 5.1 |
| D-262 | Admit a student in four steps: Student · Class · Family · Photo and check; "(optional)" on optional fields; no asterisks | 5.2 |
| D-48 / D-70 / D-46 | Admission number `ADM/GPIS/YYYY/NNN`; House = fewest students, ties alphabetical; full name → first word / rest, one word is a row error | 5.2, 5.3 |
| D-42 / D-43 / D-45 / D-51 (as amended 9 Sept 2026) / D-223 | Import: five required columns (Full name, Date of birth, Class, Gender, Phone number); missing status column → all active, and the import says so in words; create-only; class matching exact but case/space/punctuation-insensitive, never fuzzy; row errors are skipped and named, valid rows commit; a file-level error stores nothing | 5.3 |
| D-218 | Enter scores → Submit → Preview → Issue & Print; no `approved` state anywhere; subject states `draft`, `submitted`, `returned`, `resubmitted`; a whole subject changes state together; editable after submit until a Report Card / Results Slip is issued for its class and term; after issue only an active Admin or Root sends the **whole** subject back with a reason (1–500 characters); send-back is immutable history; issued snapshots never change; Reprint reproduces the snapshot; Issue Updated publishes the correction; only `submitted` rows reach a document | 5.4–5.6, 9 |
| D-10 / D-162 / D-171 / D-27 / D-80 | As in modules 2 and 4 | 5.4, 8.2, 9, P.1 |
| D-81 | JHS 3 results slip: all Core subjects + best 2 Electives (core/elective from `subject_offerings.kind`, never hard-coded); best = higher final score; Total Raw = sum of finals of the selected set; Aggregate = sum of grade points; grade bands ≥80→1, ≥70→2, ≥65→3, ≥60→4, ≥55→5, ≥50→6, ≥45→7, ≥40→8, else 9 (`gradeFromTotal` in `src/lib/assessments/report-card.ts`); worked example: English 72, Mathematics 68, Integrated Science 75, Social Studies 70, Twi 80, Career Technology 61 → Raw 426, Aggregate 14; no class position, no D-01 words. D-81's wording "approved rows" is superseded by D-218 ("submitted") | 8.2, 9 |
| D-01 / D-02 / D-03 / D-04 / Q-07 | As in modules 2 and 4 (GPIS code: a missing or incomplete subject adds nothing to the total) | 8.1, 9 |
| D-247 | Name search: every word, any order, full stops ignored | 8.4 |
| D-124 | Payments settle oldest academic-year/term debt first, then oldest charge posting time, ID as tie-breaker; exact GHS; allocation lines immutable | 8.3, 9 (Fees option) |
| D-07 / D-33 / D-34 | Portrait A4, one shared print layer, ID card sheet exception | 5.6, 9 |
| D-97 | Class Teacher MVP scope | 9 (option) |
| D-254 / D-257 / D-266 | Phone bottom bar; score entry one bottom button; calm screens | 5, 9 |
| Single school | GPIS is not multi-tenant, on purpose (AGENTS.md "Deferred") | 6.2 |

## 5. Known limits of the checker you must design around

- `page`: localhost only, no clicking, no typing → deployed sites (7.4, 9.5, P.5) need
  another way (Q3).
- `tests` `run:` has no access to the check folder; `tests` `files:` run with `node --test`
  in the project, env `ACADEMY_PROJECT`.
- `sql` reads only the project's `.env` `LAB_DATABASE_URL`, needs the marker row, rolls back.
- No "partly done" outcome; only required/optional steps and `needs` (Q8).
- `requires` is shown, not enforced.
- Python checks: there is no `pytest` step kind. Use `tests` `run:` with the learner's own
  command (for example `uv run pytest -q` or `python -m pytest -q`), or Node test files that
  call the Python program as a child process. If neither is enough, add an open question
  with the smallest checker change.
- A design document cannot be judged by a check: `doc` checks headings and word counts only.
  For 6.1 "the checker recomputes the totals", design a `tests` step that reads a small,
  fixed-format table (for example a CSV the learner writes beside the document) and
  recomputes it.

## 6. `99-open-questions.md`

Keep these numbers (modules 1–4 already refer to them). For each: the question, why the
documents cannot answer it, 2–4 options with their cost, which units it blocks. Do **not**
choose an answer; where the builder gave an interim answer (`99-builder-notes.md`), say so.

| No. | Question |
| :--- | :--- |
| Q1 | Debugging labs and own builds: one `check/` folder per unit — check them (extra steps, extra folders, or a loader change) or keep them self-reviewed? Unit 1.1 still names checks `m1-p1-debug` and `m1-u1-own` that cannot exist |
| Q2 | Module 8 level: `course.yaml` says half guided, `curriculum.md` says independent |
| Q3 | `page` cannot open a deployed URL: how are 3.1, 7.4, 9.5, P.5 checked? |
| Q4 | `page` cannot click or type: accept Playwright-driven `tests` files (which give `fail`, not `needs`, when the app is down), or add actions to `page`? |
| Q5 | Lesson length limit (~150 lines) against heavy units: two-part lessons (as designed) or more units? |
| Q6 | Unit minutes against module weeks (unit 1.1 is 360 minutes; most units are 900–1200) |
| Q7 | How Playwright's browser is installed and how `academy doctor` reports it |
| Q8 | Docker labs "partly done": optional steps (as designed) or a new outcome? |
| Q9 | Target site traced in unit 1.5 (builder's interim answer: the platform's own sign-in page) |
| Q10 | "Migrations replay from empty" (4.1) cannot be proved by a `sql` step |
| Q11 | Idle timeout: D-170 says 15 minutes; a later decision (D-177) mentions 60 with a warning. Which does unit 5.1 teach? |
| Q12+ | Everything new you find while designing modules 5–10 |

## 7. Working rules

- **Language:** plain English for a reader who is not a native speaker. Short sentences.
  Tables and short bullets, not prose. British spelling.
- **Original material only** (ADR-5). Never copy ALX or any other course.
- **Stay inside the task:** do not change `00-guide.md` or modules 1–4, except to fix a real
  defect you find; list any such change in your report.
- **Work order:** `05` → `06` → `07` → `08` → `09` → `10` → `99`. After **each** file:
  run `npm test` (must stay green; you change docs only), then commit and push to `main`:
  - message: `Course design: module N` (or `Course design: open questions`);
  - the message must **not** contain any AI model name, and has no trailer lines;
  - push with `git push origin main`; if it is rejected, `git fetch` and
    `git rebase origin/main`, then push again. **Never force-push.**
- If you stop part-way, the finished files are already saved.

## 8. Final report (plain English, short)

1. Which files you finished.
2. For each module: number of units and number of check steps.
3. The open questions the owner must answer, most blocking first.
4. Which module is ready to build next.
5. Anything you changed in earlier files, and why.
