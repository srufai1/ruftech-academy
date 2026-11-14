# Review and mastery check

This is **self-assessed**. Nobody else checks it. Be honest; it is for you.

## Review checklist

Tick only what is true.

- [ ] `m2-p5` passes in the checker.
- [ ] I typed my tests and fixes myself.
- [ ] Each of my new tests failed first, for the right reason.
- [ ] My diff is small, and I can explain every changed line.
- [ ] I left something ugly alone, and wrote it down.
- [ ] In the debugging lab I found the commit before I changed the code.

## Compare with GPIS

Write three to five sentences on the platform:

- Run `git log --oneline --grep="Fix" | head` in the read-only copy. Open one with
  `git show`. How many lines of source changed, and is there a test in the same commit?
- GPIS's rules say "Stay inside the task." Describe the commit in the debugging lab that
  broke that rule, and what it cost.
- GPIS assigns the House in the database: open
  `supabase/migrations/20260912130000_add_student_houses.sql` and find `order by`. How does it
  break ties, and why might the school want this rule in the database rather than in the app?

## Mastery check

Close the lesson. Do each task, then test yourself.

1. Given a bug report from a classmate about any function, produce a failing test in ten
   minutes.
2. Explain why a test that fails for the wrong reason is worse than no test.
3. Use `git bisect` on a five-commit repository you make yourself.
4. State D-48, D-46 and D-70 from memory.

**You have mastered this unit when** you did all four without help. If not, redo the guided
example tomorrow, not today, and try again.

## Reflection (two minutes)

- What surprised me?
- What will I do differently in the next unit?
