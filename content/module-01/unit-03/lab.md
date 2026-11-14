# Lab — Project 1.3: Processes and ports

**Level:** guided. **Checker:** `m1-p3`. **Time:** about 240 minutes.

The office status server "is running", but nobody can open it. And the office laptop gets
slower every hour. Find out what is running, collect the evidence, then fix it — in that
order.

## Start

```bash
npx academy init m1-p3
```

This creates the folder `~/academy-labs/m1-p3/office-server`. Work inside it.

```bash
cd ~/academy-labs/m1-p3/office-server
```

`init` starts nothing. You start the programs yourself:

```bash
./start.sh
```

Expected: `started`. To start the lab again, stop the programs you started, then run the
`init` command again with `--reset`.

What is in the folder:

| Name | What it is |
| :--- | :--- |
| `server.mjs` | The status server. It reads `server.conf` and writes its PID to `server.pid` |
| `server.conf` | The address (`host=`) and port (`port=`) the server listens on |
| `leaky.sh` | A helper that `start.sh` also starts |
| `start.sh` | Starts `leaky.sh` and the server in the background |
| `README.txt` | What the server should do |
| `evidence.md` | Four headings for your evidence |
| `debug/` | For the debugging lab; leave it for now |

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | `evidence.md` shows the process tree **before** you stopped anything |
| 2 | `leaky.sh` is not running, and none of its `sleep 6001` children are |
| 3 | You stopped them with `TERM`, and wrote the commands down |
| 4 | `server.conf` holds `host=127.0.0.1` and `port=8080`, and nothing else changed |
| 5 | The server answers `ok` at `http://127.0.0.1:8080/health` |
| 6 | Nothing listens on the old address and port |
| 7 | `server.mjs`, `leaky.sh` and `start.sh` are unchanged |

## Steps (guided)

1. Run `./start.sh`.
2. Read `README.txt`. Try `curl` on the address it gives. Write down the exact error.
3. Save the process tree into `evidence.md`, under `## Process tree`. You can append command
   output to the file: `ps -ef --forest >> evidence.md`, then tidy it in `nano`.
4. Save the listening sockets under `## Listening sockets` (`ss -ltnp`).
5. Find the parent of the `sleep 6001` processes. Its PID is in the PPID column.
6. Stop the parent with `TERM`. Then stop the children it left, with `TERM`. Prove with
   `pgrep` that none is left. Write every command under `## Signals I sent`.
7. Read `server.conf`. Edit it with `nano`.
8. Stop the server with the PID in `server.pid`. Start it again with `node server.mjs &`.
9. `curl` again. Check the old address and port too.
10. Finish `evidence.md`: under `## What was wrong`, explain each fault in your own words.

## Hints

- **a.** `ps -ef --forest` draws the tree. `grep -B2 sleep` also shows the two lines above
  each match.
- **b.** Stop the parent first, or it makes new children. `pgrep -f 'sleep 6001'` shows what
  `pkill -f` with the same text would stop.
- **c.** A program reads its config only when it starts. A changed `server.conf` does nothing
  to a server that is already running.

## Check your work

Leave the fixed server running, then:

```bash
npx academy check m1-p3
```

Fix what fails and run it again. Every run is recorded; a failed run costs nothing.

## Compare with GPIS

In your read-only copy of GPIS, open `package.json`. Find the `dev` script. Which command
starts the development server? Which port does it use when nothing else is set? Add two
sentences at the end of `evidence.md`.
