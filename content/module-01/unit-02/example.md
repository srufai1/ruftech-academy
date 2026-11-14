# Guided example — Who asked for pages that do not exist?

You will build a pipeline one command at a time, then save it as a script. You make your own
small log, so nothing here touches the lab.

**Type every command yourself.** Do not paste. Compare what you see with the expected output.

## Step 1 — A folder and a small log

```bash
mkdir -p ~/academy-labs/scratch/u1-2
```

```bash
cd ~/academy-labs/scratch/u1-2
```

The next command is a **here-document**: everything up to the line `END` goes into the file.

```bash
cat > sample.log <<'END'
41.66.201.7 - - [14/Dec/2026:08:00:05 +0000] "GET / HTTP/1.1" 200 2048
41.66.201.7 - - [14/Dec/2026:08:01:10 +0000] "GET /old-page HTTP/1.1" 404 512
41.66.201.7 - - [14/Dec/2026:08:02:15 +0000] "GET /login HTTP/1.1" 200 2048
196.44.12.9 - - [14/Dec/2026:08:03:20 +0000] "GET /favicon.ico HTTP/1.1" 404 512
154.160.3.88 - - [14/Dec/2026:08:04:25 +0000] "GET /students HTTP/1.1" 200 2048
41.66.201.7 - - [14/Dec/2026:08:05:30 +0000] "POST /login HTTP/1.1" 302 0
154.160.3.88 - - [14/Dec/2026:08:06:35 +0000] "GET /favicon.ico HTTP/1.1" 404 512
41.66.201.7 - - [14/Dec/2026:08:07:40 +0000] "GET /dashboard HTTP/1.1" 200 2048
196.44.12.9 - - [14/Dec/2026:08:08:45 +0000] "GET / HTTP/1.1" 200 2048
196.44.12.9 - - [14/Dec/2026:08:09:50 +0000] "GET /favicon.ico HTTP/1.1" 404 512
41.66.201.7 - - [14/Dec/2026:08:10:55 +0000] "GET /students HTTP/1.1" 304 0
154.160.3.88 - - [14/Dec/2026:08:12:00 +0000] "GET /dashboard HTTP/1.1" 200 2048
END
```

```bash
wc -l sample.log
```

Expected: `12 sample.log`

Count the columns of line 1: the address is column 1, the path is column 7, the status is
column 9.

## Step 2 — Only the 404 lines

```bash
grep ' 404 ' sample.log
```

Expected: four lines — `/old-page` once and `/favicon.ico` three times.

The spaces round `404` matter. Without them, `grep 404` would also match a size such as
`4040` or an address that contains `404`.

## Step 3 — Only the address

```bash
grep ' 404 ' sample.log | awk '{print $1}'
```

Expected:

```text
41.66.201.7
196.44.12.9
154.160.3.88
196.44.12.9
```

## Step 4 — Count each address

```bash
grep ' 404 ' sample.log | awk '{print $1}' | sort | uniq -c
```

Expected:

```text
      1 154.160.3.88
      2 196.44.12.9
      1 41.66.201.7
```

Now leave out `sort` and look at the wrong answer:

```bash
grep ' 404 ' sample.log | awk '{print $1}' | uniq -c
```

Expected: four lines, each with the count `1`. The two `196.44.12.9` lines are not next to
each other, so `uniq` sees them as different groups. This is the most common pipeline mistake.

## Step 5 — Biggest first

```bash
grep ' 404 ' sample.log | awk '{print $1}' | sort | uniq -c | sort -k1,1nr -k2,2
```

Expected:

```text
      2 196.44.12.9
      1 154.160.3.88
      1 41.66.201.7
```

`-k1,1nr` sorts by the count as a number, biggest first. `-k2,2` puts equal counts in address
order.

Stop here if you are between Part A and Part B of the lesson.

## Step 6 — Save it as a script

```bash
nano who-404.sh
```

Type this and save:

```bash
#!/usr/bin/env bash
set -euo pipefail
grep ' 404 ' sample.log | awk '{print $1}' | sort | uniq -c | sort -k1,1nr -k2,2
```

```bash
./who-404.sh
```

Expected: `bash: ./who-404.sh: Permission denied`. A new file is not executable.

```bash
chmod u+x who-404.sh
```

```bash
./who-404.sh
```

Expected: the three lines from step 5.

## Step 7 — Take the file name as an argument

Change the script to this:

```bash
#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 1 ]; then
  echo "usage: who-404.sh FILE" >&2
  exit 1
fi
if [ ! -r "$1" ]; then
  echo "cannot read $1" >&2
  exit 2
fi
grep ' 404 ' "$1" | awk '{print $1}' | sort | uniq -c | sort -k1,1nr -k2,2
```

Try all three ways:

```bash
./who-404.sh sample.log; echo "exit: $?"
```

Expected: the three lines, then `exit: 0`.

```bash
./who-404.sh; echo "exit: $?"
```

Expected: `usage: who-404.sh FILE`, then `exit: 1`.

```bash
./who-404.sh nothere.log; echo "exit: $?"
```

Expected: `cannot read nothere.log`, then `exit: 2`.

Now prove the messages are on standard error. Throw standard error away:

```bash
./who-404.sh 2> /dev/null; echo "exit: $?"
```

Expected: only `exit: 1`. The usage line was not on standard output.

## Step 8 — A name with a space

```bash
cp sample.log "my log.txt"
```

```bash
./who-404.sh my log.txt; echo "exit: $?"
```

Expected: `usage: who-404.sh FILE`, then `exit: 1`. Without quotes you gave **two** arguments.

```bash
./who-404.sh "my log.txt"
```

Expected: the three lines from step 5. Inside the script, `"$1"` keeps the name in one piece.

## What you used

`grep` · `awk` · `sort` · `uniq -c` · `wc -l` · `chmod u+x` · `"$1"` · `$#` · `$?` · `>&2` ·
`exit`
