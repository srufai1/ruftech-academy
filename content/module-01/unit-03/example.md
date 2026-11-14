# Guided example — Start, find, ask, stop

You will start a tiny server, find it from three sides, ask it a question, and stop it
politely. Then you will see what happens to children whose parent ends.

**Type every command yourself.** Do not paste. Compare what you see with the expected output.
Your PIDs will be different numbers; that is normal.

## Step 1 — A five-line server

```bash
mkdir -p ~/academy-labs/scratch/u1-3
```

```bash
cd ~/academy-labs/scratch/u1-3
```

```bash
cat > hello-server.mjs <<'END'
import { createServer } from "node:http";
const server = createServer((request, response) => response.end("hello\n"));
server.listen(8085, "127.0.0.1", () => {
  console.log(`listening on 127.0.0.1:8085, PID ${process.pid}`);
});
END
```

## Step 2 — Start it in the background

```bash
node hello-server.mjs &
```

Expected: a line like `[1] 3732`, then `listening on 127.0.0.1:8085, PID 3732`. Press Enter
to get a clean prompt.

```bash
jobs -l
```

Expected: `[1]+  3732 Running   node hello-server.mjs &`. Write the PID down.

## Step 3 — See it in the tree

```bash
ps -ef --forest | grep -A1 bash
```

Expected: your `bash` line, and under it `\_ node hello-server.mjs`. The PPID of `node` is
the PID of your `bash`.

## Step 4 — See the port

```bash
ss -ltnp | grep 8085
```

Expected:

```text
LISTEN 0      511        127.0.0.1:8085       0.0.0.0:*    users:(("node",pid=3732,fd=21))
```

Three facts from one line: the address `127.0.0.1`, the port `8085`, the PID.

## Step 5 — Ask it

```bash
curl -s http://127.0.0.1:8085/
```

Expected: `hello`

Now ask a port where nothing listens:

```bash
curl http://127.0.0.1:8086/; echo "exit: $?"
```

Expected: `curl: (7) Failed to connect to 127.0.0.1 port 8086 … Couldn't connect to server`,
then `exit: 7`. Nothing listens there, so the connection is refused at once.

## Step 6 — Start a second copy

```bash
node hello-server.mjs
```

Expected: a long error that contains
`Error: listen EADDRINUSE: address already in use 127.0.0.1:8085`.

Read the message. It names the address and the port. Do **not** fix it by changing the port
in the file: that would start a second server and leave the first one running.

## Step 7 — Stop it politely

```bash
kill 3732
```

Use your own PID. `kill` sends `TERM`.

```bash
jobs
```

Expected: `[1]+  Terminated   node hello-server.mjs`

```bash
ss -ltnp | grep 8085; curl -s http://127.0.0.1:8085/; echo "exit: $?"
```

Expected: no `ss` line, then `exit: 7`. The port is free again.

## Step 8 — Children whose parent ends

```bash
cat > spawn.sh <<'END'
#!/usr/bin/env bash
sleep 300 &
sleep 300 &
sleep 300 &
echo "spawn.sh is PID $$ and now ends"
END
```

```bash
chmod u+x spawn.sh
```

```bash
./spawn.sh
```

Expected: `spawn.sh is PID 3760 and now ends`

```bash
ps -o pid,ppid,cmd -C sleep
```

Expected: three `sleep 300` lines. Their PPID is **not** 3760, because `spawn.sh` has ended.
It is `1`, or on WSL a small number that belongs to `init`. Check with
`ps -o cmd -p <that PPID>`.

Clean up:

```bash
pgrep -f 'sleep 300'
```

```bash
pkill -f 'sleep 300'
```

## What you used

`ps -ef --forest` · `pstree` · `&` · `jobs` · `kill` · `pgrep` · `pkill` · `ss -ltnp` ·
`curl` · `$?`
