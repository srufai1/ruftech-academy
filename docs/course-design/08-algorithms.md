# Module 8 — Algorithms and problem solving

| Unit | Title | Project | Kind | Level | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 8.1 | Ranking at scale | m8-p1 | Repo | half [Q2] | 660 | 5 |
| 8.2 | BECE aggregate | m8-p2 | Repo | half [Q2] | 660 | 5 |
| 8.3 | Oldest debt first | m8-p3 | Repo | half [Q2] | 660 | 4 |
| 8.4 | Search | m8-p4 | Repo | half [Q2] | 660 | 4 |
| 8.5 | Number puzzle (optional) | m8-p5 | Repo | half [Q2] | 480 | 5 |

## Module rules (decided here)

Q2 is open. The tables show half guidance from course.yaml as a provisional layout. The alternative independent layout keeps the different-subject worked example, removes folded hints and shows only the symptom of the debugging exercise. Both layouts use the same contracts, outputs and checks. Unit 8.5 is optional in the course; its steps are required when attempted. Time limits apply to the computation in a warmed Node process, with a separate generous runner timeout. Do not use timing as a proof of complexity.

Use the eight-step sequence, review checklist and reflection in 00-guide.md. Use text diagrams. Debugging and own builds are self-reviewed [Q1]. For each own build commit the variation and put the comparison in `notes/<unit-id>.md`. Read GPIS after a pass, or after a written 30-minute attempt in a half-guided unit.

## File and interface contract

Print the paths and the named inputs, outputs and routes from the check plan in the corresponding lab.

| Unit | Deliverables relative to its working directory |
| :--- | :--- |
| 8.1 | src/lib/ranking.ts; docs/algorithms/ranking.md |
| 8.2 | src/lib/algorithms/aggregate.ts; tests/aggregate.test.ts |
| 8.3 | src/lib/algorithms/allocation.ts; tests/allocation.test.ts |
| 8.4 | src/lib/algorithms/search.ts; docs/algorithms/search.md |
| 8.5 | src/lib/algorithms/factors.ts; docs/algorithms/factors.md |

## GPIS rules used in this module

| Source in the read-only GPIS | Text to use |
| :--- | :--- |
| D-02, D-03, D-04, Q-07 | “Ties share a position; the next position skips ahead by the number of tied students.” Use the class total, active roll and open memberships. An incomplete subject adds nothing. No JHS 3 class position. |
| D-01, D-10, D-27, D-80, D-162, D-171 | “Missing subject scores print blank”. Stored maxima, including 140 for JHS Integrated Science, drive scaling. JHS 3 mocks use 30 + 70 and a separate grade scale. |
| D-81, D-218 | “Best Six = ALL core subjects + the best 2 electives”. Both sums use the same selected subjects. Only submitted results can supply a final. |
| D-90, D-124 | “New cash settles oldest outstanding academic-year/term debt first, then oldest original charge posting time within that period, with ID as the deterministic tie-breaker.” No overpayment or credit. |
| D-247 | “Each typed word must appear somewhere in the student’s first, middle or last name.” Order is immaterial; ignore full stops after initials. |

---

## Unit 8.1 — Ranking at scale

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m8-u1` / `m8-p1` |
| title | Ranking at scale |
| module / position | 8 / 1 |
| guidance | half (provisional, Q2) |
| minutes | 660 |
| gpis_part | Sort once, then scan tied groups. The next rank equals one plus the count strictly above. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Preserve competition positions
2. Return in input order
3. Measure growth

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Preserve competition positions | Sort once, then scan tied groups. The next rank equals one plus the count strictly above. |
| 2. Return in input order | Keep original indices while sorting a copy. Check frozen arrays. |
| 3. Measure growth | Use repeated and distinct totals, separate preparation from ranking, state time and memory costs. |

**Text diagram** original index → sort → group scan → original order

**Common mistakes**

1. 1,1,2 → dense rank → 1,1,3
2. 1,1,3 → sorted output → 3,1,1
3. Disqualify → missing adds nothing → Total 60 under Q-07

### Guided example — Race results

In a scratch folder.

1. (full) List finishes 12,10,10 seconds. Lower times win, ties share first.
2. (full) Sort with original lane ids; equal 10s share rank 1, 12 gets 3.
3. (task) Reverse lanes and restore result to lane order.
4. (task) Repeat with every runner tied.

### Quiz plan (`m8-u1-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 90,90,80 under D-02? | 1,1,3 | 1,1,2 (dense rank). 1,2,3 (breaks ties) |
| 2 | 80,90,90 in input order? | 3,1,1 | 1,1,3 (sorted output). 2,1,1 (dense rank) |
| 3 | One student with null and 60? | Total 60 under Q-07 | Disqualify (missing adds nothing). Average 30 (ranking uses total) |
| 4 | Withdrawn highest scorer? | Exclude before ranking | Rank then remove (gap persists). Keep as active (wrong cohort) |
| 5 | All equal across 100,000 records? | Every position is 1 | Positions by id (breaks ties). Position zero (one-based) |
| 6 | One full scan per student? | Quadratic comparisons | Linear (ignores outer loop). Logarithmic (no halving) |

### Lab — Ranking at scale

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/ranking.ts`, `docs/algorithms/ranking.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | Import competitionRanks and rankClass from src/lib/ranking.ts using the 2.2 interfaces. Frozen [70,90,70,80] → [3,1,3,2]; [], [0], 200 equal values. One withdrawn highest scorer does not move active positions. Include an incomplete subject and compare old/new module 2 fixtures. | `positions` |
| 4 | Warm with 1,000 totals then rank 100,000 generated as i%100. In input order rank(99)=1, rank(98)=1001 and rank(0)=99001. Compare all entries; test duration for the one call under five seconds, outer timeout 30s. | `load` |
| 5 | docs/algorithms/ranking.md: Sort, Scan, Memory, Measurement. Include O(n log n) sort, O(n) scan, cost of restoring order and measured machine/runtime; 20 words per heading. | `cost` |

**Hints (folded).** Look at src/lib/ranking.ts. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Use repeated and distinct totals, separate preparation from ranking, state time and memory costs. Check with `npx academy check m8-p1`.

### Debugging lab — The missing gap

| Item | Design |
| :--- | :--- |
| Seeded | Scratch list 75,70,70,65; implementation increments rank per distinct score. |
| Symptom | Last position is 3. |
| Fault (builder only) | Dense ranking ignores size of the tie. |
| Observe | Last position is 3. |
| Possible causes | Sort direction, equality test, rank advance. |
| Tests | Inspect sorted pairs, equal pair identity, count strictly higher than 65. |
| Cause | Dense ranking ignores size of the tie. |
| Fix | Advance by size of tied group. |
| Fixed state | Positions 1,2,2,4 even on shuffled input. |

### Own build

1. Compare a slow oracle on 50 totals.
2. Add three-way ties.
3. Report warm timings on two input sizes.
4. Commit this variation. In `notes/m8-u1.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Use repeated and distinct totals, separate preparation from ranking, state time and memory costs. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. How does src/lib/assessments/rank.ts implement D-02?
2. Why does D-04 exclude a withdrawn learner even with a high total?

**Mastery, without notes**

1. Predict a three-way tie.
2. Check a frozen input.
3. Time two data sizes.
4. Defend the space bound.

### Check plan (`m8-p1`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/ranking.ts`, `docs/algorithms/ranking.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| positions | tests | yes | `tests/positions.test.mjs` via files. Import competitionRanks and rankClass from src/lib/ranking.ts using the 2.2 interfaces. Frozen [70,90,70,80] → [3,1,3,2]; [], [0], 200 equal values. One withdrawn highest scorer does not move active positions. Include an incomplete subject and compare old/new module 2 fixtures. |
| load | tests | yes | `tests/load.test.mjs` via files. Warm with 1,000 totals then rank 100,000 generated as i%100. In input order rank(99)=1, rank(98)=1001 and rank(0)=99001. Compare all entries; test duration for the one call under five seconds, outer timeout 30s. |
| cost | doc | yes | docs/algorithms/ranking.md: Sort, Scan, Memory, Measurement. Include O(n log n) sort, O(n) scan, cost of restoring order and measured machine/runtime; 20 words per heading. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `positions` — A tie, cohort or input order changed.
- `load` — The large class returned wrong positions or exceeded five seconds.
- `cost` — The complexity account misses a stage.

### Needs

Module 2’s typed functions and tests. WSL, Node and Git. All fixtures are synthetic and offline.

---

## Unit 8.2 — BECE aggregate

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m8-u2` / `m8-p2` |
| title | BECE aggregate |
| module / position | 8 / 2 |
| guidance | half (provisional, Q2) |
| minutes | 660 |
| gpis_part | Read kind, display order and submitted final for each offering for the sitting. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Select the eligible curriculum
2. Use one selected set
3. Report incompleteness

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Select the eligible curriculum | Read kind, display order and submitted final for each offering for the sitting. |
| 2. Use one selected set | Choose every core and two electives with highest final. Break equal-score ties by earlier display order. |
| 3. Report incompleteness | Require all curriculum results, at least one core and at least two electives. A missing grade leaves both sums unavailable. |

**Text diagram** offerings → complete? → selected IDs → raw and grade sums

**Common mistakes**

1. Raw 426 and aggregate 6 → subject count → Raw 426 and aggregate 14
2. Both 1 → rounds up → Grades 1 and 2
3. Pick four → hard-coded → Count all five

### Guided example — Count exhibition entries

In a scratch folder.

1. (full) Count all compulsory entries and two best optional entries by judge score.
2. (full) For compulsory 20 and options 19,18,17 choose 20,19,18; total 57.
3. (task) Tie two optional entries and use programme order.
4. (task) Remove one result and show an incomplete label.

### Quiz plan (`m8-u2-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 72,68,75,70,80,61 under D-81? | Raw 426 and aggregate 14 | Raw 426 and aggregate 6 (subject count). Raw 14 and aggregate 426 (reversed) |
| 2 | 80 and 79.99? | Grades 1 and 2 | Both 1 (rounds up). Both 2 (misses inclusive edge) |
| 3 | Five core offerings? | Count all five | Pick four (hard-coded). Pick best core only (wrong set) |
| 4 | Third elective blank? | Both totals unavailable | Use first two (unverified selection). Grade 9 (blank is not a score) |
| 5 | Electives tied on final? | Earlier display order is named | Sort by subject name (wrong tie-break). Count three (limit two) |
| 6 | Only one elective offered? | Incomplete | Duplicate elective (invented result). Accept one (requires two) |

### Lab — BECE aggregate

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/algorithms/aggregate.ts`, `tests/aggregate.test.ts` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | gradeFromTotal(number) in aggregate.ts. At 80,70,65,60,55,50,45,40 expect 1..8 respectively. Test each threshold minus 0.01, plus zero → 9 and 100 → 1. | `bands` |
| 4 | aggregate(offerings) takes [{id,kind,displayOrder,final,state}]. Return {complete,raw,aggregate,countedIds}; incomplete gives false,null,null,[]; complete uses core ids in display order then electives best-first. Four core finals 72,68,75,70 and electives 80,61,20 submitted → true,426,14, ids of first six. Tie 61 with another 61 and swap input order; earlier displayOrder wins. Fifth core 80 increases raw to 506 and grade sum to 15. | `selection` |
| 5 | Remove one elective offering leaving just one; set an unselected elective to draft or null; remove all core offerings. Every case is incomplete. A submitted zero is grade 9 and remains a number. No class position or D-01 remark in outputs. | `incomplete` |

**Hints (folded).** Look at src/lib/algorithms/aggregate.ts. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Require all curriculum results, at least one core and at least two electives. A missing grade leaves both sums unavailable. Check with `npx academy check m8-p2`.

### Debugging lab — Two sums, two lists

| Item | Design |
| :--- | :--- |
| Seeded | Scratch offerings include three electives 80,61,20. Raw uses all three; grades use best two. |
| Symptom | Raw rises by 20 but aggregate stays fixed. |
| Fault (builder only) | Two separate selection loops. |
| Observe | Raw rises by 20 but aggregate stays fixed. |
| Possible causes | Wrong band, wrong maximum, different subject sets. |
| Tests | Compare grade for 20, check finals, print ids contributing to each sum. |
| Cause | Two separate selection loops. |
| Fix | Select once and feed both sums. |
| Fixed state | Example remains 426 and 14 with or without the 20. |

### Own build

1. Generate a year with five cores.
2. Add two tied electives and stable display order.
3. Show an incomplete slip with known rows retained.
4. Commit this variation. In `notes/m8-u2.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Require all curriculum results, at least one core and at least two electives. A missing grade leaves both sums unavailable. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Where does src/lib/assessments/report-card.ts put each grade boundary?
2. How does D-218 amend the eligibility language in D-81?

**Mastery, without notes**

1. Recreate the 426 example.
2. Test all grade boundaries.
3. Explain an unused blank elective.
4. Prove equal-score selection is stable.

### Check plan (`m8-p2`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/algorithms/aggregate.ts`, `tests/aggregate.test.ts` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| bands | tests | yes | `tests/bands.test.mjs` via files. gradeFromTotal(number) in aggregate.ts. At 80,70,65,60,55,50,45,40 expect 1..8 respectively. Test each threshold minus 0.01, plus zero → 9 and 100 → 1. |
| selection | tests | yes | `tests/selection.test.mjs` via files. aggregate(offerings) takes [{id,kind,displayOrder,final,state}]. Return {complete,raw,aggregate,countedIds}; incomplete gives false,null,null,[]; complete uses core ids in display order then electives best-first. Four core finals 72,68,75,70 and electives 80,61,20 submitted → true,426,14, ids of first six. Tie 61 with another 61 and swap input order; earlier displayOrder wins. Fifth core 80 increases raw to 506 and grade sum to 15. |
| incomplete | tests | yes | `tests/incomplete.test.mjs` via files. Remove one elective offering leaving just one; set an unselected elective to draft or null; remove all core offerings. Every case is incomplete. A submitted zero is grade 9 and remains a number. No class position or D-01 remark in outputs. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `bands` — A boundary returned the wrong grade.
- `selection` — The two totals or selected subjects disagree.
- `incomplete` — The slip counted incomplete or ineligible results.

### Needs

Module 2’s typed functions and tests. WSL, Node and Git. All fixtures are synthetic and offline.

---

## Unit 8.3 — Oldest debt first

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m8-u3` / `m8-p3` |
| title | Oldest debt first |
| module / position | 8 / 3 |
| guidance | half (provisional, Q2) |
| minutes | 660 |
| gpis_part | Sort by academic year, term, posting time and id. Posting date alone can give the wrong order. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Compare original periods
2. Preserve exact money
3. Reconcile allocations

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Compare original periods | Sort by academic year, term, posting time and id. Posting date alone can give the wrong order. |
| 2. Preserve exact money | Parse decimal strings into integer pesewas; apply at most the outstanding amount. |
| 3. Reconcile allocations | Immutable new lines sum to the payment. Overpayment produces no lines and no credit. |

**Text diagram** payment → sorted outstanding debt → immutable lines → balance

**Common mistakes**

1. 3 and 3 → not FIFO → Allocate 4 and 2
2. Largest debt first → not specified → Lower original id first
3. Older timestamp first → secondary key → Older period still first

### Guided example — Fill library supply orders

In a scratch folder.

1. (full) Place two older orders for 4 and 6 packs, then one newer order for 3.
2. (full) Deliver 7 packs; first order receives 4 and second 3.
3. (task) Change posting order inside a single period.
4. (task) Refuse 14 packs when only 13 are due.

### Quiz plan (`m8-u3-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | GHS 6 against GHS 4 then GHS 5? | Allocate 4 and 2 | 3 and 3 (not FIFO). 4 and 5 (exceeds payment) |
| 2 | D-124 same period/time? | Lower original id first | Largest debt first (not specified). Random (not deterministic) |
| 3 | Older period posted later? | Older period still first | Older timestamp first (secondary key). Split equally (wrong rule) |
| 4 | GHS 0.10 + 0.20? | 30 pesewas exactly | Round binary residual later (avoidable drift). Three pesewas (wrong scale) |
| 5 | GHS 10.01 against 10.00? | Reject overpayment | Store credit (D-90 forbids). Drop 0.01 (loses money) |
| 6 | Original lines after another payment? | Remain immutable | Redistribute (changes history). Delete settled rows (loses audit) |

### Lab — Oldest debt first

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/algorithms/allocation.ts`, `tests/allocation.test.ts` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | allocate(charges,payment) from allocation.ts. Charge fields id,year,term,postedAt,outstanding decimal string; output [{chargeId,amount}] two decimals. IDs 10,11 at identical older term/time owe 4.00,5.00; id 12 newer term but earlier timestamp owes 2.00. Shuffled input with payment 6.00 → [{10,4.00},{11,2.00}] in that order, decimal strings. Input remains unchanged. | `allocation` |
| 4 | Balances 0.10 and 0.20, payment 0.30, exactly two lines. With 0.31 reject whole call (RangeError), no mutation. Reject negative, zero or more than two decimal places. Skip zero outstanding rows. Repeat frozen input with same payment to obtain identical output. | `exact` |

**Hints (folded).** Look at src/lib/algorithms/allocation.ts. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Immutable new lines sum to the payment. Overpayment produces no lines and no credit. Check with `npx academy check m8-p3`.

### Debugging lab — The newest arrear wins

| Item | Design |
| :--- | :--- |
| Seeded | Older term bill was posted after the newer bill. |
| Symptom | Newer term receives first payment. |
| Fault (builder only) | Sort begins with posting time. |
| Observe | Newer term receives first payment. |
| Possible causes | Wrong remaining amount, wrong term, wrong sort key. |
| Tests | Inspect balances, label periods, reverse timestamps keeping periods fixed. |
| Cause | Sort begins with posting time. |
| Fix | Order by original period before timestamp and id. |
| Fixed state | Older debt is paid first in both arrangements. |

### Own build

1. Build a per-period before/after summary.
2. Include a partial settlement.
3. Reconcile opening less payment to closing exactly.
4. Commit this variation. In `notes/m8-u3.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Immutable new lines sum to the payment. Overpayment produces no lines and no credit. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. Why does D-124 preserve original charge periods?
2. Which D-90 constraint prevents turning overpayment into credit?

**Mastery, without notes**

1. Allocate three small charges.
2. Construct a timestamp tie.
3. Reject an extra pesewa.
4. Prove conservation.

### Check plan (`m8-p3`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/algorithms/allocation.ts`, `tests/allocation.test.ts` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| allocation | tests | yes | `tests/allocation.test.mjs` via files. allocate(charges,payment) from allocation.ts. Charge fields id,year,term,postedAt,outstanding decimal string; output [{chargeId,amount}] two decimals. IDs 10,11 at identical older term/time owe 4.00,5.00; id 12 newer term but earlier timestamp owes 2.00. Shuffled input with payment 6.00 → [{10,4.00},{11,2.00}] in that order, decimal strings. Input remains unchanged. |
| exact | tests | yes | `tests/exact.test.mjs` via files. Balances 0.10 and 0.20, payment 0.30, exactly two lines. With 0.31 reject whole call (RangeError), no mutation. Reject negative, zero or more than two decimal places. Skip zero outstanding rows. Repeat frozen input with same payment to obtain identical output. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `allocation` — The payment settled the wrong charge or amount.
- `exact` — The allocation lost money or accepted an invalid payment.

### Needs

Module 2’s typed functions and tests. WSL, Node and Git. All fixtures are synthetic and offline.

---

## Unit 8.4 — Search

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m8-u4` / `m8-p4` |
| title | Search |
| module / position | 8 / 4 |
| guidance | half (provisional, Q2) |
| minutes | 660 |
| gpis_part | Ignore case, repeated whitespace and full stops after initials under D-247. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Normalise input
2. Match all words
3. Compare equal work

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Normalise input | Ignore case, repeated whitespace and full stops after initials under D-247. |
| 2. Match all words | Each word may occur anywhere in the name. Preserve roster order across results. |
| 3. Compare equal work | Benchmark normalising per query versus precomputed normalised names. Check result equality before timing. |

**Text diagram** text → tokens → all-word match → ordered IDs

**Common mistakes**

1. Different students → word order irrelevant → Same match under D-247
2. Include it → uses OR → Exclude the row
3. Drop every capital → loses words → Normalise consistently

### Guided example — Search a shelf catalogue

In a scratch folder.

1. (full) Index titles River Atlas and Atlas of Roads. Search atlas returns both.
2. (full) Search roads atlas; only Atlas of Roads remains.
3. (task) Repeat with reversed words and mixed case.
4. (task) Precompute title text and time the same queries.

### Quiz plan (`m8-u4-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Adu O. Godfred versus Godfred O Adu? | Same match under D-247 | Different students (word order irrelevant). No match (period ignored) |
| 2 | One of two typed words missing? | Exclude the row | Include it (uses OR). Guess a similar name (no fuzzy rule) |
| 3 | Case changes? | Normalise consistently | Drop every capital (loses words). Sort by case (wrong operation) |
| 4 | Faster run returns fewer rows? | Fix equivalence before comparing | Declare victory (different work). Ignore misses (incorrect search) |
| 5 | Five runs on one warm cache? | Describe warm conditions | Claim cold latency (not measured). Use slowest only (unrepresentative) |
| 6 | D-02 90,90,80 ranks? | 1,1,3; search must not change stored ranking | 1,1,2 (dense). 1,2,3 (no ties) |

### Lab — Search

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/algorithms/search.ts`, `docs/algorithms/search.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | search(rows,query) and makeSearchIndex(rows).search(query) in search.ts return matching ids in original order. Rows 1 Godfred O. Adu, 2 Ama Adu, 3 Godfred Kyei. Queries Adu O. Godfred → [1], godfred adu → [1], adu → [1,2], adu kyei → [], empty → all (course list UI). Evaluate substring inputs, whitespace and swapped words; both implementations identical. | `matches` |
| 4 | docs/algorithms/search.md: Inputs, Correctness, Timing, Limits. Fixed 10,000 synthetic names and 100 queries; separate index build and query costs; five warmed repetitions with medians, runtime version, peak memory estimate and cold-start caveat. No fixed speedup required. | `benchmark` |

**Hints (folded).** Look at src/lib/algorithms/search.ts. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Benchmark normalising per query versus precomputed normalised names. Check result equality before timing. Check with `npx academy check m8-p4`.

### Debugging lab — Only the first word matters

| Item | Design |
| :--- | :--- |
| Seeded | Scratch matcher returns after first matched word; rows contain two Adus. |
| Symptom | Adu Kyei returns both Adus although neither is Kyei. |
| Fault (builder only) | Any-word predicate replaces all-word predicate. |
| Observe | Adu Kyei returns both Adus although neither is Kyei. |
| Possible causes | Token loss, punctuation, any-word logic. |
| Tests | Inspect tokens, try plain text, add one absent token. |
| Cause | Any-word predicate replaces all-word predicate. |
| Fix | Require all tokens for a row. |
| Fixed state | Adu Kyei returns no row in the fixture. |

### Own build

1. Benchmark short and long multi-word queries.
2. Keep identical result order.
3. Explain when precomputation is wasted.
4. Commit this variation. In `notes/m8-u4.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Benchmark normalising per query versus precomputed normalised names. Check result equality before timing. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. How does src/lib/students/name-class-search.ts treat full stops?
2. Why does D-247 leave admission-number and Student-ID search unchanged?

**Mastery, without notes**

1. Test reverse order.
2. Test one missing word.
3. Prove equivalence.
4. Defend a benchmark limit.

### Check plan (`m8-p4`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/algorithms/search.ts`, `docs/algorithms/search.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| matches | tests | yes | `tests/matches.test.mjs` via files. search(rows,query) and makeSearchIndex(rows).search(query) in search.ts return matching ids in original order. Rows 1 Godfred O. Adu, 2 Ama Adu, 3 Godfred Kyei. Queries Adu O. Godfred → [1], godfred adu → [1], adu → [1,2], adu kyei → [], empty → all (course list UI). Evaluate substring inputs, whitespace and swapped words; both implementations identical. |
| benchmark | doc | yes | docs/algorithms/search.md: Inputs, Correctness, Timing, Limits. Fixed 10,000 synthetic names and 100 queries; separate index build and query costs; five warmed repetitions with medians, runtime version, peak memory estimate and cold-start caveat. No fixed speedup required. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `matches` — A name matched the wrong words or order.
- `benchmark` — The performance comparison lacks equivalent inputs or stated limits.

### Needs

Module 2’s typed functions and tests. WSL, Node and Git. All fixtures are synthetic and offline.

---

## Unit 8.5 — Number puzzle (optional)

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m8-u5` / `m8-p5` |
| title | Number puzzle (optional) |
| module / position | 8 / 5 |
| guidance | half (provisional, Q2) |
| minutes | 480 |
| gpis_part | Factor positive integers from 2 to 1,000,000,000. This is a small integer puzzle. |
| requires | [wsl, node, git] |

### Outcomes

After this unit you can

1. Bound the problem
2. Reduce the remainder
3. Verify reconstruction

### Lesson

| Section | Key idea and small example |
| :--- | :--- |
| 1. Bound the problem | Factor positive integers from 2 to 1,000,000,000. This is a small integer puzzle. |
| 2. Reduce the remainder | Divide out repeated factors before advancing a candidate. Stop when candidate squared exceeds remainder. |
| 3. Verify reconstruction | Factors must be prime, sorted and multiply back to the input. |

**Text diagram** candidate → divide repeatedly → smaller remainder → final prime

**Common mistakes**

1. 2,3 → loses multiplicity → 2,2,3,3
2. [] → remaining prime matters → [97]
3. Stop first → misses square → Process equality: 7×7=49

### Guided example — Find rectangular garden beds

In a scratch folder.

1. (full) List factor pairs of 36 until sides meet: 1×36 through 6×6.
2. (full) List pairs of 49 and count the square only once.
3. (task) Try a prime area and predict its pair count.
4. (task) Explain why checking both orders repeats work.

### Quiz plan (`m8-u5-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer and reason | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | 36 factors? | 2,2,3,3 | 2,3 (loses multiplicity). 4,9 (not prime) |
| 2 | Prime 97? | [97] | [] (remaining prime matters). [1,97] (one not prime) |
| 3 | 49 at divisor 7? | Process equality: 7×7=49 | Stop first (misses square). Add two 49s (not factors) |
| 4 | Input 1? | Outside course contract | Return [1] (not prime). Run forever (bad guard) |
| 5 | 90,90,80 under D-02? | 1,1,3; repeated values matter in ranking too | 1,1,2 (dense). 1,2,3 (ignores equality) |
| 6 | What does one-second toy run show? | Measured cost only for bounded fixtures | Real encryption broken (different scale). All numbers take equal time (input matters) |

### Lab — Number puzzle (optional)

**Start.** Run every command from `~/projects/gpis-rebuild`. Use the preceding unit’s finished work.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/lib/algorithms/factors.ts`, `docs/algorithms/factors.md` | `deliverables` |
| 2 | At least one commit, no_secrets true. Include the guide’s database-URL pattern. | `history` |
| 3 | factors(n) in factors.ts: 2→[2], 36→[2,2,3,3], 49→[7,7], 97→[97], 1000000000→nine 2s then nine 5s. Throw RangeError on 1,0,negative,non-integer or >1e9. For 2..5000 verify sorted prime factors and exact product. | `factors` |
| 4 | Warm with 97; factor 999983 repeatedly 100 times in under 2s, assert [999983] every time. Outer test timeout 20s. | `budget` |
| 5 | docs/algorithms/factors.md: Range, Stopping rule, Measurement. Explain square-root stopping and why small fixtures say nothing about practical encryption; 20 words each. | `bound` |

**Hints (folded).** Look at src/lib/algorithms/factors.ts. Compare the smallest passing case with the failing boundary in the check table.

**Finished state.** Factors must be prime, sorted and multiply back to the input. Check with `npx academy check m8-p5`.

### Debugging lab — The square left behind

| Item | Design |
| :--- | :--- |
| Seeded | Scratch divisor loop stops at divisor squared >= remainder. |
| Symptom | 49 returns a composite remainder 49. |
| Fault (builder only) | Equality excluded from trial division. |
| Observe | 49 returns a composite remainder 49. |
| Possible causes | Incorrect prime table, lost remainder, wrong loop bound. |
| Tests | Compare 47,49,51; inspect candidate and remainder at 7. |
| Cause | Equality excluded from trial division. |
| Fix | Process equality before returning remainder. |
| Fixed state | 49 yields two sevens and 47 remains prime. |

### Own build

1. Count distinct factors separately from multiplicity.
2. Check a prime square.
3. Report the supported range explicitly.
4. Commit this variation. In `notes/m8-u5.md` record an input, the result and the difference from GPIS.

### Review

**Checklist extras.** Factors must be prime, sorted and multiply back to the input. I can reproduce the diagnostic comparison.

**Compare with GPIS**

1. How does src/lib/assessments/report-card.ts use inclusive thresholds?
2. Why does D-02 need an equality case as explicit as a square boundary?

**Mastery, without notes**

1. Reconstruct 36.
2. Prove the stop condition.
3. Reject 1.
4. Measure the bounded prime case.

### Check plan (`m8-p5`, version 1.0.0, no `lab:`, requires [wsl, node, git])

| Step id | Kind | Required | Exactly what it verifies |
| :--- | :--- | :--- | :--- |
| deliverables | files | yes | `src/lib/algorithms/factors.ts`, `docs/algorithms/factors.md` |
| history | git | yes | At least one commit, no_secrets true. Include the guide’s database-URL pattern. |
| factors | tests | yes | `tests/factors.test.mjs` via files. factors(n) in factors.ts: 2→[2], 36→[2,2,3,3], 49→[7,7], 97→[97], 1000000000→nine 2s then nine 5s. Throw RangeError on 1,0,negative,non-integer or >1e9. For 2..5000 verify sorted prime factors and exact product. |
| budget | tests | yes | `tests/budget.test.mjs` via files. Warm with 97; factor 999983 repeatedly 100 times in under 2s, assert [999983] every time. Outer test timeout 20s. |
| bound | doc | yes | docs/algorithms/factors.md: Range, Stopping rule, Measurement. Explain square-root stopping and why small fixtures say nothing about practical encryption; 20 words each. |

**Messages for required steps**

- `deliverables` — A named deliverable is missing.
- `history` — The committed history is missing or contains a credential pattern.
- `factors` — The factors do not reconstruct the bounded input.
- `budget` — The prime fixture exceeded the course budget or produced a composite factor.
- `bound` — The range or stopping argument is missing.

### Needs

Module 2’s typed functions and tests. WSL, Node and Git. All fixtures are synthetic and offline.

## After module 8 the learner has

Tested ranking, results-slip selection, exact debt allocation and name search, with a bounded optional number puzzle.
