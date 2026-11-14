# Review and mastery check

This is **self-assessed**. Nobody else checks it. Be honest; it is for you.

## Review checklist

Tick only what is true.

- [ ] `m2-p4` passes in the checker.
- [ ] I typed the code myself. I did not paste it.
- [ ] My tests pass under two other `TZ` values.
- [ ] Both ends of a period are tested. A blank query is tested.
- [ ] No function reads the clock except through a `now` parameter.
- [ ] In the debugging lab I wrote the cause before I changed anything.

## Compare with GPIS

Write three to five sentences on the platform:

- Read the comment at the top of `src/lib/school-date.ts`. Ghana is UTC+0 all year, so why
  does GPIS still name the zone?
- `matchesStudentSearch` in `name-class-search.ts` also searches the student's code, and
  understands "name, class". What does the comma do?
- GPIS stores a date of birth as a date, not a moment. What would go wrong for a pupil born
  at 00:30 if it were a moment?

## Mastery check

Close the lesson. Do each task, then test yourself by running it.

1. From an empty file: "today in `Pacific/Auckland`", with a test that passes on any computer.
2. By hand: `daysBetween("2027-12-25", "2028-03-01")`. Then check with your function.
3. Write `matchesName` again from memory, with four tests.
4. Explain "moment" and "calendar date" to someone, using a birthday as the example.

**You have mastered this unit when** you did all four without help. If not, redo the guided
example tomorrow, not today, and try again.

## Reflection (two minutes)

- What surprised me?
- What will I do differently in the next unit?
