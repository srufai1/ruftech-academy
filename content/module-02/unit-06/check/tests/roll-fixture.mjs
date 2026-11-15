// Eight students, two classes, three terms. Ama moves from 3A to 3B at the end of Term 1.
export const A = 1, B = 2;              // class ids: Basic 3A, Basic 3B
export const T1 = 11, T2 = 12, T3 = 13; // term ids
const student = (id, firstName, lastName, status) => ({ id, firstName, middleName: null, lastName, dateOfBirth: "2015-01-01", status });
const m = (id, studentId, classId, termIds, endedOn) => ({ id, studentId, classId, academicYearId: 1, startedOn: "2026-09-14", endedOn, termIds });
export const STUDENTS = [
  student(1, "Ama", "Mensah", "active"),
  student(2, "Kofi", "Boateng", "withdrawn"),
  student(3, "Esi", "Kyei", "withdrawn"),
  student(4, "Yaw", "Ofori", "active"),
  student(5, "Abena", "Asante", "active"),
  student(6, "Kwame", "Adu", "alumni"),
  student(7, "Akosua", "Adu", "active"),
  student(8, "Efua", "Owusu", "active"),
];
export const MEMBERSHIPS = [
  m(101, 1, A, [T1], "2026-12-18"),
  { ...m(102, 1, B, [T2, T3], null), startedOn: "2027-01-11" },
  m(103, 2, A, [T1, T2], "2027-02-20"),
  m(104, 3, A, [T1, T2, T3], null),            // withdrawn, but the membership was wrongly left open
  m(105, 4, B, [T1, T2, T3], null),
  m(106, 5, A, [T1, T2, T3], null),
  m(107, 6, A, [T1, T2, T3], "2027-07-29"),
  m(108, 7, A, [T1, T2, T3], null),
  { ...m(109, 8, A, [T2, T3], null), startedOn: "2027-01-11" },
];
