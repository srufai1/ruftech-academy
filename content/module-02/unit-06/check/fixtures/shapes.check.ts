// Type-level test for m2-p6. Every line marked @ts-expect-error must NOT compile;
// every other line must. __TYPES__ and __MARKS__ are replaced with absolute paths.
import type { StudentId, ClassId, AcademicYearId, TermId, MembershipId, Student, SchoolClass, AcademicYear, Term, Membership, Score } from "__TYPES__";
import type { Marks } from "__MARKS__";

const sid = 1 as StudentId;
const cid = 2 as ClassId;
const yid = 3 as AcademicYearId;
const tid = 4 as TermId;
const mid = 5 as MembershipId;
const marks: Marks = { individual: 12, classTest: 13.5, group: "ABS", project: null, exam: 68 };

export const student: Student = { id: sid, firstName: "Ama", middleName: null, lastName: "Mensah", dateOfBirth: "2015-03-06", status: "active" };
export const klass: SchoolClass = { id: cid, name: "Basic 3A" };
export const year: AcademicYear = { id: yid, name: "2026/2027", startsOn: "2026-09-14", endsOn: "2027-07-29" };
export const term: Term = { id: tid, academicYearId: yid, number: 1, startsOn: "2026-09-14", endsOn: "2026-12-18" };
export const membership: Membership = { id: mid, studentId: sid, classId: cid, academicYearId: yid, startedOn: "2026-09-14", endedOn: null, termIds: [tid] };
export const score: Score = { membershipId: mid, termId: tid, subject: "Mathematics", marks, examMax: 140, status: "submitted" };

// @ts-expect-error a student has no class (D-19)
export const s1: Student = { ...student, classId: cid };
// @ts-expect-error a student has no academic year
export const s2: Student = { ...student, academicYearId: yid };
// @ts-expect-error a student has no term
export const s3: Student = { ...student, term: tid };
// @ts-expect-error "inactive" is not a student status (D-23)
export const s4: Student = { ...student, status: "inactive" };
// @ts-expect-error statuses are exact, lower case
export const s5: Student = { ...student, status: "Active" };
// @ts-expect-error endedOn is required: null means "not ended"
export const m1: Membership = { id: mid, studentId: sid, classId: cid, academicYearId: yid, startedOn: "2026-09-14", termIds: [tid] };
// @ts-expect-error endedOn is a date or null, never undefined
export const m2: Membership = { ...membership, endedOn: undefined };
// @ts-expect-error a term number is 1, 2 or 3
export const t1: Term = { ...term, number: 4 };
// @ts-expect-error an exam maximum is 100 or 140
export const sc1: Score = { ...score, examMax: 120 };
// @ts-expect-error there is no approved status (D-218)
export const sc2: Score = { ...score, status: "approved" };
// @ts-expect-error a ClassId is not a StudentId
export const m3: Membership = { ...membership, studentId: cid };
// @ts-expect-error a StudentId is not a ClassId
export const m4: Membership = { ...membership, classId: sid };
// @ts-expect-error a score points to its membership (D-21)
export const sc3: Score = { termId: tid, subject: "Mathematics", marks, examMax: 100, status: "draft" };
export function change(s: Student, m: Membership): void {
  // @ts-expect-error properties are read-only
  s.status = "withdrawn";
  // @ts-expect-error termIds is a read-only list
  m.termIds.push(tid);
}
