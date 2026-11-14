# Guided example — Two people, one file

You will play two colleagues who edit the same timetable. You will merge their work, resolve a
real conflict, lose a branch and bring it back, and keep a secret out of Git.

**Type every command yourself.** Do not paste. Your commit IDs will be different; that is
normal.

## Step 1 — A new repository

```bash
mkdir -p ~/academy-labs/scratch/u1-4
```

```bash
cd ~/academy-labs/scratch/u1-4
```

```bash
git init -b main
```

Expected: `Initialized empty Git repository in …/u1-4/.git/`

Tell Git who you are, for this repository only:

```bash
git config user.name "Kofi Boateng"
```

```bash
git config user.email "kofi@example.invalid"
```

Make the first file and commit it:

```bash
printf 'Monday: assembly\nTuesday: sports\nWednesday: library\nThursday: music\n' > timetable.md
```

```bash
git status
```

Expected: `timetable.md` under "Untracked files".

```bash
git add timetable.md
```

```bash
git commit -m "Add the weekly timetable"
```

Expected: `[main (root-commit) 4b83bd1] Add the weekly timetable`, then `1 file changed`.

## Step 2 — Colleague one: a branch

```bash
git switch -c add-friday
```

```bash
echo 'Friday: clean-up' >> timetable.md
```

```bash
git commit -am "Add the Friday clean-up"
```

`-a` adds every changed file that Git already tracks. It never adds a new file.

## Step 3 — Colleague two: main moves too

```bash
git switch main
```

```bash
sed -i 's/^Monday: assembly$/Monday: assembly and flag raising/' timetable.md
```

```bash
git commit -am "Add flag raising to Monday"
```

```bash
git log --oneline --graph --all
```

Expected:

```text
* 2b16457 Add the Friday clean-up
| * 13c708a Add flag raising to Monday
|/
* 4b83bd1 Add the weekly timetable
```

Two lines of work from one start.

## Step 4 — A clean merge

```bash
git merge add-friday -m "Merge branch 'add-friday'"
```

Expected: `Merge made by the 'ort' strategy.` The two changes touched different lines, so Git
joined them alone.

```bash
git show --stat HEAD
```

Expected: a commit with a `Merge:` line naming two parents.

Stop here if you are between Part A and Part B of the lesson.

## Step 5 — A real conflict

Colleague one wants drama on Tuesday:

```bash
git switch -c tuesday-drama
```

```bash
sed -i 's/^Tuesday: sports$/Tuesday: drama/' timetable.md
```

```bash
git commit -am "Move drama to Tuesday"
```

Colleague two wants football on the same line:

```bash
git switch main
```

```bash
sed -i 's/^Tuesday: sports$/Tuesday: football/' timetable.md
```

```bash
git commit -am "Make Tuesday sports football"
```

```bash
git merge tuesday-drama
```

Expected: `CONFLICT (content): Merge conflict in timetable.md`

```bash
cat timetable.md
```

Expected:

```text
Monday: assembly and flag raising
<<<<<<< HEAD
Tuesday: football
=======
Tuesday: drama
>>>>>>> tuesday-drama
Wednesday: library
Thursday: music
Friday: clean-up
```

The colleagues agree: football first, then drama. Open the file with `nano timetable.md`.
Replace the five lines from `<<<<<<<` to `>>>>>>>` with one line:

```text
Tuesday: football, then drama
```

```bash
git diff --check
```

Expected: no output. No markers are left.

```bash
git add timetable.md
```

```bash
git commit --no-edit
```

`--no-edit` keeps Git's message, `Merge branch 'tuesday-drama'`.

## Step 6 — Lose a branch

```bash
git switch -c idea
```

```bash
echo 'Saturday: open day' >> timetable.md
```

```bash
git commit -am "Add a Saturday open day"
```

```bash
git switch main
```

```bash
git branch -D idea
```

Expected: `Deleted branch idea (was 7c1e9a2).` `-D` deletes even an unmerged branch.

```bash
git log --oneline --all | grep Saturday
```

Expected: nothing. No branch points to that commit any more.

## Step 7 — Bring it back

```bash
git reflog | head -5
```

Expected: a line such as `7c1e9a2 HEAD@{1}: commit: Add a Saturday open day`.

```bash
git branch idea-back 7c1e9a2
```

Use your own ID.

```bash
git log --oneline idea-back | head -2
```

Expected: `Add a Saturday open day` at the top. The commit was never gone; it had no name.

## Step 8 — Keep a secret out

```bash
echo 'API_KEY=made-up-value-for-practice' > .env
```

```bash
git status --short
```

Expected: `?? .env`. Git offers to add it.

```bash
echo '.env' > .gitignore
```

```bash
git status --short
```

Expected: `?? .gitignore`, and no `.env`.

```bash
git check-ignore -v .env
```

Expected: `.gitignore:1:.env	.env` — the file and the line that ignores it.

```bash
git add .gitignore
```

```bash
git commit -m "Ignore the .env file so secrets stay out of Git"
```

## What you used

`init` · `config` · `status` · `add` · `commit` · `diff --check` · `log --graph` · `switch` ·
`branch` · `merge` · `reflog` · `check-ignore`
