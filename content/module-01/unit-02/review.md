# Review and mastery check

This is **self-assessed**. Nobody else checks it. Be honest; it is for you.

## Review checklist

Tick only what is true.

- [ ] `m1-p2` passes in the checker.
- [ ] I typed the commands myself. I did not paste them.
- [ ] I ran my script on an empty file and on a name with spaces before I ran the checker.
- [ ] My error messages go to standard error.
- [ ] In the debugging lab I wrote the cause before I changed anything.
- [ ] I can say what every part of my pipeline does without reading it.

## Compare with GPIS

Write three to five sentences on the platform:

- Open `scripts/` in the read-only copy and pick one script. What does it exit with when it
  finds a problem, and who reads that?
- GPIS checks run in CI, not by hand. What would happen to the project if one of them always
  exited 0?

## Mastery check

Close the lesson. Open a new terminal in `~/academy-labs/m1-p2/logs`. Answer, then test
yourself by running the commands.

1. From `access.log`, print the three addresses with the most requests of any kind.
2. Print how many `POST` requests failed.
3. Write, from an empty file, a script that prints `usage` to standard error and exits 1 when
   it gets no argument. Prove the exit code with `echo $?`.
4. Explain to a classmate why `uniq -c` needs `sort`. Use a three-line example and run it.

**You have mastered this unit when** you did all four without help and your example in 4
showed the wrong answer and the right one. If not, redo the guided example tomorrow, not
today, and try again.

## Reflection (two minutes)

- What surprised me?
- What will I do differently in the next unit?
