# Handoff — all remaining work (for Codex)

Copy everything below the line into Codex as one prompt. It is written to run for many
sessions: each time you start, read this file again and continue from the first task that is
not finished.

---

You are the builder for **Ruftech Academy** (repository `srufai1/ruftech-academy`, branch
`main`). Work through the task list below **in order**, one task at a time, until all are
done. The owner is not technical in every area and is not a native English speaker: write
every report in short, plain English.

## Before every task

1. `git pull` on `main`. Read `AGENTS.md`, `docs/roadmap.md` (the task's own section),
   `docs/course-design/00-guide.md`, `docs/course-design/99-open-questions.md` (the owner's
   decisions table at the top is final) and `docs/course-design/99-builder-notes.md`.
2. Find the first task in the list below whose "done when" is not yet true. Do that task.
3. The GPIS repository `srufai1/gpis-school-system` is **read-only reference**. Never edit,
   commit to or run it. Every GPIS rule you use is quoted with its D-number from
   `docs/DECISIONS.md`; never invent one. If a rule you need is missing, stop that task and
   ask (see "When to stop").

## The task list

| # | Task | Done when |
| :--- | :--- | :--- |
| 1 | **T32** — update the course-design files (and `docs/curriculum.md`, `docs/decisions.md` wording, platform copy) to section 0.6's naming, and to the owner's 19 answers (roadmap T32) **and** to the owner's teaching rules in `00-guide.md` section 0 (simple words + technical, Learn more links, no unexplained codes, numbered steps with hints, milestone plans) | Every "Accept" line of T32 is true; every module file's lesson outlines, labs and check plans follow section 0; `npm test` green |
| 2 | **T34** — rework the 12 built units (1.1–2.6) to `00-guide.md` section 0 (including 0.6: "build a School Management System", folder `~/projects/school-system` in every page, seed and check): add "In simple words" and "Learn more" to every lesson section, replace bare codes with names, numbered steps with hints in every lab, milestone plan steps in 1.6 and 2.6; add the course Glossary page; bump each changed check's version | Each unit's done-list in `00-guide.md` section 14 is true again; every link opened and working; `npm run content`; `npm test` green |
| 3 | **T28** — debugging-lab and own-build checks for the 12 built units (1.1–2.6); fix unit 1.1's names to `m1-p1-debug` and `m1-p1-own` | Each new check fails on its start state and passes on a solved copy (kept outside the repo); `npm run content`; `npm test` green |
| 4 | **T29** — unit time as a range | Roadmap T29 "Accept" is true |
| 5 | **T30** — Docker labs: finish what T27 did not (the `-docker` check shows as its own badge; units 4.6 and 7.5 designs use it) | Roadmap T30 "Accept" is true |
| 6 | **T31** — a person reviews the deployed site | Roadmap T31 "Accept" is true; migration file written, **not applied** |
| 7 | **T33** — frontend restyle from `docs/mockups/ui/academy-ui.html` | Roadmap T33 "Accept" is true |
| 8 | **Module 3 content** — build units 3.1–3.6 from `docs/course-design/03-frontend.md` | `00-guide.md` section 14 "unit is done" list true for each unit |
| 9 | **Module 4 content** — units 4.1–4.6 from `04-databases.md` | same |
| 10 | **Module 5 content** — units 5.1–5.6 from `05-backend.md` | same |
| 11 | **Module 6 content** — from `06-system-design.md` | same |
| 12 | **Module 7 content** — from `07-security-devops.md` | same |
| 13 | **Module 8 content** — from `08-algorithms.md` | same |
| 14 | **Module 9 content** — from `09-capstone.md` | same |
| 15 | **Python track content** — from `10-python.md` (`content/module-10/`) | same |

Content tasks follow `00-guide.md` section 14 exactly: one unit at a time, in position order;
check first (seed, `check.yaml`, tests), prove it fails on the start state and passes on a
solved copy, then the pages, then `npm run content`. One commit per unit:
`Content: unit N.K <title>`.

## The frontend (task 7)

- The approved look is the file `docs/mockups/ui/academy-ui.html` (open it in a browser;
  it is self-contained). Copy its tokens, fonts, spacing and rules; do not copy its HTML
  structure blindly, use the app's existing components and shadcn/ui.
- It must stay **distinct from the owner's portfolio site** (forest green, bento cards):
  do not use green as an accent, do not add bento grids, hero images or shadows.
- Minimal and calm: one main action per screen, colour only for state, reading text in the
  serif at 17–18px and about 65 characters wide.
- Mobile first: 360px, 44px targets, no sideways scroll, bottom bar on phones, sidebar on
  computers. **Light mode is the default for everyone**; a switch (in the top bar and on the
  Me page) turns on dark mode and the choice is saved on the device. Do not follow the
  computer's dark setting automatically.
- Lesson pages show the "In simple words" box, dotted glossary terms and the "Learn more"
  links as in the mockup; project pages show numbered steps with folded hints.
- Change appearance only. No route, data, auth or behaviour changes.

## Rules for every commit

- Run `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, and the browser
  tests you touched (`node scripts/run-tests.mjs --with-browser <files>`). All must pass.
  Report what you ran and what it printed. Never say something passes unless you saw it.
- Small commits; message names the task (`T28: …`, `Content: unit 3.2 …`). **No AI model
  names and no trailer lines** in messages.
- Push to `main`. If rejected: `git fetch`, `git rebase origin/main`, push again.
  **Never force-push.**
- Never connect to a hosted database and never apply a migration. Write the migration file;
  the owner applies it (add it to `docs/runbook.md`'s list).
- Never put a secret, key, password or connection string in any file. `.env.example` gets
  names only.
- Stay inside the task. If you notice a problem elsewhere, list it in your report; do not
  fix it silently.

## When to stop and ask

Stop the current task (finish nothing half-way in a commit) and ask the owner one short,
plain question with 2–3 options when:
- a GPIS rule you need is not in `docs/DECISIONS.md`;
- a design file and the checker cannot both be true (say which line and why);
- a task would need a new checker feature or a database change not in the roadmap;
- something would delete or rewrite work that already exists.

Then continue with the **next** task that does not depend on the answer.

## Report after each task (plain English, short)

1. Which task, and what you built (files).
2. What you ran and the results.
3. Anything the owner must do (for example: apply migration `0009_…`, then publish).
4. Anything you noticed but did not change.
5. The next task you will start.
