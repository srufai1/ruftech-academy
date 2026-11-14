# Debugging lab — Fixed, and broken again

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

The school office says: "Importing `J.H.S 3` used to work. Since last week the import says
the class is unknown."

The rule is D-45: class names match ignoring case, spacing and punctuation, and the match is
never fuzzy.

## Start

The lab from project 2.5 built this repository too. If you have not run it yet:

```bash
npx academy init m2-p5
```

```bash
cd ~/academy-labs/m2-p5/class-codes
```

Set your name and email for this repository. Then reproduce the report:

```bash
node -e 'import("./classes.ts").then((m) => console.log(m.findClass("J.H.S 3"), m.findClass("JHS 3")))'
```

```bash
npm test
```

## Your work

There is **one** fault. Your work is to find **which commit** brought it in, and why nobody
noticed.

Do not fix anything yet. Fill in `diagnosis.md` in that folder:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The input, the output and the expected output |
| `## Possible causes` | At least three, for example: the list of classes changed; the function changed; the data changed |
| `## Tests` | `git log --oneline`; the one-line reproduction at each commit (`git switch --detach <id>`, run, `git switch main`), or `git bisect`; then `git show <id>` |
| `## Cause` | The commit, the exact line, and what in the shape of that commit made the bug easy to miss |
| `## Fix` | The smallest change, the test you added first, and the command that shows it works |

`git bisect` can do the searching for you:

```bash
git bisect start main <first commit id>
```

```bash
git bisect run node -e 'import("./classes.ts").then((m) => process.exit(m.findClass("J.H.S 3") === "JHS 3" ? 0 : 1)).catch(() => process.exit(125))'
```

```bash
git bisect reset
```

Exit code 125 tells bisect "this commit cannot be tested" — here, the commits before
`classes.ts` existed.

## Fixed state

- `canonicalClassKey("J.H.S 3")` gives `"jhs3"`, and `findClass("J.H.S 3")` gives `"JHS 3"`.
- A new test for a name with several punctuation marks, committed before the fix.
- The fix commit changes one line.
- `diagnosis.md` names the commit that broke it.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it. Compare your `diagnosis.md` with
the five headings, and ask yourself: did I find the commit before I changed the code?
