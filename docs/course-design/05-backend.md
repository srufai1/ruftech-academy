# Module 5 — Backend and auth in Next.js

| Unit | Title | Project | Kind | Level | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 5.1 | Login and roles | m5-p1 | Repo | half | 720–1080 | 7 |
| 5.2 | Admit a student | m5-p2 | Repo | half | 780–1140 | 6 |
| 5.3 | Student import | m5-p3 | Repo | half | 780–1140 | 5 |
| 5.4 | Submit scores | m5-p4 | Repo | half | 720–1080 | 5 |
| 5.5 | Send back and resubmit | m5-p5 | Repo | half | 720–1080 | 4 |
| 5.6 | Issue a document | m5-p6 | Repo | half | 660–1020 | 4 |

## Module rules (decided here)

Use only synthetic records. Check SQL against the marked practice database. Each sql step sets up its own rows, uses qualified public names, and rolls back. Use the module 4 fixtures and claims for ADMIN and ASSESSMENT. Use the guide §10.4 allocation table and names beginning ZZ. Counts are integers, money and dates are text, and lists have explicit ordering. Page checks use a learner-started app at http://localhost:3000, status 200, 360 × 780, no sideways scroll and 44px controls. Use local page actions for browser interactions. Use separate synthetic role sessions in ignored local storage-state files, never a test bypass in the app. Extend module 4 with forward migrations. Enable RLS on every new table before granting access. Use a verified active root role for D-218. Replace sample reads with request-scoped Supabase functions under src/lib. Server Components call getClaims() before queries. Use the existing module 3 routes and phone navigation. Distinguish audit events from the current submitted package.

Use the eight-step sequence, review checklist and reflection in 00-guide.md. Use text diagrams. The debugging lab and own build have separate checks. For each own build commit the variation and put the comparison in `notes/<unit-id>.md`. Read GPIS after a pass, or after a written 30-minute attempt in a half-guided unit.

## File and interface contract

Print the paths and the named inputs, outputs and routes from the check plan in the corresponding lab.

| Unit | Deliverables relative to its working directory |
| :--- | :--- |
| 5.1 | src/lib/auth/access.ts; src/lib/auth/login.ts |
| 5.2 | src/lib/admissions/admit.ts; supabase/migrations/*admit*.sql |
| 5.3 | src/lib/import/preview.ts; src/lib/import/confirm.ts |
| 5.4 | src/lib/assessments/submit.ts; supabase/migrations/*subject_submit*.sql |
| 5.5 | src/lib/assessments/send-back.ts; supabase/migrations/*send_back*.sql |
| 5.6 | src/lib/documents/issue.ts; supabase/migrations/*issue_document*.sql |

## GPIS rules used in this module

| Source in the read-only GPIS | Text to use |
| :--- | :--- |
| AGENTS.md rules 1–8 | “Role comes from app_metadata, never user_metadata.” Validate on client, server and database. Use migrations and RLS. No privileged key in src. |
| D-13, D-170, D-177, D-204 | “5 failed GPIS login attempts lock the account for 30 minutes”. D-177 amends idle expiry to 60 minutes, warning two minutes before. D-204 displays the remaining lock time. |
| D-262, D-48, D-70, D-273 | “Student · Class · Family · Photo and check”. Optional fields say (optional). ADM/GPIS/YYYY/NNN. On activation, count active students and choose the least populated House, alphabetically on ties. |
| D-42, D-43, D-45, D-46, D-51, D-149 §6, D-172, D-223 and D-224 | Name, Class and Date of Birth are required. Gender and Parent Phone are optional. Split first word and rest. Match class canonically and exactly. Skip and name row errors. The permanent-ID phone update is a narrow exception to create-only. |
| D-218 | “Enter scores → Submit → Preview → Issue & Print”. An issued class and term locks the whole subject. Send-back history and issued identities are immutable. |
| D-10, D-27, D-80, D-162, D-171 | “Missing subject scores print blank”. Four CA parts of 15 scale to 50 below JHS 3. The exam maximum lives on its row. JHS Integrated Science uses 140. JHS 3 mocks use 30 + 70. |
| D-07, D-33, D-34, D-254, D-257, D-266 | Portrait A4 and “one shared print layer”. ID cards have a sheet layout. Phone score entry has one bottom action. |

---

### Practice accounts for browser checks

Use your own marked practice project. Create separate synthetic Admin, Assessment,
assigned Teacher and, where required, active Root accounts. Set roles through the
trusted account setup. Assign the teacher only the fixture class. Add `.academy/` to
`.gitignore` before saving a session. Start the local app and run
`npx academy session admin --url http://localhost:3000/login`. Sign in in the visible
window. Repeat with the corresponding role name for each account. On expiry, run
the same command again. Use `npx academy session admin --clear` to remove that session.
A signed-out step uses a fresh browser context. Keep login details out of fixtures.

## Unit 5.1 — Login and roles

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m5-u1` / `m5-p1` |
| title | Login and roles |
| module / position | 5 / 1 |
| guidance | half |
| minutes | `{ min: 720, max: 1080 }` |
| gpis_part | Resolve a synthetic staff username on the server and establish a Supabase session. An unknown name gets the same public failure as a wrong password. |
| requires | [wsl, node, git, supabase, lab-db, playwright] |

### Outcomes

After this unit you can

1. Resolve a school username
2. Authorise a request
3. Distinguish the two clocks

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a staff badge with an expiry time; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://supabase.com/docs/guides/database) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Resolve a school username | Resolve a synthetic staff username on the server and establish a Supabase session. An unknown name gets the same public failure as a wrong password. |
| 2. Authorise a request | Only verified claims and active staff status grant a role. Deny a missing role and deny client-supplied roles. |
| 3. Distinguish the two clocks | A fifth failed attempt starts a fixed 30-minute lock. D-177 measures inactivity from genuine activity. A display countdown cannot unlock an account. |

**Text diagram** username → verified session → active role → permitted action

**Common mistakes**

1. 09:45 → old duration → Unlock at 09:30 under D-170
2. Restart thirty minutes → window does not extend → Ten minutes remain in the original window
3. Trust a hidden field → browser chooses it → Ignore it and verify the request

### Guided example — Library desk sign-in

In a scratch folder.

1. (full) Use a fake clock at 09:00 and a library member with a reader pass. Reading succeeds.
2. (full) Ask for borrowing with an expired pass. Record refusal before touching the loan list.
3. (task) Move time to the renewal boundary and predict access.
4. (task) Use two readers and show that renewing one leaves the other expired.

### Quiz plan (`m5-u1-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Fifth failure at 09:00? | Unlock at 09:30 under D-170 | 09:45 (old duration). 09:05 (count is not minutes) |
| 2 | Retry at 09:20? | Ten minutes remain in the original window | Restart thirty minutes (window does not extend). Unlock now (time remains) |
| 3 | A role in a form? | Ignore it and verify the request | Trust a hidden field (browser chooses it). Trust a label (display only) |
| 4 | Claims missing? | Refuse the private page | Default admin (no grant). Default assessment (no grant) |
| 5 | Idle at 58 minutes under D-177? | Warn two minutes before expiry | Lock password (separate clock). Erase data (no such action) |
| 6 | Successful login before lock? | Reset failed attempts | Keep four failures (not consecutive). Disable checks (later attempts still count) |

### Lab — Login and roles

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/auth/access.ts`, `src/lib/auth/login.ts` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Call roleFor(claims,active) in access.ts. Active app_metadata admin → admin, assessment → assessment, root → root, inactive or user_metadata-only → null. | `role` |
| 4 | Test login.ts with injected Auth and clock. Four failures then success resets count. Five failures at minute 0 lock until 30. A retry at 29 leaves expiry fixed. Known and unknown names have the same public response. | `clock` |
| 5 | Scan src/ using the guide’s secret patterns. Reject tracked .env or .env.local. Report path only. | `source` |
| 6 | /login shows School username, Password and Sign in. | `login` |
| 7 | Use a fresh page to assert that /students redirects to /login. In a separate page step with the saved staff session, visit /students, click Sign out, revisit /students and assert the login URL. The learner signs in manually during setup. | `session` |

**Hints (folded).** Compare the two clocks. Check the source of each role.

**Finished state.** An unauthenticated browser returns to sign-in after logout. Check with `npx academy check m5-p1`.

### Debugging lab — A clock that never finishes

| Item | Design |
| :--- | :--- |
| Seeded | Scratch clock, lockedUntil=09:30, retries at 09:10 and 09:29. |
| Symptom | At 09:30 the user still sees a lock. |
| Fault (builder only) | Retry writes a new expiry. |
| Observe | At 09:30 the user still sees a lock. |
| Possible causes | Bad clock, wrong account, moving deadline. |
| Tests | Print fake time, compare account IDs, record deadline before and after each retry. |
| Cause | Retry writes a new expiry. |
| Fix | Keep the first deadline until it expires. |
| Fixed state | All three requests refer to 09:30. The next valid login succeeds. |

### Own build

1. Show a countdown from a server timestamp.
2. Keyboard focus returns to username after expiry.
3. Known and unknown users see identical errors.
4. Commit this variation. In `notes/m5-u1.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** An unauthenticated browser returns to sign-in after logout. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Which clock did D-177 amend?
2. Why does GPIS AGENTS.md rule 8 require claims before the query?

**Mastery, without notes**

1. Trace one successful request.
2. Test four failures and a success.
3. Test expiry at exactly minute 30.
4. Show that a signed-out reload cannot read a roster.

**Debugging-lab check** (`m5-p1-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m5-p1-own`). Compare countdown with the server expiry and check keyboard focus after expiry. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m5-p1`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db, playwright])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/auth/access.ts`, `src/lib/auth/login.ts` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| role | tests | yes | `tests/role.test.mjs` via files. Call roleFor(claims,active) in access.ts. Active app_metadata admin → admin, assessment → assessment, root → root, inactive or user_metadata-only → null. |
| clock | tests | yes | `tests/clock.test.mjs` via files. Test login.ts with injected Auth and clock. Four failures then success resets count. Five failures at minute 0 lock until 30. A retry at 29 leaves expiry fixed. Known and unknown names have the same public response. |
| source | tests | yes | `tests/source.test.mjs` via files. Scan src/ using the guide’s secret patterns. Reject tracked .env or .env.local. Report path only. |
| login | page | yes | /login shows School username, Password and Sign in. |
| session | page | yes | Use a fresh page to assert that /students redirects to /login. In a separate page step with the saved staff session, visit /students, click Sign out, revisit /students and assert the login URL. The learner signs in manually during setup. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `role` — A role was granted to the wrong identity.
- `clock` — The lock window or public failure changed.
- `source` — A protected value or file entered the application.
- `login` — The sign-in form is incomplete.
- `session` — The protected route did not follow the session.

### Needs

Module 4.4 and the preceding backend units as applicable. WSL, Git, Node, learner-owned Supabase project, network for Auth and the lab database. Start Next.js locally for browser work.

---

## Unit 5.2 — Admit a student

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m5-u2` / `m5-p2` |
| title | Admit a student |
| module / position | 5 / 2 |
| guidance | half |
| minutes | `{ min: 780, max: 1140 }` |
| gpis_part | Client, Server Action and database must independently reject a missing required name. |
| requires | [wsl, node, git, supabase, lab-db, playwright] |

**Forward migration and regression fixtures.** Retain existing students and memberships.
Allow Male, Female and Other on the admission form and matching stored values (GPIS
decision D-262). Add `parent_phone` separately from the guardian and emergency numbers
(GPIS decision D-37). Update the shared practice fixture once and rerun the earlier
admission and membership checks. Generate a separate permanent student ID once, in the
form STU-000001 (GPIS decision D-56). Test two admissions, withdrawal and reinstatement:
the same pupil keeps the id, and another pupil never receives it. Preserve the distinct
admission number. Record each applied parent-phone change in immutable audit history
(GPIS decision D-223). Test a changed number, a blank and an unchanged number. Only the
first changes the stored phone or adds an event. Recheck identity at commit time.

### Outcomes

After this unit you can

1. Validate across three boundaries
2. Allocate under concurrency
3. Follow the four screens

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a numbered admissions receipt; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://supabase.com/docs/guides/database) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Validate across three boundaries | Client, Server Action and database must independently reject a missing required name. |
| 2. Allocate under concurrency | Allocate each admission number once. Waiting pupils have no House. Activation assigns a House and creates the membership together at clearance (GPIS decision D-273). Two simultaneous admissions cannot take the same number. |
| 3. Follow the four screens | Preserve back navigation and use (optional) for optional fields. Class membership belongs to the selected year and term. |

**Text diagram** Student → Class → Family → Photo and check → one transaction

**Common mistakes**

1. B → not first alphabetically → Choose A alphabetically under D-70
2. Count in browser → stale → Allocate in the transaction
3. Keep student → partial write → Roll back student and assignment

### Guided example — Register library copies

In a scratch folder.

1. (full) Two branches register books at the same time. Give each request one stock number.
2. (full) Simulate a missing shelf. Verify neither copy nor catalogue entry remains.
3. (task) Retry with a shelf and compare counts.
4. (task) Reverse the tie between two empty shelves.

### Quiz plan (`m5-u2-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | House A and B each have 2 students? | Choose A alphabetically under D-70 | B (not first alphabetically). Random (not repeatable) |
| 2 | Two parallel admits? | Allocate in the transaction | Count in browser (stale). Reuse year as number (not unique) |
| 3 | Write membership fails? | Roll back student and assignment | Keep student (partial write). Return success (failure hidden) |
| 4 | A class transfer? | New dated membership | Edit student.class (no history). Rewrite first admission (wrong event) |
| 5 | Step 3 of D-262? | Family follows Class | Photo (last step). Student (first step) |
| 6 | Optional field label? | Add (optional) | Asterisk (D-262 removes it). No label (meaning lost) |

### Lab — Admit a student

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/admissions/admit.ts`, `supabase/migrations/*admit*.sql` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Use page actions with `session: admin` at /admit. Expect Student, Class, Family, Photo and check in order. Empty required name blocks Next. Back preserves input. Complete one synthetic record and reload the student page. | `wizard` |
| 4 | Call admit.ts validateAdmission(input) with blank surname, missing class and impossible DOB. Each returns a field error. Submit the same invalid inputs directly to the authorised action harness. No insert call may occur. | `server` |
| 5 | Using module 4.2 year/term/class 900001, include all four Houses, including those with no active pupils. Count only active pupils in this transaction; save the id with the fewest students, breaking ties by House name alphabetically (GPIS decisions D-70 and D-273), immediately before activation. As ADMIN call public.admit_student(jsonb) with first_name ZZ, last_name Learner, DOB 2015-01-01, gender female, year/class/term ids 900001 and year start 2090. Return the student id. Assert that the waiting row has no House. Using synthetic clearance prerequisites and a finance-authorised Admin, clear the admission and join the active student, House and membership by that id: the saved expected House id, class 900001. Invalid class 999999 → error and zero students with last_name ZZRejected. Check generated number against ADM/GPIS/[0-9]{4}/[0-9]{3,}. | `atomic` |
| 6 | /login shows School username. Authenticated wizard layout is measured inside wizard at 360 × 780, all four screens fit. | `layout` |

**Hints (folded).** Read the module 4 foreign keys. Compare empty and invalid input.

**Finished state.** All four screens preserve input and one success produces one membership. Check with `npx academy check m5-p2`.

### Debugging lab — The half-admitted student

| Item | Design |
| :--- | :--- |
| Seeded | Scratch store with two lists and a missing class. |
| Symptom | A name appears without a membership. |
| Fault (builder only) | Two writes committed independently. |
| Observe | A name appears without a membership. |
| Possible causes | Wrong class, stale list, partial transaction. |
| Tests | Read class IDs, reload the list, compare both tables after refusal. |
| Cause | Two writes committed independently. |
| Fix | Commit the two rows together. |
| Fixed state | A rejected class leaves both counts unchanged. |

### Own build

1. Show a receipt for a successful synthetic admission.
2. Show its class through membership.
3. Keep optional photo empty and verify the receipt still opens.
4. Commit this variation. In `notes/m5-u2.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** All four screens preserve input and one success produces one membership. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. How does D-262 mark optional fields?
2. Where do D-48 and D-70 require separate allocation decisions?

**Mastery, without notes**

1. Demonstrate back navigation.
2. Reject an impossible date three ways.
3. Predict a tie between houses.
4. Prove a refused admission leaves no row.

**Debugging-lab check** (`m5-p2-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m5-p2-own`). Open the receipt for a new synthetic pupil with an empty photo; compare the membership class. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m5-p2`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db, playwright])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/admissions/admit.ts`, `supabase/migrations/*admit*.sql` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| wizard | page | yes | Use page actions with `session: admin` at /admit. Expect Student, Class, Family, Photo and check in order. Empty required name blocks Next. Back preserves input. Complete one synthetic record and reload the student page. |
| server | tests | yes | `tests/server.test.mjs` via files. Call admit.ts validateAdmission(input) with blank surname, missing class and impossible DOB. Each returns a field error. Submit the same invalid inputs directly to the authorised action harness. No insert call may occur. |
| atomic | sql | yes | Using module 4.2 year/term/class 900001, include all four Houses, including those with no active pupils. Count only active pupils in this transaction; save the id with the fewest students, breaking ties by House name alphabetically (GPIS decisions D-70 and D-273), immediately before activation. As ADMIN call public.admit_student(jsonb) with first_name ZZ, last_name Learner, DOB 2015-01-01, gender female, year/class/term ids 900001 and year start 2090. Return the student id. Assert that the waiting row has no House. Using synthetic clearance prerequisites and a finance-authorised Admin, clear the admission and join the active student, House and membership by that id: the saved expected House id, class 900001. Invalid class 999999 → error and zero students with last_name ZZRejected. Check generated number against ADM/GPIS/[0-9]{4}/[0-9]{3,}. |
| layout | page | yes | /login shows School username. Authenticated wizard layout is measured inside wizard at 360 × 780, all four screens fit. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `wizard` — The admission journey lost data or accepted an empty name.
- `server` — Invalid data reached a write.
- `atomic` — Admission did not produce one complete valid record.
- `layout` — The public entry page is missing.

### Needs

Module 4.4 and the preceding backend units as applicable. WSL, Git, Node, learner-owned Supabase project, network for Auth and the lab database. Start Next.js locally for browser work.

---

## Unit 5.3 — Student import

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m5-u3` / `m5-p3` |
| title | Student import |
| module / position | 5 / 3 |
| guidance | half |
| minutes | `{ min: 780, max: 1140 }` |
| gpis_part | Missing headers stop the whole file. A bad date names the row and the reason. |
| requires | [wsl, node, git, supabase, lab-db, playwright] |

### Outcomes

After this unit you can

1. Separate file and row errors
2. Resolve identities
3. Confirm the preview

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with checking a pile of forms before filing any; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://supabase.com/docs/guides/database) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Separate file and row errors | Missing headers stop the whole file. A bad date names the row and the reason. |
| 2. Resolve identities | Split first word from rest. Class comparison drops case, spaces and punctuation. Near matches require correction. |
| 3. Confirm the preview | Recheck current data, ownership and identity inside one transaction. Confirm once. Name skipped rows and separate phone-only updates. |

**Text diagram** sheet → file validation → row decisions → owner-bound preview → transaction

**Common mistakes**

1. Guess status → operator must know → Explain active default before confirm
2. New class → punctuation ignored → Same canonical class under D-45
3. Duplicate it → invents surname → Row error under D-46

### Guided example — Import a library catalogue

In a scratch folder.

1. (full) Build a sheet with ISBN, Title and Price. An absent Price header rejects the file.
2. (full) Three rows include one text price. Preview names its row and accepts two.
3. (task) Confirm and count the two catalogue entries.
4. (task) Change an ISBN between preview and confirm and explain the conflict.

### Quiz plan (`m5-u3-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | An import contains the three required headers and omits Status. What does the preview explain? | Explain active default before confirm | Guess status (operator must know). Reject whole file (status optional) |
| 2 | J.H.S 3 versus JHS 3? | Same canonical class under D-45 | New class (punctuation ignored). Choose nearest (no fuzzy match) |
| 3 | One-word full name? | Row error under D-46 | Duplicate it (invents surname). Move to middle name (wrong column) |
| 4 | File lacks Class? | Store nothing | Skip one row (header affects all). Use current class (ambiguous) |
| 5 | One bad date among three rows? | Name it and commit the two valid rows | Drop all three (old D-51). Flip day/month (guess) |
| 6 | Existing permanent ID and matching identity? | D-223 allows phone only | Replace DOB (outside exception). Create new enrolment (not a new student) |

### Lab — Student import

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/import/preview.ts`, `src/lib/import/confirm.ts` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Import previewWorkbook(bytes,classes) from preview.ts. Use Name, Class and Date of Birth in the minimal fixture. Add Gender and Parent Phone to a second fixture and verify both layouts. Include ZZ Ama Kyei, ISO DOB, J.H.S 3, then one-word name, 03/04/2015, repeated row and unknown class. Assert row numbers and causes, first word ZZ and remaining surname Ama Kyei. Missing Class gives file error and no token. Missing Status produces visible active/enrolment notice. | `preview` |
| 4 | Using confirmPreview(token,actor,store) from confirm.ts and transactional test store, confirm a preview with two valid rows and one skipped row. Expect two students and memberships, then refuse token reuse and foreign owner. Inject failure on second valid insert: neither survives. | `confirm` |
| 5 | Existing STU-000001 and matching full displayed name (including reordered words per D-224) and DOB: changed non-empty phone updates only phone, with one audit entry; blank leaves it alone. Wrong DOB → conflict/Skip. Repeat identity check at confirm. | `phone` |

**Hints (folded).** Use the current import headers (GPIS decisions D-149 §6 and D-172). Compare preview and commit against a changed stored phone.

**Finished state.** The confirmation receipt names applied and skipped changes. Check with `npx academy check m5-p3`.

### Debugging lab — The month that moved

| Item | Design |
| :--- | :--- |
| Seeded | Three rows with ISO, slash date and written month; slash parser uses host locale. |
| Symptom | Two machines give a different birthday. |
| Fault (builder only) | Parser accepts an ambiguous slash date. |
| Observe | Two machines give a different birthday. |
| Possible causes | Cell type, timezone, locale fallback. |
| Tests | Compare raw values, ISO day, parser branch for slash input. |
| Cause | Parser accepts an ambiguous slash date. |
| Fix | Reject ambiguous dates before conversion. |
| Fixed state | Both machines skip the same row with a date error. |

### Own build

1. Produce a preview summary for two classes.
2. Separate creations, skips and phone updates.
3. Show exact spreadsheet row numbers for every skip.
4. Commit this variation. In `notes/m5-u3.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** The confirmation receipt names applied and skipped changes. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why did the amendment to D-51 distinguish a bad row from a bad file?
2. Which write does D-223 permit and how does D-224 compare names?

**Mastery, without notes**

1. Predict a missing-header outcome.
2. Trace a duplicate.
3. Demonstrate another user cannot confirm.
4. Reconcile the receipt with the committed rows.

**Debugging-lab check** (`m5-p3-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m5-p3-own`). Preview two classes; compare category totals and skipped row numbers. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m5-p3`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db, playwright])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/import/preview.ts`, `src/lib/import/confirm.ts` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| preview | tests | yes | `tests/preview.test.mjs` via files. Import previewWorkbook(bytes,classes) from preview.ts. Use Name, Class and Date of Birth in the minimal fixture. Add Gender and Parent Phone to a second fixture and verify both layouts. Include ZZ Ama Kyei, ISO DOB, J.H.S 3, then one-word name, 03/04/2015, repeated row and unknown class. Assert row numbers and causes, first word ZZ and remaining surname Ama Kyei. Missing Class gives file error and no token. Missing Status produces visible active/enrolment notice. |
| confirm | tests | yes | `tests/confirm.test.mjs` via files. Using confirmPreview(token,actor,store) from confirm.ts and transactional test store, confirm a preview with two valid rows and one skipped row. Expect two students and memberships, then refuse token reuse and foreign owner. Inject failure on second valid insert: neither survives. |
| phone | tests | yes | `tests/phone.test.mjs` via files. Existing STU-000001 and matching full displayed name (including reordered words per D-224) and DOB: changed non-empty phone updates only phone, with one audit entry; blank leaves it alone. Wrong DOB → conflict/Skip. Repeat identity check at confirm. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `preview` — The preview hid a file error, row error or default.
- `confirm` — Confirmation wrote the wrong set or left a partial import.
- `phone` — The phone update changed identity, enrolment or audit history.

### Needs

Module 4.4 and the preceding backend units as applicable. WSL, Git, Node, learner-owned Supabase project, network for Auth and the lab database. Start Next.js locally for browser work.

---

## Unit 5.4 — Submit scores

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m5-u4` / `m5-p4` |
| title | Submit scores |
| module / position | 5 / 4 |
| guidance | half |
| minutes | `{ min: 720, max: 1080 }` |
| gpis_part | A draft can contain zero, blank and ABS. Only the current submitted package feeds previews. |
| requires | [wsl, node, git, supabase, lab-db] |

**Forward migration and check fixtures.** Give JHS 3 mock sittings distinct identities
within the academic year and link marks and submission packages to the selected sitting.
Store the subjects offered for the class and year. In the rolled-back fixture submit two
sittings in one term with different marks. Read back both and verify the first survives.
Compute the slip for the selected sitting and offerings (GPIS decisions D-80 and D-81).
A missing offered subject keeps the slip incomplete. Returning a package and submitting
its correction must preserve the issue history (GPIS decision D-218).

### Outcomes

After this unit you can

1. Separate entry from publication
2. Anchor marks in time
3. Submit the whole subject

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with handing in a complete subject register; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://supabase.com/docs/guides/database) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Separate entry from publication | A draft can contain zero, blank and ABS. Only the current submitted package feeds previews. |
| 2. Anchor marks in time | Use membership, term and subject keys. The maximum belongs to the mark row. |
| 3. Submit the whole subject | Validate the full set and replace it atomically, including submitted partial results. |

**Text diagram** entry → draft → submit whole subject → preview

**Common mistakes**

1. 56 → uses 100 → 40 from the stored maximum (D-171)
2. Write zero → changes meaning → Keep null under D-218
3. Show all latest rows → includes draft → Excluded from issued input

**Planning a project.** Recall the three plans from Project 1.6. Show one edge case for this milestone and how to turn it into a test before implementing it.

### Guided example — Publish a choir list

In a scratch folder.

1. (full) Capture a draft with two voices. The public list remains empty.
2. (full) Publish both entries in one operation. One list version appears.
3. (task) Edit an entry without publishing and inspect the list.
4. (task) Publish again and compare versions.

### Quiz plan (`m5-u4-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Exam 112 of 140 scaled to 50? | 40 from the stored maximum (D-171) | 56 (uses 100). 112 (raw mark) |
| 2 | Blank on submit? | Keep null under D-218 | Write zero (changes meaning). Refuse all blanks (partial allowed) |
| 3 | A new draft? | Excluded from issued input | Show all latest rows (includes draft). Approve it (state removed) |
| 4 | Two students, invalid mark in second? | Reject whole operation | Commit first (partial subject). Clamp mark (hides error) |
| 5 | Before issue? | Authorised user may edit and submit again | Always locked (only after issue). Delete history (no need) |
| 6 | CA raw 49.5 of 60? | 41.25 scaled to 50 | 49.5 (raw). 82.5 (percent, not component) |

### Lab — Submit scores

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Step 1 · Plan the milestone.** In `lab.md`, list the following exact implementation
paths. Before the first change to any of them, commit `requirements.md`, `spec.md`
and `decisions.md` together under `docs/plans/5.4/`. Use the headings in guide §0.4.

- `src/lib/assessments/submit.ts`
- `supabase/migrations/20260504000000_subject_submit.sql`


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/assessments/submit.ts`, `supabase/migrations/*subject_submit*.sql` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Call buildPackage(rows) from submit.ts. Two membership rows with 0 and null keep distinct values. Mark 15.01 of 15 raises field error before any write. ABS survives. A changed roster is rejected at submit. | `package` |
| 4 | Reuse 4.3 score fixture for class, subject, term 900001. Add second membership 900002 to same class/term. As authorised lab ADMIN call submit_subject(class_id,term_id,subject_id,rows_json) with both membership ids and marks. report_rows(class_id,term_id) returns no draft; after submit select membership_id::int from report_rows(900001,900001) order by 1 → 900001,900002. A second call with one invalid part errors and the first package remains. | `visible` |
| 5 | Run configured lint, tsc and build; all exit 0. | `types` |

**Hints (folded).** Compare a package with its draft. Check the scope of the transaction.

**Finished state.** The preview reads only the current submitted subject. Check with `npx academy check m5-p4`.

### Debugging lab — A draft on a report

| Item | Design |
| :--- | :--- |
| Seeded | Two scratch packages, one submitted total 60 and one draft total 80. |
| Symptom | Preview says 80 before submission. |
| Fault (builder only) | The query sorts by newest timestamp without publication status. |
| Observe | Preview says 80 before submission. |
| Possible causes | Bad scaling, wrong roster, draft selected. |
| Tests | Check raw total, compare membership id, inspect returned package state. |
| Cause | The query sorts by newest timestamp without publication status. |
| Fix | Select latest submitted package for the same keys. |
| Fixed state | Preview stays 60 until the second submission. |

### Own build

1. Show a subject progress count.
2. Count blanks separately from ABS.
3. Keep zero visible after reopening the draft.
4. Commit this variation. In `notes/m5-u4.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** The preview reads only the current submitted subject. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-218 allow submitted partial results?
2. Which GPIS D-21 key survives a class move?

**Mastery, without notes**

1. Trace a zero.
2. Trace ABS.
3. Calculate 112/140 scaled to 50.
4. Refuse an invalid second row and compare the first.

**Debugging-lab check** (`m5-p4-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m5-p4-own`). Reopen a draft containing zero, ABS and blank; compare all three counts. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m5-p4`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db])

Add three required `doc` steps for the plans in `docs/plans/5.4/`, one per file,
with the headings in §0.4. Add a required `tests` step for the decision count and
the Git ancestry check in §0.4, using the literal paths in step 1 above.


| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/assessments/submit.ts`, `supabase/migrations/*subject_submit*.sql` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| package | tests | yes | `tests/package.test.mjs` via files. Call buildPackage(rows) from submit.ts. Two membership rows with 0 and null keep distinct values. Mark 15.01 of 15 raises field error before any write. ABS survives. A changed roster is rejected at submit. |
| visible | sql | yes | Reuse 4.3 score fixture for class, subject, term 900001. Add second membership 900002 to same class/term. As authorised lab ADMIN call submit_subject(class_id,term_id,subject_id,rows_json) with both membership ids and marks. report_rows(class_id,term_id) returns no draft; after submit select membership_id::int from report_rows(900001,900001) order by 1 → 900001,900002. A second call with one invalid part errors and the first package remains. |
| types | static | yes | Run configured lint, tsc and build; all exit 0. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `package` — The package changed mark meaning or omitted a roster row.
- `visible` — The report read a draft or a partial replacement.
- `types` — The score workflow failed a project check.

### Needs

Module 4.4 and the preceding backend units as applicable. WSL, Git, Node, learner-owned Supabase project, network for Auth and the lab database. Start Next.js locally for browser work.

---

## Unit 5.5 — Send back and resubmit

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m5-u5` / `m5-p5` |
| title | Send back and resubmit |
| module / position | 5 / 5 |
| guidance | half |
| minutes | `{ min: 720, max: 1080 }` |
| gpis_part | Any issued card or slip for the class and term locks its submitted subjects. |
| requires | [wsl, node, git, supabase, lab-db] |

### Outcomes

After this unit you can

1. Locate the lock
2. Authorise a return
3. Preserve history

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with returning a marked register with a dated note; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://supabase.com/docs/guides/database) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Locate the lock | Any issued card or slip for the class and term locks its submitted subjects. |
| 2. Authorise a return | An active Admin or Root supplies a reason of 1–500 characters for the whole subject. |
| 3. Preserve history | Keep the actor, subject, affected items and reason. A corrected package enters results through submission again. |

**Text diagram** issued → whole subject returned → corrected submission → revised preview

**Common mistakes**

1. Trim silently → loses text → Refuse under D-218
2. Permit own subject → wrong role → Cannot send back
3. One learner → wrong scope → Return all three together

### Guided example — Correct a printed concert programme

In a scratch folder.

1. (full) Issue a programme listing two acts. Editing the issued list is refused.
2. (full) A producer returns the whole running order with a reason.
3. (task) Replace the second act and publish a revision.
4. (task) Read both programmes and compare their identifiers.

### Quiz plan (`m5-u5-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Reason 501 characters? | Refuse under D-218 | Trim silently (loses text). Accept (limit 500) |
| 2 | Assessment role after issue? | Cannot send back | Permit own subject (wrong role). Permit with reason (still wrong role) |
| 3 | Three rows in subject? | Return all three together | One learner (wrong scope). Every class (too broad) |
| 4 | Old snapshot after resubmit? | Unchanged | Replace it (breaks reprint). Hide it (breaks history) |
| 5 | Inactive Root? | Refuse because active status matters | Allow by label (ignores active flag). Allow once (no exception) |
| 6 | New results visible when? | After corrected submission | As each draft saves (not published). After approval (removed) |

### Lab — Send back and resubmit

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/assessments/send-back.ts`, `supabase/migrations/*send_back*.sql` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | In send-back.ts test mayReturn(active,role,reason). Admin and root accept one character and 500; refuse blank, whitespace only, 501, inactive users and assessment. No client-supplied role overrides claims. | `rights` |
| 4 | Seed 5.4 submitted package with two memberships and an issue marker for class/term 900001. As ASSESSMENT call return_subject(900001,900001,900001,'ZZ correction') → error. As ADMIN same call succeeds. select count(*)::int from subject_return_items where subject_id=900001 → 2. UPDATE and DELETE the matching subject_returns as ADMIN → error. Resubmit corrected package then report_rows yields both corrected submitted rows; the return remains. | `return` |

**Hints (folded).** Look at class/term scope. Compare the role on the server with the displayed role.

**Finished state.** A return has an authorised actor, bounded reason and immutable item list. Check with `npx academy check m5-p5`.

### Debugging lab — Only one pupil unlocked

| Item | Design |
| :--- | :--- |
| Seeded | Scratch package with two marks, issued once. Return request identifies a single score. |
| Symptom | One editor opens and the other stays locked. |
| Fault (builder only) | Return was keyed by score instead of whole subject. |
| Observe | One editor opens and the other stays locked. |
| Possible causes | Wrong actor, stale UI, wrong key. |
| Tests | Inspect claims, reload, count affected ids in return history. |
| Cause | Return was keyed by score instead of whole subject. |
| Fix | Use class/term/subject transaction and record all affected ids. |
| Fixed state | Both items are editable after the same authorised return. |

### Own build

1. Build a read-only return timeline.
2. Show actor, reason and subject once per event.
3. Reopen the timeline after resubmission and compare entries.
4. Commit this variation. In `notes/m5-u5.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** A return has an authorised actor, bounded reason and immutable item list. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-218 keep send-back items immutable?
2. What differs between Reprint and Issue Updated in D-218?

**Mastery, without notes**

1. Test 500 characters.
2. Test 501.
3. Compare inactive Root and active Admin.
4. Count return items after resubmission.

**Debugging-lab check** (`m5-p5-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m5-p5-own`). Open the timeline before and after resubmission; compare event identity and reason. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m5-p5`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/assessments/send-back.ts`, `supabase/migrations/*send_back*.sql` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| rights | tests | yes | `tests/rights.test.mjs` via files. In send-back.ts test mayReturn(active,role,reason). Admin and root accept one character and 500; refuse blank, whitespace only, 501, inactive users and assessment. No client-supplied role overrides claims. |
| return | sql | yes | Seed 5.4 submitted package with two memberships and an issue marker for class/term 900001. As ASSESSMENT call return_subject(900001,900001,900001,'ZZ correction') → error. As ADMIN same call succeeds. select count(*)::int from subject_return_items where subject_id=900001 → 2. UPDATE and DELETE the matching subject_returns as ADMIN → error. Resubmit corrected package then report_rows yields both corrected submitted rows; the return remains. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `rights` — A return crossed a role or reason boundary.
- `return` — The database lost the whole-subject boundary or its history.

### Needs

Module 4.4 and the preceding backend units as applicable. WSL, Git, Node, learner-owned Supabase project, network for Auth and the lab database. Start Next.js locally for browser work.

---

## Unit 5.6 — Issue a document

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m5-u6` / `m5-p6` |
| title | Issue a document |
| module / position | 5 / 6 |
| guidance | half |
| minutes | `{ min: 660, max: 1020 }` |
| gpis_part | Copy the submitted data, period, names, layout inputs and verification identity at issue. |
| requires | [wsl, node, git, supabase, lab-db, playwright] |

### Outcomes

After this unit you can

1. Freeze a result
2. Separate three reads
3. Share the print layer

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a signed report whose original stays on file; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://supabase.com/docs/guides/database) (read · 10 min). Teach every quiz concept before the quiz.


| Section | Key idea and small example |
| :--- | :--- |
| 1. Freeze a result | Copy the submitted data, period, names, layout inputs and verification identity at issue. |
| 2. Separate three reads | Preview reads current submissions. Reprint reads an issued snapshot. Issue Updated makes a new identity. |
| 3. Share the print layer | Use a portrait A4 report or slip. ID cards have a separate sheet exception. |

**Text diagram** submitted data → issue A → reprint A; corrected submission → issue B

**Common mistakes**

1. 70 → live read → Old reprint shows 60 under D-218
2. Read first snapshot → stale → Read current submitted inputs
3. Overwrite old record → breaks history → New immutable snapshot

### Guided example — Publish a sports fixture

In a scratch folder.

1. (full) Issue fixture A with kickoff at 10:00. Read it by its issue id.
2. (full) Correct the live kickoff to 11:00 and preview.
3. (task) Reprint A and compare its kickoff.
4. (task) Issue B and verify that both identities still resolve.

### Quiz plan (`m5-u6-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | One mark changes from 60 to 70 after issue? | Old reprint shows 60 under D-218 | 70 (live read). Blank (old data still exists) |
| 2 | Preview changed? | Read current submitted inputs | Read first snapshot (stale). Read draft marks (not submitted) |
| 3 | Issue Updated? | New immutable snapshot | Overwrite old record (breaks history). Print a draft (wrong source) |
| 4 | ID cards on a sheet? | D-34 permits a sheet exception | One A4 per card (wastes sheet). Landscape all reports (D-07 portrait) |
| 5 | Missing numerical score? | Print blank under D-10 | 0 (real mark). Average (invented mark) |
| 6 | Two terms with same student? | Choose the issue’s membership and term | Use present class (wrong period). Merge both (wrong scope) |

### Lab — Issue a document

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start.** Run every command from `~/projects/school-system`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/documents/issue.ts`, `supabase/migrations/*issue_document*.sql` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Reuse 5.4 class/term/subject 900001 and complete submitted marks. As ADMIN call issue_document(student_id,term_id,kind) for 900001,900001,report_card. Keep returned id in a scratch table, copy payload as before. Use 5.5 return and resubmit with changed exam mark, then issue_updated(old_id). Join issued_documents by old/new ids: old.payload=before true, new.payload<>before true, new.id<>old.id true; update or delete old row → error. | `freeze` |
| 4 | Use the saved admin session and two lasting synthetic issues (910101 and 910102). Check the original exam mark of 60 and corrected mark of 70 beside their distinct verification identities. In print view (T35), check both identities again and verify that navigation is hidden. Check A4 portrait in the shared stylesheet. | `print` |

**Hints (folded).** Read the issue payload twice. Compare live keys with stored period data.

**Finished state.** An original and a correction remain printable by separate identities. Check with `npx academy check m5-p6`.

### Debugging lab — A reprint changes class

| Item | Design |
| :--- | :--- |
| Seeded | Scratch issue for Basic 3 followed by a move to Basic 4. |
| Symptom | Old issue shows Basic 4. |
| Fault (builder only) | Reprint joins current membership. |
| Observe | Old issue shows Basic 4. |
| Possible causes | Bad issue, wrong student, live join. |
| Tests | Inspect saved payload, compare student ids, move the student then repeat the read. |
| Cause | Reprint joins current membership. |
| Fix | Render the stored issue data. |
| Fixed state | Old print says Basic 3 after the move. |

### Own build

1. Add an issue history list.
2. Link each version by its own identifier.
3. Show the unchanged original alongside the corrected result.
4. Commit this variation. In `notes/m5-u6.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** An original and a correction remain printable by separate identities. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-33 require a shared print layer?
2. Which D-218 action deliberately publishes a changed result?

**Mastery, without notes**

1. Reprint after a move.
2. Issue a correction.
3. Compare the two identities.
4. Check portrait layout in print preview.

**Debugging-lab check** (`m5-p6-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m5-p6-own`). Follow both issue-history links and compare the original and corrected marks. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m5-p6`, version 1.0.0, no `lab:`, requires [wsl, node, git, supabase, lab-db, playwright])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/documents/issue.ts`, `supabase/migrations/*issue_document*.sql` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| freeze | sql | yes | Reuse 5.4 class/term/subject 900001 and complete submitted marks. As ADMIN call issue_document(student_id,term_id,kind) for 900001,900001,report_card. Keep returned id in a scratch table, copy payload as before. Use 5.5 return and resubmit with changed exam mark, then issue_updated(old_id). Join issued_documents by old/new ids: old.payload=before true, new.payload<>before true, new.id<>old.id true; update or delete old row → error. |
| reprint | page | yes | On screen, visit `/documents/910101/reprint` then `goto: /documents/910102/reprint`. Use `expect_text` for the appropriate labelled mark and verification identity on each. |
| print (T35) | page | yes | `session: admin`, `media: print`. On each of the two reprint URLs use `expect_count: { testid: screen-only, count: 0 }` for labelled shell and action controls, and `expect_text` for the printed mark and identity. |
| paper-size | tests | yes | Check the shared print stylesheet for the portrait A4 rule. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `freeze` — A reprint changed or the revision reused an old identity.
- `print` — The print view read the wrong issue or included navigation.

### Needs

Module 4.4 and the preceding backend units as applicable. WSL, Git, Node, learner-owned Supabase project, network for Auth and the lab database. Start Next.js locally for browser work.

## After module 5 the learner has

A working admission, import and assessment path from school sign-in through a reproducible issued document. The learner can show a refusal and the resulting database state at each boundary.
