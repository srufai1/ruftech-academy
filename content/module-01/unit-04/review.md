# Review and mastery check

This is **self-assessed**. Nobody else checks it. Be honest; it is for you.

## Review checklist

Tick only what is true.

- [ ] `m1-p4` passes in the checker.
- [ ] I typed the commands myself. I did not paste them.
- [ ] I read `git status` before every `git add`.
- [ ] I resolved the conflict by reading both sides, not by choosing one whole side.
- [ ] I did not use `reset --hard`, `--amend` or `push --force`.
- [ ] In the debugging lab I wrote the cause before I changed anything.
- [ ] I can draw my history on paper and explain every commit.

## Compare with GPIS

Write three to five sentences on the platform:

- Run `git log --oneline | head -30` in the read-only copy. Pick three messages. What do they
  have in common?
- Run `git log --stat -3`. How many files does a typical commit touch, and why does that help
  the person who reviews it?
- GPIS's `.env.example` holds names and no values. Why is that file committed when
  `.env.local` never is?

## Mastery check

Close the lesson. Open a new terminal. Do each task, then test yourself by running the
commands.

1. In a new repository, make a conflict on purpose and resolve it. Show the graph.
2. Delete an unmerged branch and bring its commit back.
3. Explain, with a drawing, the difference between the staging area and a commit. Prove it
   with `git diff` and `git diff --staged`.
4. Say what you would do in the first ten minutes after pushing a real password. Who must you
   tell, and what must change?

**You have mastered this unit when** you did all four without help. If not, redo the guided
example tomorrow, not today, and try again.

## Reflection (two minutes)

- What surprised me?
- What will I do differently in the next unit?
