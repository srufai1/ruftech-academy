# Text, pipes and small scripts

This lesson has two parts. Part A joins small commands. Part B saves them as a script.

## Part A

## A1. One job per command

A web server writes one line for every request. A morning can give thousands of lines. You
want one answer: "which requests failed most?" No single command does that. Linux has many
small commands, and each does one job well. You join them.

Every command has three streams:

- **standard input** — what it reads (the keyboard, or another command's output);
- **standard output** — its result;
- **standard error** — its messages for people ("cannot read file").

You connect them with these signs:

| Sign | Meaning | Example |
| :--- | :--- | :--- |
| `\|` | send the output of the left command into the right command | `cat a.log \| wc -l` |
| `>` | write the output into a file (replaces the file) | `sort a.txt > sorted.txt` |
| `>>` | add the output to the end of a file | `echo done >> notes.txt` |
| `2>` | write standard error into a file | `ls nothere 2> errors.txt` |
| `<` | read standard input from a file | `wc -l < a.log` |

A chain of commands joined by `|` is a **pipeline**.

## A2. Looking inside a file

A log is plain text, one event per line. Look before you count.

- `cat file` prints everything. Good for small files.
- `less file` lets you scroll. `q` leaves.
- `head -n 5 file` shows the first 5 lines; `tail -n 5 file` the last 5.
- `wc -l file` counts lines.

In GPIS, the server log is the first thing you read after a failed sign-in. You find the time,
the address and the status before you guess anything.

## A3. Choosing lines

`grep PATTERN file` prints the lines that contain the pattern.

- `grep -v` prints the lines that do **not** match.
- `grep -c` prints only the number of matching lines.
- `grep -E` allows patterns such as `4[0-9][0-9]` (any number from 400 to 499).
- `^` means "start of line" and `$` means "end of line": `grep '^41\.' file`.

Put the pattern in single quotes. Without them the shell may change it first. `grep ' 404 '`
with spaces finds the status 404. Without spaces it also finds `14/Dec` and a size of `4040`.

## A4. Choosing columns

A log line is a list of columns separated by spaces. `cut -d' ' -f1` keeps column 1. `cut`
breaks when two spaces sit together, because it sees an empty column between them.

`awk` is easier. It splits a line on any run of spaces. `$1` is the first column, `$9` the
ninth:

```bash
awk '{print $9, $7}' access.log
```

`awk` can also choose lines by a number: `awk '$9 >= 400'` keeps lines whose ninth column is
400 or more. That is a numeric comparison, not text.

## A5. Counting and ranking

- `sort` puts lines in order. `sort -n` sorts as numbers. `-r` reverses.
- `uniq -c` counts lines that repeat **next to each other**. So it needs sorted input.
- `sort -k1,1nr -k3,3` sorts by column 1 as a number, biggest first, then by column 3 as text.
  Naming the columns makes the order exact.
- `head -n 5` keeps the first five.

```text
access.log ──grep──▶ failed lines ──awk──▶ "401 /login" ──sort──▶ grouped lines
   (60 lines)          (26 lines)            (26 lines)              (26 lines)
──uniq -c──▶ "9 401 /login" ──sort -k1,1nr──▶ biggest first ──head -n 5──▶ top five
               (6 lines)                         (6 lines)                    (5 lines)
```

Stop here. Do steps 1–5 of the guided example. Then read Part B.

## Part B

## B1. A script is a saved pipeline

A **script** is a text file of commands. You write it once and run it again and again.

```bash
#!/usr/bin/env bash
set -euo pipefail
grep ' 404 ' sample.log | awk '{print $1}' | sort | uniq -c
```

- The first line, the **shebang**, says which program runs the file.
- `set -e` stops the script at the first command that fails.
- `set -u` makes a variable that was never set an error, instead of an empty word.
- `set -o pipefail` makes a pipeline fail when any command in it fails, not only the last.

A new file cannot be run until you give its owner execute permission: `chmod u+x who-404.sh`.
Then run it with `./who-404.sh`. The `./` says "the file in this folder".

## B2. Arguments and quoting

A script should not name its input file inside. The caller gives it. `$1` is the first
argument, `$2` the second, and `$#` is how many arguments there are.

Always write `"$1"` in double quotes. A file named `term 1 access.log` has two spaces. Without
quotes the shell splits it into three words: `term`, `1` and `access.log`. With quotes it stays
one name.

## B3. Exit codes

Every command ends with a number, its **exit code**. `0` means it worked. Any other number
means it did not. `$?` holds the exit code of the last command.

- `exit 1` ends your script with code 1. Use different codes for different problems, and say
  which in the usage text.
- `cmd1 && cmd2` runs `cmd2` only if `cmd1` worked. `cmd1 || cmd2` runs `cmd2` only if it
  failed.
- Messages for people go to standard error: `echo "usage: report.sh FILE" >&2`. Then a
  pipeline that reads your output never mistakes the message for data.

## B4. Tests for a script

A script is not done when it works once. Run it with three inputs every time:

1. a **normal** file — the answer you expect;
2. an **empty** file — does it say something sensible, or print nothing?
3. an **awkward** name — spaces in the name, a file that does not exist.

Save the expected output in a file and compare: `./report.sh a.log > got.txt`, then
`diff expected.txt got.txt`. No output from `diff` means they are the same.

## B5. In GPIS

GPIS has a `scripts/` folder of small checks. CI (the robot that tests every change) runs
them. CI looks only at the exit code. A check that finds a problem but exits 0 makes CI green
by mistake, and the problem ships. That is why your scripts must exit with the real code.

## Common mistakes

1. `uniq -c` without `sort` first → the same line is counted in several groups → always sort
   before `uniq`.
2. `$1` without quotes → a name with a space becomes several arguments → write `"$1"`.
3. Printing an error to standard output → the next command in the pipe reads it as data →
   send it to standard error with `>&2`.
4. `sort -n` on the wrong column → the order looks random → name the key: `-k1,1nr`.
5. Ending a script with `echo done` → the exit code is always 0 → `exit` with the real code.

## Words to remember

standard input · standard output · standard error · pipe · pipeline · redirect · `awk` column ·
shebang · argument · quoting · exit code
