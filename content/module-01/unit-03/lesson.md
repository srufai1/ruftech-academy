# Processes, signals and ports

## 1. A program that is running

A file such as `server.mjs` is a program on disk. When you run it, Linux makes a **process**:
the program plus its memory, its open files and a number, the **PID** (process ID).

Every process was started by another process, its **parent**. The parent's number is the
**PPID**. Your terminal runs `bash`; when you type `node server.mjs`, `bash` is the parent.

- `ps -ef` lists every process: user, PID, PPID, start time, command.
- `ps -ef --forest` draws the family tree with `\_`.
- `pstree -p` draws the same tree in a shorter form.

```text
bash (4100)
 ├─ start.sh (4120)  ── ended; its children were adopted
 ├─ node server.mjs (4122)
 └─ leaky.sh (4121)
     ├─ sleep 6001 (4130)
     ├─ sleep 6001 (4135)
     └─ sleep 6001 (4140)
```

## 2. Foreground and background

A command in the **foreground** holds your terminal until it ends. Add `&` to run it in the
**background**: you get the prompt back at once.

- `jobs` lists the background jobs of this terminal. `fg` brings one back to the foreground.
- **Ctrl+C** asks the foreground program to stop. **Ctrl+Z** pauses it.
- Closing the terminal usually ends its children too. `nohup` starts a program that keeps
  running after the terminal closes. That is useful, and it is also how forgotten servers
  pile up.

## 3. Signals

You stop a process by sending it a **signal**, a small numbered message.

| Signal | Number | Meaning |
| :--- | :--- | :--- |
| `TERM` | 15 | "Please stop." The program can save its work and close its files first |
| `INT` | 2 | What Ctrl+C sends. Most programs treat it like `TERM` |
| `KILL` | 9 | "Stop now." The program cannot catch it and cannot clean up |
| `STOP` | 19 | Pause. The program does not end |

- `kill PID` sends `TERM`. `kill -KILL PID` (or `kill -9`) sends `KILL`.
- `pkill -f 'text'` sends `TERM` to every process whose command line contains the text.
  `pgrep -f 'text'` shows which PIDs that would be. Run `pgrep` first.

Always `TERM` first, wait a few seconds, check, and use `KILL` only if the program does not
end. A program killed with `KILL` while it writes a file can leave the file half written.

## 4. Children that are never collected

When a parent ends before its children, the children do not end. They are **adopted** by
PID 1, the first process of the system (on WSL, a small `init` process).

A badly written script can start children in a loop and never wait for them. Each one is
small, but the number grows every few seconds, and the laptop gets slower every hour.

If you kill only the children, the parent makes new ones. Find the **parent** in the tree and
stop it first. Then stop the children it left behind.

## 5. Ports and addresses

A server **listens** on an **address** and a **port**. The port is a number from 1 to 65535.
Only one process can listen on the same address and port. A second one fails with
`EADDRINUSE` — "address already in use".

| Address | Who can connect |
| :--- | :--- |
| `127.0.0.1` | This machine only (the **loopback** address) |
| `127.0.0.2` | Also this machine only, but a **different** address from `127.0.0.1` |
| `0.0.0.0` | Every address this machine has, so other machines too |

`ss -ltnp` lists listening sockets: `-l` listening, `-t` TCP, `-n` numbers instead of names,
`-p` the process. Read the address column **and** the port column.

```text
LISTEN 0 511 127.0.0.2:8081 0.0.0.0:* users:(("node",pid=4122,fd=21))
             ─────────┬────            ──────┬────────────────────────
             address and port            which process holds it
```

## 6. Asking a server

`curl` sends a request and prints the answer.

- `curl -s URL` prints only the body. `curl -i URL` adds the status line and headers.
- `--max-time 3` gives up after three seconds.

Two errors that look alike, but mean different things:

| Message | Exit code | Meaning |
| :--- | :--- | :--- |
| `Failed to connect … Couldn't connect to server` ("connection refused") | 7 | Nothing listens on that address and port |
| `Operation timed out` | 28 | Something may be there, but nothing answered in time |

## 7. In GPIS

`npm run dev` starts the GPIS development server, which listens on port 3000. If an old copy
still holds 3000, Next.js says so and offers another port. Taking the other port hides the old
copy; it does not remove it. Stop the server with Ctrl+C in its own terminal, not by closing
the window. GPIS's own rule applies here: "Never change working code merely to make an error
message disappear."

## Common mistakes

1. `kill -9` first → the program cannot save or close files → `TERM`, wait, then `KILL` only
   if needed.
2. Killing the children, not the parent → new children appear → find the parent in the tree.
3. Reading `ss` without `-p` → no process name → `ss -ltnp`.
4. "It listens, so it works" → it listens on the wrong address → read the address column too.
5. `pgrep -f leaky` inside a script matches the script's own command line → use the `[l]eaky`
   form, which matches `leaky` but not itself.

## Words to remember

process · PID · parent (PPID) · foreground · background · signal · `TERM` · `KILL` ·
adopted process · port · loopback · listening socket · connection refused
