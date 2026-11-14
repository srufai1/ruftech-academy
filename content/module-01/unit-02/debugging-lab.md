# Debugging lab — The numbers do not add up

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

The head of ICT wrote a script, `by-address.sh`, that prints how many failed requests each
client address made. She says: "The same address is in the list three times, and the counts
are small. There were 26 failures. The numbers do not add up."

## Start

The lab from project 1.2 already has the files. If you have not run it yet:

```bash
npx academy init m1-p2
```

```bash
cd ~/academy-labs/m1-p2/logs/debug
```

She runs this:

```bash
./by-address.sh access.log
```

## Your work

Do not fix anything yet. Fill in `diagnosis.md` in that folder:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The exact command and what is wrong in the output |
| `## Possible causes` | At least three, for example: the log really has the same address in many places; `uniq` needs sorted input; `awk` prints the wrong column |
| `## Tests` | One command per cause that proves or rules it out, with its output. Run parts of the pipeline by hand: `awk '{print $1}' access.log \| head`, then with `sort \| uniq -c` |
| `## Cause` | The one cause the evidence supports |
| `## Fix` | The smallest change, and the command that shows it now works |

There are **two** faults. The second shows only after the first is fixed. When the first is
fixed, try the other log:

```bash
./by-address.sh "term 1 access.log"
```

Treat what you see as a new problem: observe again, and add a second set of headings to
`diagnosis.md`.

## Fixed state

- `./by-address.sh access.log` prints six lines, one per address. The counts add up to 26.
- `./by-address.sh "term 1 access.log"` prints counts that add up to 4.
- Your script differs from the one you were given by at most two lines. Rewriting the script
  is not a fix.

Check the totals yourself:

```bash
./by-address.sh access.log | awk '{sum += $1} END {print sum}'
```

## Who checks it

This lab is **self-reviewed**. The checker does not mark it yet. Compare your `diagnosis.md`
with the five headings above, and ask yourself: did I write the cause **before** I changed
the script?
