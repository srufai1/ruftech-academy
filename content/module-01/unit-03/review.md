# Review and mastery check

This is **self-assessed**. Nobody else checks it. Be honest; it is for you.

## Review checklist

Tick only what is true.

- [ ] `m1-p3` passes in the checker.
- [ ] I typed the commands myself. I did not paste them.
- [ ] I saved the evidence before I stopped anything.
- [ ] I used `TERM` first, and never needed `KILL`.
- [ ] In the debugging lab I wrote the cause before I changed anything.
- [ ] I can read the address and the port in a line of `ss` output.

## Compare with GPIS

Write three to five sentences on the platform:

- In the read-only copy, which command in `package.json` starts the development server, and
  which port does it use? Where could that port be changed?
- GPIS's rule says "Never change working code merely to make an error message disappear."
  How would changing the port in the debugging lab break that rule?

## Mastery check

Close the lesson. Open a new terminal. Do each task, then test yourself by running the
commands.

1. Start any server on port 8123. Show three facts about it: its PID, its parent, and the
   address it listens on.
2. Stop it without `kill -9`. Prove the port is free.
3. Show "connection refused" with one command and explain it. Explain how a timeout would be
   different, and which exit code `curl` gives for each.
4. Draw the process tree of your terminal now, on paper. Then check it with
   `ps -ef --forest`.

**You have mastered this unit when** you did all four without help and your drawing in 4
matched. If not, redo the guided example tomorrow, not today, and try again.

## Reflection (two minutes)

- What surprised me?
- What will I do differently in the next unit?
