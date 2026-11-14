#!/usr/bin/env bash
# Builds the repository for project 2.5 (m2-p5), tagged start, and beside it the debugging
# lab's repository ~/academy-labs/m2-p5/class-codes. Fixed author and dates; no global Git
# settings. Run by `academy init m2-p5`. Usage: seed.sh <lab-root>
set -euo pipefail

root="${1:?lab root is required}"
debug="$(dirname "$root")/class-codes"

export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME="Lab Seed" GIT_AUTHOR_EMAIL="seed@example.invalid"
export GIT_COMMITTER_NAME="Lab Seed" GIT_COMMITTER_EMAIL="seed@example.invalid"
day=0
commit() {
  day=$((day + 1))
  local when; when="2026-10-0${day}T09:00:00+0000"
  GIT_AUTHOR_DATE="$when" GIT_COMMITTER_DATE="$when" git commit -q -m "$1"
}

rm -rf "$root" "$debug"
mkdir -p "$root/src" "$root/tests"
cd "$root"
git init -q -b main

cat > package.json <<'J'
{
  "name": "admissions-helper",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test" }
}
J
printf 'node_modules/\n' > .gitignore
git add package.json .gitignore && commit "Start the admissions helper package"

cat > src/admission-number.ts <<'TS'
// D-48: a generated admission number is ADM/GPIS/YYYY/NNN.
// YYYY is the admission year; NNN runs from 001 within that year.
const ADMISSION = /^ADM\/GPIS\/(\d{4})\/(\d{3,})$/;

export function nextAdmissionNumber(existing: string[], year: number): string {
  const highest = existing.reduce((max, code) => {
    const match = ADMISSION.exec(code);
    if (!match) return max;
    const serial = Number(match[2]);
    return serial > max ? serial : max;
  }, 0);
  return `ADM/GPIS/${year}/${String(highest + 1).padStart(3, "0")}`;
}
TS
cat > src/full-name.ts <<'TS'
// D-46: on import, the first word of the full name is the first name and the rest is the
// last name. One word is a row error. The middle name stays empty.
export type SplitName = { firstName: string; lastName: string } | { error: string };

export function splitFullName(fullName: string): SplitName {
  const words = fullName.split(" ");
  if (words.length < 2) return { error: "A full name needs at least two words." };
  const [firstName = "", ...rest] = words;
  return { firstName, lastName: rest.join(" ") };
}
TS
cat > src/house.ts <<'TS'
// D-70: a new student's House is the one with the fewest students.
// When Houses are equal, the first name in alphabetical order wins.
export function assignHouse(counts: Record<string, number>): string {
  const byName = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  const [first] = byName;
  if (!first) throw new RangeError("there are no Houses to choose from");
  const [best] = byName.reduce(
    (chosen, candidate) => (candidate[1] <= chosen[1] ? candidate : chosen),
    first,
  );
  return best;
}
TS
git add src && commit "Add admission number, name split and House helpers"

cat > tests/admission-number.test.ts <<'TS'
import { test } from "node:test";
import assert from "node:assert/strict";
import { nextAdmissionNumber } from "../src/admission-number.ts";

test("the first number ever is 001", () => assert.equal(nextAdmissionNumber([], 2027), "ADM/GPIS/2027/001"));
test("the next number follows the last", () => assert.equal(nextAdmissionNumber(["ADM/GPIS/2027/001"], 2027), "ADM/GPIS/2027/002"));
test("codes in another shape are ignored", () => assert.equal(nextAdmissionNumber(["GPIS-7", "ADM/GPIS/2027/004"], 2027), "ADM/GPIS/2027/005"));
TS
cat > tests/full-name.test.ts <<'TS'
import { test } from "node:test";
import assert from "node:assert/strict";
import { splitFullName } from "../src/full-name.ts";

test("two words: first and last name", () => assert.deepEqual(splitFullName("Ama Birikran"), { firstName: "Ama", lastName: "Birikran" }));
test("three words: the rest is the last name", () => assert.deepEqual(splitFullName("Ama Serwaa Birikran"), { firstName: "Ama", lastName: "Serwaa Birikran" }));
test("one word is an error", () => assert.ok("error" in splitFullName("Ama")));
TS
cat > tests/house.test.ts <<'TS'
import { test } from "node:test";
import assert from "node:assert/strict";
import { assignHouse } from "../src/house.ts";

test("the House with the fewest students", () => assert.equal(assignHouse({ "House 1": 3, "House 2": 1, "House 3": 2, "House 4": 5 }), "House 2"));
test("the fewest may be the last House", () => assert.equal(assignHouse({ "House 1": 5, "House 2": 5, "House 3": 5, "House 4": 1 }), "House 4"));
test("no Houses is an error", () => assert.throws(() => assignHouse({}), RangeError));
TS
cat > REPORTS.md <<'MD'
# Reports from the admissions office

## A — Admission numbers

"The first pupil we admitted for 2027 got the number ADM/GPIS/2027/151. It should be 001."

Rule D-48: a generated admission number is `ADM/GPIS/YYYY/NNN`. YYYY is the admission year;
NNN runs from 001.

## B — Names pasted from Excel

"We pasted names from a spreadsheet. `  Ama Birikran` (two spaces in front) was saved with
an empty first name. `Ama  Birikran` (two spaces between) was saved with a space at the start
of the surname."

Rule D-46: on import, the first word of the full name is the first name and the rest is the
last name; one word is a row error; the middle name stays empty.

## C — Houses

"Houses 2 and 3 both had 9 pupils, the fewest. The new pupil went to House 3."

Rule D-70: a new student's House is the one with the fewest students; ties go to the first
name in alphabetical order.
MD
git add tests REPORTS.md && commit "Add tests and the office reports"
git tag start

# The debugging lab: a repository whose fourth commit hides a lost regex flag in a "tidy".
mkdir -p "$debug"
cd "$debug"
git init -q -b main
printf '{ "name": "class-codes", "private": true, "type": "module", "scripts": { "test": "node --test" } }\n' > package.json
cat > canonical.ts <<'TS'
// D-45: class names match ignoring case, spacing and punctuation. Never fuzzy.
export function canonicalClassKey(name: string): string { return name.toLowerCase().replace(/[^a-z0-9]/g, ""); }
TS
git add package.json canonical.ts && commit "Add canonicalClassKey for matching class names"
cat > canonical.test.ts <<'TS'
import { test } from "node:test";
import assert from "node:assert/strict";
import { canonicalClassKey } from "./canonical.ts";

test("upper case does not matter", () => assert.equal(canonicalClassKey("JHS3"), "jhs3"));
test("a space does not matter", () => assert.equal(canonicalClassKey("JHS 3"), "jhs3"));
test("Basic 1", () => assert.equal(canonicalClassKey("Basic 1"), "basic1"));
test("KG 2", () => assert.equal(canonicalClassKey("KG 2"), "kg2"));
test("a name with no separator", () => assert.equal(canonicalClassKey("Creche"), "creche"));
test("an empty name", () => assert.equal(canonicalClassKey(""), ""));
TS
git add canonical.test.ts && commit "Test class names with case and spaces"
cat > classes.ts <<'TS'
import { canonicalClassKey } from "./canonical.ts";

export const KNOWN_CLASSES = ["Creche", "KG 1", "KG 2", "Basic 1", "Basic 2", "JHS 1", "JHS 2", "JHS 3"];

export function findClass(typed: string): string | null {
  const key = canonicalClassKey(typed);
  return KNOWN_CLASSES.find((name) => canonicalClassKey(name) === key) ?? null;
}
TS
git add classes.ts && commit "Add findClass for the import screen"
cat > canonical.ts <<'TS'
/**
 * Canonical class keys.
 *
 * D-45: class names match ignoring case, spacing and punctuation.
 * The match is never fuzzy: two names match only when their keys are equal.
 *
 * Examples:
 *   "JHS 3"   -> "jhs3"
 *   "Basic 1" -> "basic1"
 *   "KG 2"    -> "kg2"
 */

/** Characters that are not lower-case letters or digits. */
const NOT_LETTER_OR_DIGIT = /[^a-z0-9]/;

/**
 * The key used to compare two class names.
 * @param name the class name as typed or imported
 * @returns the name in lower case, with every other character removed
 */
export function canonicalClassKey(name: string): string {
  const lower = name.toLowerCase();
  return lower.replace(NOT_LETTER_OR_DIGIT, "");
}
TS
git add canonical.ts && commit "Tidy canonical name helper"
cat > README.md <<'MD'
# class-codes

Matches class names typed on the import screen with the school's classes (D-45).
Run the tests with `npm test`.
MD
git add README.md && commit "Explain the class-codes helpers in a README"
cat > diagnosis.md <<'MD'
## Observe

## Possible causes

## Tests

## Cause

## Fix
MD
