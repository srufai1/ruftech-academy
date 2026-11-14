# Lab — Project 1.2: Log report

**Level:** guided. **Checker:** `m1-p2`. **Time:** about 255 minutes.

The school's web server kept a log for one morning, 14 December 2026. The head of ICT wants
to know which requests failed most. Write a script that answers, and that another program can
trust.

## Start

```bash
npx academy init m1-p2
```

This creates the folder `~/academy-labs/m1-p2/logs`. Work inside it.

```bash
cd ~/academy-labs/m1-p2/logs
```

To start again at any time, run the `init` command again with `--reset`.

What is in the folder:

| Name | What it is |
| :--- | :--- |
| `access.log` | 60 requests, one per line |
| `term 1 access.log` | 12 requests; the name has spaces |
| `no-failures.log` | 5 requests, all successful |
| `empty.log` | an empty file |
| `README.txt` | what each column of a log line means |
| `answers.md` | three headings for your answers |
| `debug/` | for the debugging lab; leave it for now |

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | `report.sh` exists in the lab folder and you can run it as `./report.sh` |
| 2 | `./report.sh access.log` prints the five most common failures, one per line, as `COUNT STATUS PATH`, biggest count first; equal counts in path order (A to Z) |
| 3 | A failure is a line whose status is 400 or more. Lines are grouped by status **and** path |
| 4 | A log with no failures (or no lines) prints exactly `no failures` and exits 0 |
| 5 | A file name with spaces works |
| 6 | No argument: nothing on standard output, a usage line on standard error, exit code 1 |
| 7 | A file that does not exist: nothing on standard output, exit code 2 |
| 8 | `access.log` is unchanged |
| 9 | `answers.md` explains your pipeline |

The exact output for requirement 2:

```text
9 401 /login
6 500 /students/import
4 403 /api/scores
4 404 /favicon.ico
2 500 /reports/print
```

For `term 1 access.log` the output is `3 404 /favicon.ico`, then `1 401 /login`.

## Steps (guided)

1. Read `README.txt`. Then look at the first five lines of `access.log` with `head`.
2. On the command line, print only the failure lines.
3. Print only the status and the path of those lines.
4. Count each status-and-path pair, and rank them.
5. Keep the first five.
6. Make each line exactly `COUNT STATUS PATH`, with one space between the parts.
7. Save the pipeline as `report.sh`, with the shebang and `set -euo pipefail`. Make it
   executable.
8. Replace the file name with `"$1"`.
9. Add the two refusals: no argument (exit 1) and a file you cannot read (exit 2). Messages
   go to standard error.
10. Add the `no failures` case.
11. Run the script yourself on all five inputs: `access.log`, `"term 1 access.log"`,
    `empty.log`, `no-failures.log` and a name that does not exist. Run it once with no
    argument. Check `echo $?` after each.
12. Fill in `answers.md`.

## Hints

- **a.** `awk` can compare a column with a number. Look up `$9 >= 400`.
- **b.** `uniq -c` puts spaces before the count. One more `awk` can print the three columns
  cleanly.
- **c.** To test "is the output empty?", look up `[ -z "…" ]`, or count lines with `grep -c`.

## Questions for `answers.md`

Use these three headings exactly. At least 20 words each, in your own words.

```text
## My pipeline, part by part
## Why uniq needs sort
## How I tested the awkward cases
```

## Check your work

```bash
npx academy check m1-p2
```

Fix what fails and run it again. Every run is recorded; a failed run costs nothing.

## Compare with GPIS

In your read-only copy of GPIS, run `ls scripts/`. Open one script with `less`. Find the line
where it exits when something is wrong. Write one sentence at the end of `answers.md`: which
exit code does it use, and who reads that code?
