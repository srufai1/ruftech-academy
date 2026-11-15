# Types that model the school

This lesson has two parts. Part A is about types that refuse wrong data. Part B uses them for
the most important structure in GPIS: who was in which class, when.

## Part A

## A1. A type is a promise about data

```ts
type SchoolClass = { readonly id: ClassId; readonly name: string };
```

`readonly` means nobody may change the property after the object is made. To "change" it you
make a new object. Then a value handed to a function cannot be changed behind your back.

Optional and "known to be empty" are different:

- `middleName?: string` — the property may be missing. Missing could mean "none", or "we
  forgot to load it".
- `middleName: string | null` — the property is always there; `null` says "known to be
  empty". Prefer this for data from the database.

## A2. Small exact sets

```ts
type StudentStatus = "active" | "withdrawn" | "alumni";
```

`"Active"`, `"actve"` and `"inactive"` are now compile errors. With `status: string`, all of
them would be stored. (GPIS has no `inactive` status: D-23.)

## A3. Identifiers that cannot be mixed up

A student id and a class id are both numbers. Passing one where the other is wanted is a
real, quiet bug. A **brand** makes them different types:

```ts
type StudentId = number & { readonly __brand: "StudentId" };
type ClassId = number & { readonly __brand: "ClassId" };
const asStudentId = (n: number) => n as StudentId;   // the one place an `as` is allowed
```

The brand exists only for the type checker; at run time it is a plain number.

## A4. Tagged unions again

`Result<T>` from unit 2.3 returns success or an error. A `switch` over a union can be made
**exhaustive**:

```ts
function label(s: StudentStatus): string {
  switch (s) {
    case "active": return "On roll";
    case "withdrawn": return "Left";
    case "alumni": return "Graduated";
    default: { const never: never = s; return never; }
  }
}
```

Add a fourth status and the compiler points at every `switch` that forgot it.

## A5. Generic helpers

`Array<T>` and `readonly T[]`; `Record<K, V>` (an object whose keys are `K`); `Pick<T, "a">`
and `Omit<T, "a">` (a type with some properties); `Readonly<T>`.

Stop here. Do steps 1–4 of the guided example. Then read Part B.

## Part B

## B1. The obvious model, and why it is wrong

The obvious design puts `classId` on the student. The legacy GPIS did that: one class per
student, overwritten when they move. Reprint last term's report card and it prints **today's**
class, and ranks the pupil against today's classmates. The document looks normal and is
wrong. (The evidence is in GPIS's `docs/LEGACY_TEMPORAL_FINDINGS.md`.)

## B2. Membership

A **membership** is a record of a period: student, class, academic year, `startedOn`,
`endedOn` (`null` while it is open), and the terms it covers (D-19). A student may have
several in one year. They never overlap (D-22), and the database enforces that.

```text
Student ──< Membership >── SchoolClass
               │
               └──< Score          AcademicYear ──< Term
   (no line from Student to SchoolClass: the class is found through a membership)
```

The current class is **derived** from the open membership, never stored on the student.

## B3. Moves happen at term boundaries

D-20: a pupil changes class only between terms. So a term always belongs to exactly one
class, and a term's scores have one cohort.

## B4. A score points to its membership

D-21: a score records the membership it was earned under, chosen once when it is written and
never worked out again when it is read. The class and the position on a report card come from
that membership. A score also carries its maxima (D-27).

## B5. Two statuses

A student has a status: `active`, `withdrawn` or `alumni`. A membership is open or ended.
They are separate facts (D-23). A withdrawal ends the membership **and** sets the status. A
return opens a new membership. Alumni is a status, never a class: graduates keep all their
memberships and scores.

## B6. "Who is on the roll?"

D-04: a class list for a term covers students with a membership of that class for that term
**and** `status === "active"`. Both conditions, because a withdrawn pupil's membership may
have been left open by mistake, and an active pupil may be in another class.

## Common mistakes

1. Adding `classId` to `Student` "for convenience" → two sources of truth → derive it.
2. `status: string` → `"Active"` and `"actve"` are accepted → a literal union.
3. `endedOn?: string` → "not ended" and "forgot to load it" look the same → required
   `string | null`.
4. `as Student` on data from outside → the compiler is told a lie → check, then narrow.
5. Filtering a class list on status only, or on membership only → the wrong pupils appear →
   both (D-04).

## Words to remember

`readonly` · optional against `| null` · literal union · brand · exhaustive `switch` ·
`never` · membership · open and ended · derived · temporal model · roll
