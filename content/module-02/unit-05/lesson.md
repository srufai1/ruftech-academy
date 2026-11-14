# Reading and repairing code

Most of a developer's work is on code somebody else wrote. This lesson is about changing it
safely: understand it, prove the bug, fix one line, and leave the rest alone.

## 1. Reading order

Read in this order:

1. **The tests.** They say what the code promises. A test name is a sentence about the rule.
2. **The exports.** What can other files use?
3. **One function at a time.** Write one sentence for each: "`nextAdmissionNumber` takes the
   numbers that exist and a year, and returns the next number."

Code in a style you would not write is not wrong. A `reduce`, a regular expression or an
object lookup may be correct. Understand it before you judge it.

## 2. From report to test

A report says: "For input X I expected Y and got Z." Turn it into a test with exactly that:

```ts
test("numbers from another year are not counted (D-48)", () => {
  assert.equal(nextAdmissionNumber(["ADM/GPIS/2026/150"], 2027), "ADM/GPIS/2027/001");
});
```

Run it. It must **fail**, and fail **for the right reason**: the wrong answer, not "Cannot
find module" or a typo. Read the failure message every time.

The expected answer comes from the **rule** (the D-number), not from what the code does today.

## 3. Finding the cause

Experiments, not guesses:

- **Shrink the input.** One item, not a hundred. Which smallest input still fails?
- **Print one value.** `console.log(JSON.stringify(words))` shows hidden spaces and empty
  strings. Remove the line afterwards.
- **Halve the path.** Is the value right halfway through? Then the bug is in the second half.

Write down what each experiment showed. That is your evidence.

## 4. The smallest fix

Change the line that is wrong. Do **not** rename, reformat or "improve" the lines around it,
even when they are ugly. A fix of one line can be reviewed in a minute; a fix inside a
rewrite cannot be reviewed at all, and brings new bugs.

## 5. Proving it

- The new test passes.
- **Every** old test passes.
- `git diff --stat` is small: it shows how many lines changed in each file.

## 6. The shape of the commits

One bug, two commits:

```text
Test: numbers from another year are not counted (D-48)     ← the failing test
Fix: count only admission numbers of the same year          ← the change
```

Anyone reading the history sees the proof, then the cure. `git add -p` lets you put part of
your work in one commit and the rest in the next.

## 7. In GPIS

AGENTS.md says it plainly:

- "Never change working code merely to make an error message disappear."
- "Stay inside the task. Do not reformat, rename, refactor or 'tidy' code that your task did
  not require. If you notice something wrong nearby, say so and leave it."
- **OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.**

## Common mistakes

1. Fixing before reproducing → you cannot know the fix worked → failing test first.
2. A test that fails for another reason (a typo, a wrong import) → it proves nothing → read
   the failure message.
3. Rewriting the function "more cleanly" → new bugs, and a diff nobody can review → smallest
   change.
4. Changing the test to match the code → the bug becomes the rule → the rule comes from the
   decision, not from the code.
5. Three fixes in one commit → nobody can tell which change did what → one bug, two commits.

## Words to remember

contract · bug report · reproducing test · shrinking · evidence · smallest fix · diff ·
`git diff --stat` · `git add -p` · stay inside the task
