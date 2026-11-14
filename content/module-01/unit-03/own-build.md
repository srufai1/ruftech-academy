# Own build — Port check

No steps and no hints this time. Build it your way, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. `scripts/port-check.sh PORT` prints `free` and exits 0 when nothing listens on that port.
2. When something listens, it prints `in use: PID COMMAND ADDRESS` and exits 1.
3. No argument, or an argument that is not a whole number from 1 to 65535: a usage line on
   standard error, exit 2.
4. It never stops a process. It only reports.
5. `notes/unit-1-3.md` holds the output for port 3000 with a server running and without one.

## Who checks it

This build is **self-reviewed**. Go through the five requirements one by one and run a
command that proves each. Use the `hello-server.mjs` from the guided example as the server.

## Then compare with GPIS

GPIS's development server uses port 3000. Write in `notes/unit-1-3.md`: when would a
teammate run your `port-check.sh 3000`, and what should they do with each answer?
