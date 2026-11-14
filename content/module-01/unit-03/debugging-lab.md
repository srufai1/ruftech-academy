# Debugging lab — Address already in use

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

A colleague says: "`./run.sh` fails with `EADDRINUSE`. I ran `./stop.sh`, it said stopped,
and it still fails."

## Start

The lab from project 1.3 already has the files. If you have not run it yet:

```bash
npx academy init m1-p3
```

```bash
cd ~/academy-labs/m1-p3/office-server/debug
```

Set the scene once. Do not read `setup.sh` first; find the problem the way you would at work.

```bash
./setup.sh
```

Now do what your colleague did:

```bash
./run.sh
```

```bash
./stop.sh
```

```bash
./run.sh
```

## Your work

Do not fix anything yet. Fill in `diagnosis.md` in that folder:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The exact error line, and what `stop.sh` printed |
| `## Possible causes` | At least three, for example: another program holds port 8090; the app starts twice inside `run.sh`; the port needs extra rights |
| `## Tests` | One command per cause, with its output. For example `ss -ltnp \| grep 8090`; `cat app.pid` then `ps -p` with that number; `grep -n listen app.mjs` |
| `## Cause` | The cause the evidence supports |
| `## Fix` | The smallest change, and the command that shows it now works |

There are **two** faults. One is a program that should not be running. The other is in
`stop.sh`: look at what it prints when `kill` fails.

Do not change the port in `app.mjs`. That makes the error go away and leaves the real problem
running.

## Fixed state

- `./run.sh`, then `curl -s http://127.0.0.1:8090/` prints `app ok`.
- `./stop.sh` prints `stopped`. Wait a second. `./stop.sh` again prints `not running` and
  exits with 1 (check with `echo $?`).
- No `old-app.mjs` process is running.
- `stop.sh` differs from the one you were given by two or three lines. `app.mjs` and
  `run.sh` are unchanged.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it yet. Compare your `diagnosis.md`
with the five headings above, and ask yourself: did I write the cause **before** I changed
anything?
