# Course design — open questions for the owner

## Owner's decisions (21 November 2026)

All 19 questions are answered. The text after this table keeps the original options as a record.
Where a decision needs a checker or platform change, the last column says so.

| No. | Decision | Change needed |
| :--- | :--- | :--- |
| Q1 | **Separate checks** for the main lab, the debugging lab and the own build (three per unit). Unit 1.1's two named checks become real | Platform: content loader, packaging, CLI lookup, progress storage and site display must support several named checks per unit. Units already built need an update |
| Q2 | **Fade inside module 8**: hints in the first units, none in the last ones. The builder fixes the switch-over unit and updates the course map | Content and `course.yaml` label |
| Q3 | **A person reviews the deployed site** (owner or mentor). The checker still tests the local site | Platform: a "reviewed by a person" record per project, with synthetic data and an access arrangement |
| Q4 | **Teach the checker to click and type**: add actions and a signed-in session setup to the `page` step. A missing app shows as `needs` | Checker: action schema, session handling, time limits, fixtures. Steps marked "(Q4)" in the module files move to this step kind when it exists |
| Q5 | **Keep lessons short; move examples into the guided example.** The builder must make sure every quiz idea is still taught | Content only. The "two-part lesson" plan in modules 1–5 is replaced |
| Q6 | **Show a time range** (for example 12–18 hours) | Schema: `minutes` becomes a range (or two fields); site display |
| Q7 | **Install the test browser once; `academy doctor` opens and closes it** to prove it works and says what is missing | Checker: doctor browser probe and a failure fixture |
| Q8 | **Two separate badges** for Docker labs: one for the written or cloud part, one for the live Docker part | Platform: progress and display contract |
| Q9 | **The Academy's own sign-in page** (`ruftech-academy.vercel.app/sign-in`), looking only, no signing in. Confirms the builder's interim answer | None |
| Q10 | **The learner records two rebuilds** in a document | None |
| Q11 | **Teach only today's rule**: 60 minutes idle, warning at 58 (D-177) | None |
| Q12 | **The learner creates practice staff accounts** in their own project and signs in to save local session files (ignored by Git) | Content: setup per role, expiry and clean-up instructions |
| Q13 | **Match GPIS fully in 5.2**: add gender Other and the parent-phone field by a new migration | Content; earlier fixtures updated once |
| Q14 | **Permanent Student ID and phone-change history in 5.2** | Content |
| Q15 | **The test works out the expected House** from the learner's real Houses in the same transaction | Content |
| Q16 | **Mock sittings and subject offerings in 5.4** | Content |
| Q17 | **A loose time limit plus a written explanation** of the cost | Content |
| Q18 | **Python service on the laptop only**; online hosting is an optional extra | None |
| Q19 | **Separate ID ranges** for temporary and lasting test rows, in one small table | Content: publish the allocation table and update affected tests together |

Module 5 is next in sequence. Its first build decision is how a learner signs in repeatedly as different synthetic staff members. The school’s current idle rule can already be read in D-177. The course still needs an editorial decision about teaching the earlier rule. Module 6 can be built independently while work on the authenticated fixtures is pending.

| Decide before | Questions | What depends on the answer |
| :--- | :--- | :--- |
| First authenticated browser exercise | Q4, Q7, Q12 | Browser installation, staff identities, and what the learner sees when a prerequisite is missing |
| First admissions migration and import workbook | Q13, Q14, Q15 | Gender and phone fields, permanent identifiers, and deterministic House allocation |
| First submission and issue exercise | Q16 | When the practice schema gains subject offerings and mock sittings |
| Publishing or awarding progress | Q1, Q3, Q8 | What a passing check establishes and which work the learner reviews |
| Building the remaining pages | Q2, Q5, Q6, Q9–Q11, Q17–Q19 | Guidance, pacing, reference targets, proof and running costs |

The alternatives below describe build and maintenance costs. Interim treatments already used in designs are identified so an owner decision can be applied consistently.

## Q1 — Which work gets an automatic check?

**Gap.** The loader discovers one `check/` per unit. Unit 1.1 names `m1-p1-debug` and `m1-u1-own`, but neither is a distributable check. The builder seeds a debug subfolder or sibling for lab projects and prints scratch material for repo projects. Debugging and own builds are self-reviewed.

| Option | Cost or consequence |
| :--- | :--- |
| Keep the builder’s interim model | Correct the two references in 1.1 in a separate task. Progress certifies the main lab only. |
| Add required or optional variation steps to the main check | One report remains. More fixtures and path rules are needed, especially when the own build lives in another repository. |
| Support additional named checks per unit | Change content loading, packaging, CLI lookup, progress storage and the site’s display. Existing single-check units need compatibility. |

**Affected:** every module, especially 1.1. The later designs give fixed-state facts for either marking model.

## Q2 — How independent should module 8 be?

**Gap.** The course map says half guided. The curriculum and handoff also describe independent algorithm work. The check cannot distinguish a learner who used hints.

| Option | Cost or consequence |
| :--- | :--- |
| Use half guidance throughout | Keep the split examples and hints in 8.1–8.5. Align the curriculum’s guidance wording. |
| Use independent guidance throughout | Keep the worked examples on different problems, remove hints and hide builder-only faults. Update the map. |
| Fade within the module | Specify the transition unit and update the map label. The builder must maintain two treatments. |

**Affected:** 8.1–8.5, including the optional puzzle. Inputs, public functions and expected results are independent of this decision.

## Q3 — What evidence counts for a deployed site?

**Gap.** A `page` step opens an HTTP loopback address only. A local sign-in page can pass while staging points to the wrong revision. A document step can confirm that a record exists, but cannot visit the recorded deployment.

| Option | Cost or consequence |
| :--- | :--- |
| Local automatic check plus dated hosted self-review | No checker change. The learner records host, revision, time and visible result. The hosted claim remains self-assessed. |
| Add a narrowly scoped deployment probe | Define allowed learner-owned hosts, HTTPS, redirects, timeouts and a missing-network outcome. A public probe cannot prove an authenticated journey. |
| Use a human-reviewed demo | Can cover private views and rollback. Requires reviewer time and an access arrangement using synthetic data. |

**Affected:** 3.1, 7.4, 9.5 and the hosted variant of P.5. The local P.5 service outage can be demonstrated entirely in WSL.

## Q4 — How should a check interact with the application?

**Gap.** A `page` step opens one page and inspects it. It cannot enter a password, move through a wizard, submit a subject or press Reprint.

| Option | Cost or consequence |
| :--- | :--- |
| Ship Playwright-driven Node test files | Uses the present checker. The test loads Playwright from the project. An unavailable app appears as a failed test. |
| Add actions and a session setup contract to `page` | Can represent missing services as `needs`. Requires a schema, secret handling, bounded action time and fixtures for old checks. |
| Check pure functions automatically and self-review the journey | Less browser setup. It leaves broken form wiring and navigation outside automatic evidence. |

**Affected:** interactive units in modules 3, 5, 7 and 9 and P.5. The plans mark interactive tests “Q4”.

## Q5 — How should a long lesson fit the reading limit?

**Gap.** The guide targets about 150 lines. Schema, transaction and identity lessons can each need two concept groups before the lab makes sense.

| Option | Cost or consequence |
| :--- | :--- |
| Two parts inside one lesson, as designed | Preserve ids, quizzes and prerequisites. Add a clear stop after Part A and tie it to the example. |
| Add a unit | Shorter reading and separate mastery checks. Changes the 58-unit map, ids or numbering, project totals and existing references. |
| Move supporting examples to the guided exercise | Retains one short lesson. The builder must ensure every quiz idea has actually been taught. |

**Affected:** heavy units in 3–5, 7.2, 9.4 and P.4.

## Q6 — Are published minutes an allocation or a measured duration?

**Gap.** The guide uses module weeks × 13 hours. Built unit 1.1 is 360 minutes. Units with a deployment, design defence or independent implementation vary widely between learners.

| Option | Cost or consequence |
| :--- | :--- |
| Keep module budgets and distribute them across the eight steps | Preserves the planned calendar. Label the minutes as estimates. |
| Time a small learner pilot | Gives evidence for revision. Requires participants and delays stable estimates. |
| Offer a range to readers | Better represents independent work. The front matter currently requires one number, so a range needs prose or a schema change. |

**Affected:** all modules. Clarify whether an optional puzzle counts inside the four focused weeks of module 8.

## Q7 — Who installs Chromium and verifies the browser?

**Gap.** Importing Playwright and successfully launching its browser are distinct checks. A package installed in one repository need not be resolvable in another.

| Option | Cost or consequence |
| :--- | :--- |
| Per-project Playwright plus its matching Chromium | Document the install once per repository and cache the downloaded browser. Uses bandwidth and disk. |
| A shared browser installation reported by doctor | Less repetition. Must handle version mismatch and make the project resolution path explicit. |
| Add a real launch-and-close probe to doctor | Better diagnosis of missing browser binaries and system dependencies. Requires a CLI change and a failure fixture. This can accompany either install model. |

**Affected:** first browser check in module 3, then 5.1–5.6, 7.4, 9.4–9.5 and P.5.

## Q8 — How is a Docker alternative shown in progress?

**Gap.** The curriculum says “partly done”. The checker has required and optional steps and can report `needs`; it has no partly-done project outcome. A `tests` command that exits nonzero records a failed step even if optional.

| Option | Cost or consequence |
| :--- | :--- |
| Require the common evidence and mark the live Docker step optional | The project can pass on the written or cloud path. Surface which live proof actually ran. |
| Split written and live achievements | Distinguishes knowledge from operating a service. Requires a new progress/display contract. |
| Add a partial outcome | Most direct match to the curriculum. Changes CLI, signing, database summaries and the learner-facing map. |

**Affected:** 4.6 and 7.5, plus the optional 7.2 traffic and P.4 packaging extras. `requires` is informative and cannot choose an execution branch.

## Q9 — Which site is used for the request trace?

**Gap.** The earlier curriculum leaves the target unspecified. The builder used the Academy’s own sign-in page with GET requests only.

| Option | Cost or consequence |
| :--- | :--- |
| Keep the Academy sign-in page | A real deployment on the course stack. Availability and redirects can change outside a learner session. |
| Ship a local teaching page | Repeatable offline. It cannot demonstrate public DNS and hosted TLS in the same way. |
| Supply a dated recording as an offline alternative | Resilient when the site is down. Refresh the recording when expected headers or hosting change. |

**Affected:** 1.5 and its first network diagnosis. The existing builder target is `ruftech-academy.vercel.app/sign-in`.

## Q10 — What proves migrations replay from empty?

**Gap.** A `sql` step starts on an already marked practice database and rolls back. It cannot establish how that state was built.

| Option | Cost or consequence |
| :--- | :--- |
| Record two learner-run replays and compare migrations and catalogue | Works today. Logs are self-reported and must identify the disposable database. |
| Replay in an ephemeral local database | Strong automatic evidence with isolation. Adds database tooling, migrations compatible with Supabase features and possibly Docker. |
| Use an explicitly designated second empty lab project | Greater hosted fidelity. Uses a project slot, credentials and recovery time. |

**Affected:** 4.1 and later claims about a release being reproducible. Current-state SQL assertions remain useful under every option.

## Q11 — How should 5.1 teach the idle-time amendment?

**Evidence.** GPIS does settle the current behaviour. D-170 shortened inactivity to 15 minutes. D-177 explicitly amended that number to **60 minutes**, with a warning **two minutes before expiry**. The failed-password rule stays at five attempts and 30 minutes. D-204’s lock countdown is a third, display-only concern. The course documents do not say how much amendment history to teach.

| Option | Cost or consequence |
| :--- | :--- |
| Teach the current rule and cite D-177 | Least reading. Test warning at minute 58 and expiry at 60 separately from password lockout. |
| Teach both decisions as a short change-reading exercise | Adds reading and a fake-clock example. Label 15 minutes historical everywhere it appears. |

**Affected:** 5.1 lesson and quiz, 7.1 clock fixtures. No school policy decision is needed.

## Q12 — How are repeatable authenticated browser sessions provisioned?

**Gap.** Supabase credentials identify a project, but they do not supply active synthetic Admin, Root, Assessment or assigned Teacher accounts. The browser step opens a fresh context. A browser storage-state file is itself sensitive and eventually expires.

| Option | Cost or consequence |
| :--- | :--- |
| Learner creates practice staff and signs in to refresh ignored local session files | Uses real Auth and current role claims. Requires setup per role, expiry instructions and reliable cleanup. |
| Add a supported local account fixture and session bootstrap | Reproducible and faster. Requires a trusted provisioning boundary outside the app, plus isolation from every hosted school project. |
| Exercise role combinations offline and require only one manual signed-in browser demo | Fewer local accounts. Some role-specific journeys lose end-to-end automatic proof. |

**Affected:** first blocker for 5.1 and 5.2, then 5.5–5.6, 9.4, P.5. No option requires a public bypass or a privileged key in application source.

## Q13 — How far does the admissions schema grow in module 5?

**Gap.** Module 4 fixes `students.gender` to female or male and stores `guardian_phone`. D-262’s form also has Other. D-42 and D-223 name the imported field `parent_phone`. D-262 preserves other admission rules beyond the four-screen layout. The school behaviour is documented; the course migration boundary is not.

| Option | Cost or consequence |
| :--- | :--- |
| Add the full required field migration in 5.2 | Learners can accept Other and use one explicit parent-phone contract in 5.3. Requires mapping existing practice rows and rerunning earlier checks. |
| Teach a deliberately smaller slice, labelled in the lab | Retains earlier fixtures. The text must identify each omitted school field and avoid claiming full D-262 parity. |
| Introduce an adapter with forward migration later | Keeps earlier code working. The builder must test both representations and avoid two writable phone fields. |

**Affected:** 5.2–5.3 and the capstone when it reuses admissions. Whichever option is selected, admission numbering uses the actual admission calendar year under D-48; an academic-year label alone is insufficient.

## Q14 — When does the permanent Student ID enter the practice schema?

**Gap.** A numeric row id, an admission number and D-223’s permanent Student ID are different identities. Module 4 does not define a permanent code or the immutable phone-change audit record. D-224 requires exact DOB and the same complete normalised name words with their multiplicities, allowing reordered words.

| Option | Cost or consequence |
| :--- | :--- |
| Introduce permanent codes and audit history in 5.2 | Enables the full 5.3 existing-student path. Adds a backfill, uniqueness tests and fixtures for old rows. |
| Add them by a separate forward migration in 5.3 | Keeps manual admission smaller. Import must test identity generation and change audit before the workbook cases. |
| Teach a create-only core and explicitly defer the exception | Shortens the unit. The real GPIS exception still needs coverage in comparison and a later implementation task; do not silently update by name. |

**Affected:** 5.3 phone-only acceptance cases. Valid matches never create a second student or enrolment.

## Q15 — How should a House-allocation test control the whole candidate set?

**Gap.** Module 4’s own build can already have Houses. In a populated lab, two fresh empty Houses named ZZ A and ZZ B can lose an alphabetical tie to an existing House. Rolling back the test restores writes but does not remove that pre-existing input.

| Option | Cost or consequence |
| :--- | :--- |
| Read the full eligible House set and compute the expected winner independently | Works on existing practice data. The test must compute actual counts and the tie-break from the same transaction. |
| Give the allocator a course-owned isolated fixture schema | Stable exact-name assertions. Adds schema plumbing and an equivalence test for the actual admission procedure. |
| Use a documented clean practice snapshot for this proof | Smallest literal test. Requires resettable synthetic state and a separate path for learners preserving their progress. |

**Affected:** 5.2 automatic House proof and concurrent admission acceptance. D-70 itself is settled: choose fewest students, then alphabetically.

## Q16 — When should mock sittings and offerings enter the reporting contract?

**Gap.** Module 4’s score key is membership, term and subject. D-80/D-81 additionally require the chosen JHS 3 mock sitting and the offerings for the relevant class and year. A second sitting in the same term must not overwrite the first. D-218 also distinguishes a subject’s workflow label from the published row state: a corrected package may appear as resubmitted while only submitted result rows are eligible.

| Option | Cost or consequence |
| :--- | :--- |
| Introduce offerings, sitting keys and the submission projection in 5.4 | Strong continuity through 5.6 and 9.4. Increases the first workflow migration and its rollback fixtures. |
| Limit module 5’s first issue demo to a non-JHS 3 card and introduce the sitting migration before 8.2/9.4 | Smaller backend increment. The later builder must add a two-sitting regression before claiming slip issuance. |
| Supply an isolated course fixture for two sittings before learners design the persistent model | Allows early algorithm practice. An end-to-end capstone still needs real migrated keys and separate draft, submitted, returned and resubmitted subject states. |

**Affected:** 5.4–5.6, 8.2, 9.2–9.4 and P.4. In every option retain the original issue identity, use a distinct updated issue and deny official issue of an incomplete slip.

## Q17 — What makes a timed algorithm check fair on a slower learner machine?

**Gap.** The curriculum calls for a time limit. It specifies neither a supported CPU baseline nor a calibration process. Complexity cannot be proved by elapsed time alone.

| Option | Cost or consequence |
| :--- | :--- |
| Pilot the proposed fixed limits on the slowest supported WSL machine | Simple output and easy reproduction. Needs representative hardware and a policy for contention. |
| Compare to a warmed reference workload on the same machine | More portable. Requires a trusted calibration input, upper bound and maintenance across Node versions. |
| Keep a gross timeout and grade complexity evidence separately | Fewer environment-related failures. More human assessment of complexity, especially for near-quadratic solutions. |

**Affected:** 8.1 and optional 8.5. Correctness and the 100,000-score input remain part of 8.1.

## Q18 — Where should the optional hosted Python service run?

**Gap.** P.4 specifies a WSL process and optional container. The network list names Vercel and Supabase. A hosted Next.js deployment cannot reach a service bound to a learner’s laptop loopback address. No persistent Python host, cost ceiling or credential lifecycle has been selected.

| Option | Cost or consequence |
| :--- | :--- |
| Require the joined flow locally and treat a hosted integration as an extra | Works with the documented accounts. Hosting evidence covers only what was actually deployed. |
| Select a supported managed Python host | Gives an end-to-end remote demo. Requires a pricing check, TLS, secret bindings, health checks and a cold-start budget. |
| Supply a course-managed synthetic reporting endpoint | Easier to demonstrate a remote call. Adds course operations and does not prove the learner’s own Python deployment. |

**Affected:** P.5 deployment and P.6 cost comparison. P.4’s required local WSL path works under all three choices.

## Q19 — How are persistent and rolled-back fixtures kept apart?

**Gap.** A browser or second Python connection cannot see uncommitted rows inside a checker SQL transaction. Several documents use the 900001 range for synthetic data. A persistent demo row with the same key can collide with a later rolled-back setup.

| Option | Cost or consequence |
| :--- | :--- |
| Reserve disjoint subranges within the ZZ practice namespace | Deterministic fixtures across processes. Publish one small allocation table and update affected tests together. |
| Seed versioned demo datasets separately from transaction-only fixtures | Browser, Auth and Python can share one stable demo. Needs an idempotent loader, narrowly scoped cleanup and clear reset instructions. |
| Use separate disposable databases for cross-process proof | Strong isolation. Requires more project slots or local database setup and more time per run. |

**Affected:** 5.2, 5.5–5.6, 7.6, 9.4 and P.4–P.5. A restore test must read the row the learner restored; inserting it inside the checker would invalidate the proof.
