# Lab — Project 2.6: Typed data shapes

**Level:** guided. **Checker:** `m2-p6`. **Time:** about 330 minutes.

Write the types for the most important structure in GPIS — who was in which class, when — so
that the type checker refuses the legacy system's mistake.

**The rules (D-19 to D-23, D-04):** a student has no class. A membership is a dated record:
student, class, academic year, start date, end date (`null` while open), and the terms it
covers. A pupil moves only at a term boundary, so a term belongs to one membership. A score
points to the membership it was earned under. Student status (`active`, `withdrawn`,
`alumni`) is separate from membership status (open or ended). A class roll needs both a
membership of that class for that term and `status` `active`.

## Start

```bash
cd ~/projects/gpis-rebuild
```

## What "done" means

`src/lib/school-types.ts` and `src/lib/membership.ts`:

| # | Requirement |
| :--- | :--- |
| 1 | Exported types: `StudentId`, `ClassId`, `AcademicYearId`, `TermId`, `MembershipId` (branded numbers); `StudentStatus` (`"active" \| "withdrawn" \| "alumni"`); `Student` (`id`, `firstName`, `middleName: string \| null`, `lastName`, `dateOfBirth`, `status`); `SchoolClass` (`id`, `name`); `AcademicYear` (`id`, `name`, `startsOn`, `endsOn`); `Term` (`id`, `academicYearId`, `number: 1 \| 2 \| 3`, `startsOn`, `endsOn`); `Membership` (`id`, `studentId`, `classId`, `academicYearId`, `startedOn`, `endedOn: string \| null`, `termIds: readonly TermId[]`); `Score` (`membershipId`, `termId`, `subject`, `marks: Marks`, `examMax: 100 \| 140`, `status: "draft" \| "submitted"`) |
| 2 | `Student` has **no** class, year or term field; the type checker refuses one |
| 3 | Every property is `readonly` |
| 4 | `openMembership(memberships, studentId): Result<Membership \| null>`: the membership with `endedOn === null`, or an error result if there are two |
| 5 | `membershipForTerm(memberships, studentId, termId): Membership \| null`: the membership whose `termIds` include the term. D-20 says there is at most one; two is refused by throwing |
| 6 | `overlaps(a, b): boolean`: two periods overlap when each starts on or before the other ends. An open membership has no end |
| 7 | `classRoll(students, memberships, classId, termId): Student[]`: D-04, both conditions; ordered by last name, then first name; the inputs are not changed |
| 8 | No `any`; no `as` in `membership.ts` (one `as` is allowed in each branded-id helper in `school-types.ts`); typecheck and lint pass; your own tests in `tests/membership.test.ts`, at least 15 |

`Marks` is imported from `marks.ts` (unit 2.3). `Result` may be defined in `school-types.ts`.

## Steps (guided)

1. The id brands, and one helper for each, such as `asStudentId(n)`.
2. `StudentStatus` and `Student`. In `tests/school-types.check.ts`, write a
   `// @ts-expect-error` line with a student that has a `classId`.
3. The other types, one at a time, each with one "must not compile" line.
4. `openMembership`.
5. `membershipForTerm`.
6. `overlaps`, with the six ways two periods can sit.
7. `classRoll`, with eight students that include: withdrawn with an ended membership,
   withdrawn with a membership wrongly left open, active in another class, alumni, and one
   who moved at a term boundary.
8. Search for `any` and `as`. Commit after each step.

## Hints

- **a.** A brand: `number & { readonly __brand: "StudentId" }`.
- **b.** Draw two periods on a line before you write `overlaps`.
- **c.** `classRoll` is a `filter` over memberships, a `filter` over students, and a
  `toSorted`.

## Check your work

```bash
npx academy check m2-p6
```

The checker compiles a file of its own against your types: valid data must compile, and about
fifteen wrong lines must not.

## Compare with GPIS

Read "The temporal model" in GPIS's `AGENTS.md`. Write one sentence in your notes for each of
D-19, D-21 and D-23: which of your types carries it out?
